import { Logger } from '../logger/logger';
import { inject, injectable } from '../common/di';
import { Tuner } from '../tuner/tuner';
import { CloudConfigService } from '../../data/services/cloudConfigService';
import { WebSocketConnectionStatus } from './webSocketConnectionStatus';
import { DataWsMessage, SubscribeWsResponse, WsResponseBase } from './wsResponse';
import { WsSubscriptionParams } from './wsSubscriptionParams';
import { SubscriptionStatus, WsSubscription } from './wsSubscription';
import { WsSubscriptionType } from './wsSubscriptionType';
import { AuthService } from '../../data/services/authService';
import { WsPacketGoal } from './wsPacketGoal';
import { LiteEvent } from '../common/liteEvent';
import { Deferred } from '../../common/deferred';
import { WsPacket } from './wsPacket';
import { WsRequestBase } from './wsRequest';
import { WsSubscriptionOperation } from './wsSubscriptionOperation';

const PING_SEQUENCE = '?';
const PONG_SEQUENCE = '!';
const PING_INTERVAL = 30 * 1000; // 30 sec
const PONG_WAIT_INTERVAL = 2 * 60 * 1000; // 2 min
const WS_IDLE_TIMEOUT = 5 * 60 * 1000; // 5 min
const WS_RECONNECT_TIMEOUTS = [0, 5000, 10000, 30000];
const WS_REQUEST_TIMEOUT = 30 * 1000; // 30 sec

/**
 * Web Socket Service.
 *  Allows to send and receive data over the WebSocket channel.
 *  Allows to subscribe to events provided by the server.
 *  Allows to query data in Promise-driven way.
 *  Reconnects when the connection is dropped.
 *  Authenticated automatically when WebCore is authenticated
 *  Closes a connection if it has not been used for a long time.
 *  Has a guaranteed data sending queue.
 *    If the connection was dropped, the request will be processed (subscriptions re-initialized)
 *    after the connection is restored.
 */
@injectable('WsHub')
export class WsHub {

  @inject('Logger') private readonly logger: Logger;
  @inject('Tuner') private readonly tuner: Tuner;
  @inject('CloudConfigService') private readonly cloudConfigService: CloudConfigService;
  @inject('AuthService') private readonly authService: AuthService;

  //region Private fields

  /**
   * WebSocket connection status
   * @private
   */
  private _status: WebSocketConnectionStatus = WebSocketConnectionStatus.DISCONNECTED;

  /**
   * Queue of packets to send
   * @private
   */
  private packetQueue: WsPacket[] = [];

  /**
   * List of active subscriptions
   * @private
   */
  private subscriptions: WsSubscription[] = [];

  /**
   * Web Socket object
   * @private
   * @type {WebSocket}
   */
  private webSocket?: WebSocket;

  /**
   * Counter for request ID
   * @private
   */
  private requestIdCounter: number = 0;

  /**
   * Api key that was used last time to authenticate on WS
   * @private
   */
  private lastUsedApiKey?: string;

  /**
   * Last time pong package was received
   * @private
   */
  private lastPongReceivedTime?: Date;

  /**
   * Interval object for ping-ping
   * @private
   */
  private pingPongInterval: any;

  /**
   * Every reconnect try goes with different timeouts. This field controls which one we use now
   * {@see WS_RECONNECT_TIMEOUTS}
   * @private
   */
  private currentReconnectTimeout: number = 0;

  /**
   * Deferred to control connection process
   * @private
   */
  private connectDeferred?: Deferred<void>;

  /**
   * Deferred to control connect-and-auth process
   * @private
   */
  private connectAndAuthDeferred?: Deferred<void>;

  /**
   * Time of the last WebSocket activity (except ping-pongs)
   * @private
   */
  private lastPacketSendOrReceived: Date = new Date();

  //region Events

  /**
   * On WebSocket status change event
   */
  private readonly onStatusChangeEvent = new LiteEvent<WebSocketConnectionStatus>();

  /**
   * On WebSocket message received message
   */
  private readonly onMessageReceivedEvent = new LiteEvent<WsResponseBase>();

  //endregion

  //endregion

  //region Public fields

  /**
   * Web Socket service status
   */
  public get status(): WebSocketConnectionStatus {
    return this._status;
  }

  //endregion

  constructor() {
    this.authService.onLogin.on(() => {
      if (this.status === WebSocketConnectionStatus.OPEN || this.status === WebSocketConnectionStatus.OPEN_AND_AUTHENTICATED) {
        this.authenticate()
          .catch(() => {
            // Avoid unhandled rejection
          });
      }
    });

    this.startIdleCheck();
  }

  //region Public methods

  /**
   * Ensure that WebSocket connection is up and running.
   * This method also drops inactivity timer
   * @return {Promise} Promise that will be resolved once websocket is up and running
   */
  public ensureConnected(): Promise<void> {
    this.lastPacketSendOrReceived = new Date();

    if (this.status === WebSocketConnectionStatus.OPEN || this.status === WebSocketConnectionStatus.OPEN_AND_AUTHENTICATED) {
      return Promise.resolve();
    }
    if (this.connectDeferred && this.connectDeferred.isPending()) {
      return this.connectDeferred.promise;
    }
    this.connect();
    return this.connectDeferred!.promise;
  }

  /**
   * Ensure that WebSocket connection is up and running.
   * This method also drops inactivity timer
   * @return {Promise}
   */
  public ensureConnectedAndAuthenticated() {
    this.lastPacketSendOrReceived = new Date();

    if (this.status === WebSocketConnectionStatus.OPEN_AND_AUTHENTICATED) {
      return Promise.resolve();
    }
    if (this.connectAndAuthDeferred && this.connectAndAuthDeferred.isPending()) {
      return this.connectAndAuthDeferred.promise;
    }
    this.connect();
    return this.connectAndAuthDeferred!.promise;
  }

  /**
   * Send WS packet and wait for response
   * @param {{ goal: WsPacketGoal }} data
   * @param {boolean} noAuth set true to send without authentication
   * @return {Promise<WsResponseBase>}
   */
  send(data: { goal: WsPacketGoal, [propName: string]: any }, noAuth: boolean = false): Promise<WsResponseBase> {
    this.ensureConnected();
    let request: WsRequestBase = {
      ...data,
      id: this.generateMessageId(),
    };
    let packet = new WsPacket(request, !noAuth);
    this.packetQueue.push(packet);
    this.processPacketQueue();
    return packet.receiveDeferred.promise; // return deferred that will be resolved when packet response will be received;
  }

  subscribe(type: WsSubscriptionType,
            operation: WsSubscriptionOperation,
            params: WsSubscriptionParams): WsSubscription {
    let subscription = new WsSubscription(type, operation, params);

    this.ensureConnectedAndAuthenticated();

    this.subscriptions.push(subscription);
    this.processSubscriptions();
    this.processPacketQueue();

    subscription.onUnsubscribe(() => {
      this.subscriptions = this.subscriptions.filter(s => s !== subscription);
      subscription.status = SubscriptionStatus.CANCELLED;
      if (this.webSocket!.readyState === WebSocket.OPEN && !!subscription.id) {
        let dataString = this.encode({
          id: this.generateMessageId(),
          goal: WsPacketGoal.Unsubscribe,
          subscription: {
            id: subscription.subscriptionId,
          },
        });
        this.webSocket!.send(dataString);
        this.logger.debug('[WebSocket] Message sent: ' + dataString);
        this.lastPacketSendOrReceived = new Date();
      }
      subscription.destroy();
    });

    return subscription;
  }

  // Not implemented yet
  // request(params: Object, noAuth: boolean = false): Promise<RequestWsResponse> {
  //   return this.send({
  //     goal: WsPacketGoal.Request,
  //     ...params
  //   });
  // }
  //
  // update(params: Object, noAuth: boolean = false): Promise<UpdateWsResponse> {
  //   return this.send({
  //     goal: WsPacketGoal.Update,
  //     ...params
  //   });
  // }
  //
  // create(params: Object, noAuth: boolean = false): Promise<CreateWsResponse> {
  //   return this.send({
  //     goal: WsPacketGoal.Create,
  //     ...params
  //   });
  // }
  //
  // delete(params: Object, noAuth: boolean = false): Promise<DeleteWsResponse> {
  //   return this.send({
  //     goal: WsPacketGoal.Delete,
  //     ...params
  //   });
  // }

  /**
   * Subscribe for new WebSocket messages
   * @param {(data: WsResponseBase) => void} callback
   * @return {() => void} unsubscribe function
   */
  onMessage(callback: (data?: WsResponseBase) => void): () => void {
    this.onMessageReceivedEvent.on(callback);
    return () => {
      this.onMessageReceivedEvent.off(callback);
    };
  }

  /**
   * Subscribe for status change event
   * @param {(data: WebSocketConnectionStatus) => void} callback
   * @return {() => void} unsubscribe function
   */
  onStatusChange(callback: (status?: WebSocketConnectionStatus) => void) {
    this.onStatusChangeEvent.on(callback);
    return () => {
      this.onStatusChangeEvent.off(callback);
    };
  }

  //endregion

  private connect() {
    if (this.webSocket) {
      this.logger.debug('[WebSocket] Closing WebSocket connection for reconnection');
      // @ts-ignore
      this.webSocket.unsubscribeEvents();
      this.webSocket.close(1012, 'Reconnecting');
      this.setStatus(WebSocketConnectionStatus.DISCONNECTED);
      this.webSocket = undefined;
    }

    if (!this.connectDeferred || !this.connectDeferred.isPending()) {
      this.connectDeferred = new Deferred<void>();
    }
    if (!this.connectAndAuthDeferred || !this.connectAndAuthDeferred.isPending()) {
      this.connectAndAuthDeferred = new Deferred<void>();
    }

    this.setStatus(WebSocketConnectionStatus.CONNECTING);
    return this.cloudConfigService.getWebSocketUrl()
      .then(url => this.initWebSocket(url));
  }

  /**
   * Init WebSocket connection
   * @param {string} url WebSocket server URL
   * @private
   */
  private initWebSocket(url: string) {
    this.setStatus(WebSocketConnectionStatus.CONNECTING);
    this.webSocket = new WebSocket(url);

    let onOpenFunc = (event: Event) => {
      this.onWsOpen(event);
    };
    let onCloseFunc = (event: CloseEvent) => {
      this.onWsClose(event);
    };
    let onErrorFunc = (event: Event) => {
      this.onWsError(event);
    };
    let onMessageFunc = (event: MessageEvent) => {
      this.onWsMessage(event);
    };

    this.webSocket.addEventListener('open', onOpenFunc);
    this.webSocket.addEventListener('close', onCloseFunc);
    this.webSocket.addEventListener('error', onErrorFunc);
    this.webSocket.addEventListener('message', onMessageFunc);

    // Synthetic function to unsubscribe from all WS callback
    //   to avoid calls from old WebSocket instance once recreated
    // @ts-ignore
    this.webSocket.unsubscribeEvents = () => {
      this.webSocket?.removeEventListener('open', onOpenFunc);
      this.webSocket?.removeEventListener('close', onCloseFunc);
      this.webSocket?.removeEventListener('error', onErrorFunc);
      this.webSocket?.removeEventListener('message', onMessageFunc);
    };
  }

  //region Web Socket event handlers

  private onWsOpen(event: Event) {
    this.logger.debug('[WebSocket] WebSocket connection was successfully established');
    this.setStatus(WebSocketConnectionStatus.OPEN);

    this.currentReconnectTimeout = 0;

    if (this.connectDeferred && this.connectDeferred.isPending()) {
      this.connectDeferred.resolve();
      this.connectDeferred = undefined;
    }

    this.startPingPong();

    // Try authenticate as soon as we connected
    this.authenticate()
      .catch(() => {
        // Avoid unhandled rejection
      });

    this.processSubscriptions();
    this.processPacketQueue();
  }

  private onWsClose(event: CloseEvent) {
    this.logger.debug('[WebSocket] WebSocket connection was closed');
    this.setStatus(WebSocketConnectionStatus.DISCONNECTED);

    // Try to reconnect
    setTimeout(() => {
      if (this.status !== WebSocketConnectionStatus.DISCONNECTED) {
        return;
      }
      if (this.currentReconnectTimeout < WS_RECONNECT_TIMEOUTS.length - 1) {
        this.currentReconnectTimeout++;
      }
      this.connect();
    }, WS_RECONNECT_TIMEOUTS[this.currentReconnectTimeout]);

    // Process sending queue
    this.packetQueue = this.packetQueue.filter((packet) => {
      if (!packet.received) {
        packet.sent = undefined;
      }
      if ([
        WsPacketGoal.Auth,
        WsPacketGoal.Subscribe,
        WsPacketGoal.Unsubscribe,
        WsPacketGoal.Status,
      ].includes(packet.goal)) {
        packet.receiveDeferred.reject('WebSocket connection was terminated. This request no longer makes sense.');
        return false;
      }

      return true;
    });

    this.subscriptions.forEach(s => {
      s.status = SubscriptionStatus.INACTIVE;
    });

    // Destroy webSocket object
    // @ts-ignore
    this.webSocket?.unsubscribeEvents();
    this.webSocket = undefined;
  }

  private onWsError(event: Event) {
    this.setStatus(WebSocketConnectionStatus.DISCONNECTED);

    this.logger.warn('[WebSockets] WebSocket connection error:');
    this.logger.warn(event);

    // Note: onWsClose callback will be called always after onWsError callback
  }

  private onWsMessage(event: MessageEvent) {
    if (!event || !event.data) {
      return;
    }

    let data = event.data;

    let handled = false;

    if (data === PING_SEQUENCE) { // Handle ping packet
      if (this.webSocket?.readyState === WebSocket.OPEN) {
        this.webSocket.send(PONG_SEQUENCE);
      }
      handled = true;
    } else if (data === PONG_SEQUENCE) { // Handle pong packet
      if (this.webSocket?.readyState === WebSocket.OPEN) {
        this.lastPongReceivedTime = new Date();
      }
      handled = true;
    } else if (typeof data === 'string') { // handle plain JSON packet
      let decoded = this.decode(data);
      if (!decoded) {
        return;
      }
      let jsonObj: WsResponseBase = decoded!;

      this.lastPacketSendOrReceived = new Date();
      this.logger.debug('[WebSocket] Received message: ' + data);

      let isError: boolean = jsonObj.resultCode !== 0;
      let errorMsg = jsonObj.resultCodeMessage;

      // Process packets
      this.packetQueue.forEach((packet) => {
        if (packet.id === jsonObj.id && packet.goal === jsonObj.goal) {
          handled = true;
          packet.received = new Date();
          packet.response = jsonObj;
          if (!isError) {
            packet.receiveDeferred.resolve(jsonObj);
          } else {
            packet.receiveDeferred.reject(errorMsg);
          }
        }
      });
      this.packetQueue = this.packetQueue.filter(p => !p.received);

      // Process subscriptions
      this.subscriptions.filter(s => {
        if (s.id === jsonObj.id) {
          handled = true;
          if (jsonObj.goal === WsPacketGoal.Subscribe) {
            if (isError) {
              s.status = SubscriptionStatus.INACTIVE;
              s.errorEvent.trigger(jsonObj);
            } else {
              s.status = SubscriptionStatus.ACTIVE;
              s.subscriptionId = (<SubscribeWsResponse>jsonObj).subscriptionId;
            }
          } else if (jsonObj.goal === WsPacketGoal.Unsubscribe) {
            s.status = SubscriptionStatus.CANCELLED;
            return false;
          } else if (jsonObj.goal === WsPacketGoal.Data) {
            let dataMessage = jsonObj as DataWsMessage;
            if (isError) {
              s.errorEvent.trigger(dataMessage);
            } else if (dataMessage.data.operation === WsSubscriptionOperation.CREATE) {
              s.createEvent.trigger(dataMessage.data);
            } else if (dataMessage.data.operation === WsSubscriptionOperation.UPDATE) {
              s.editEvent.trigger(dataMessage.data);
            } else if (dataMessage.data.operation === WsSubscriptionOperation.DELETE) {
              s.deleteEvent.trigger(dataMessage.data);
            }
          }
        }
        return true;
      });

      this.onMessageReceivedEvent.trigger(jsonObj);
    }

    if (!handled) {
      this.logger.debug('[WebSocket] Incoming WebSocket packet was not handled:');
      this.logger.debug(data);
    }
  }

  //endregion

  //region Ping / Pong

  private startPingPong() {
    this.lastPongReceivedTime = new Date();
    this.pingPongInterval = globalThis.setInterval(() => {
      if (this.webSocket?.readyState !== WebSocket.OPEN) {
        this.stopPingPong();
        return;
      }
      if (new Date().getTime() - this.lastPongReceivedTime!.getTime() > PONG_WAIT_INTERVAL && this.webSocket) {
        // Seems server is down, we need to reconnect
        this.webSocket.close(1002, `No PONG packet from server for ${PONG_WAIT_INTERVAL} ms`);
        this.webSocket = undefined;
        this.setStatus(WebSocketConnectionStatus.DISCONNECTED);
      }

      this.webSocket?.send(PING_SEQUENCE);
    }, PING_INTERVAL);
  }

  private stopPingPong() {
    if (this.pingPongInterval) {
      clearInterval(this.pingPongInterval);
      this.pingPongInterval = undefined;
    }
    this.lastPongReceivedTime = undefined;
  }

  //endregion

  private processPacketQueue() {
    if (this.status !== WebSocketConnectionStatus.OPEN && this.status !== WebSocketConnectionStatus.OPEN_AND_AUTHENTICATED) {
      return;
    }
    if (!this.webSocket || this.webSocket.readyState !== WebSocket.OPEN) {
      return;
    }

    this.packetQueue
      .forEach((packet) => {
        if (packet.sent) {
          return;
        }

        if (this.status === WebSocketConnectionStatus.OPEN_AND_AUTHENTICATED ||
          (packet.needAuth === false && this.status === WebSocketConnectionStatus.OPEN)) {
          packet.attempt++;
          packet.sent = new Date();
          let dataString = this.encode(packet.request);
          this.webSocket!.send(dataString);
          this.logger.debug('[WebSocket] Message sent: ' + dataString);

          // Start response check timeout
          setTimeout(() => {
            if (this.packetQueue.includes(packet)
              && !packet.received
              && !!packet.sent
              && new Date().getTime() - packet.sent.getTime() >= WS_REQUEST_TIMEOUT) {
              packet.sent = undefined; // drop packet send status
              this.logger.warn(`[WebSockets] Request timeout. Server did not respond within ${WS_REQUEST_TIMEOUT / 1000} seconds for request with id="${packet.id}"`);

              // Maybe we need to reconnect?
              // this.webSocket.close(1012, `Request timeout. Server did not respond within ${WS_REQUEST_TIMEOUT/1000} seconds`);
              // this.webSocket = undefined;
              // this.setStatus(WebSocketConnectionStatus.DISCONNECTED);
            }
          }, WS_REQUEST_TIMEOUT);

          this.lastPacketSendOrReceived = new Date();
        }
      });
  }

  private processSubscriptions() {
    // Subscriptions available only for authenticated users
    if (this.status !== WebSocketConnectionStatus.OPEN_AND_AUTHENTICATED) {
      return;
    }
    if (!this.webSocket || this.webSocket.readyState !== WebSocket.OPEN) {
      return;
    }

    this.subscriptions
      .filter(s => s.status === SubscriptionStatus.INACTIVE)
      .forEach(s => {
        s.status = SubscriptionStatus.PENDING;
        s.id = this.generateMessageId();
        let dataString = this.encode({
          id: s.id,
          goal: WsPacketGoal.Subscribe,
          subscription: {
            type: s.type,
            operation: s.operation,
            ...s.params,
          },
        });
        this.webSocket!.send(dataString);
        this.logger.debug('[WebSocket] Message sent: ' + dataString);
        this.lastPacketSendOrReceived = new Date();
      });
  }

  private encode(request: any): string {
    return JSON.stringify(request);
  }

  private decode(response: string): WsResponseBase | undefined {
    let jsonObj: WsResponseBase;
    try {
      jsonObj = JSON.parse(response);
    } catch (e) {
      this.logger.warn('[WebSockets] Unable to parse JSON from server message: ' + response);
      return;
    }

    // Checking JSON format
    // tslint:disable-next-line:triple-equals
    if (!jsonObj || jsonObj.id == null || jsonObj.goal == null || jsonObj.resultCode == null) {
      this.logger.warn('[WebSockets] Wrong WebSocket packet format: ' + response);
      return;
    }

    return jsonObj;
  }

  private authenticate(): Promise<void> {
    if (this.status !== WebSocketConnectionStatus.OPEN && this.status !== WebSocketConnectionStatus.OPEN_AND_AUTHENTICATED) {
      this.logger.debug('[WebSocket] Unable to authenticate on WebSocket channel. WebSocket connection is not in Open state.');
      return Promise.reject();
    }

    if (!this.authService.isAuthenticated()) {
      this.logger.debug('[WebSocket] Unable to authenticate on WebSocket channel. No authentication token present in WebCore. Authenticate in authService first.');
      return Promise.reject();
    }

    if (this.status === WebSocketConnectionStatus.OPEN_AND_AUTHENTICATED && this.lastUsedApiKey === this.authService.apiKey) {
      // avoid double authentication
      return Promise.resolve();
    }
    this.lastUsedApiKey = this.authService.apiKey;
    return this.send({
      key: this.authService.apiKey,
      goal: WsPacketGoal.Auth,
    }, true)
      .then(() => {
        if (this.status !== WebSocketConnectionStatus.OPEN) {
          return;
        }
        this.logger.debug('[WebSocket] Successfully authenticated on WebSocket channel');
        this.setStatus(WebSocketConnectionStatus.OPEN_AND_AUTHENTICATED);

        if (this.connectAndAuthDeferred && this.connectAndAuthDeferred.isPending()) {
          this.connectAndAuthDeferred.resolve();
          this.connectAndAuthDeferred = undefined;
        }

        this.processSubscriptions();
        this.processPacketQueue();
      })
      .catch((err) => {
        this.logger.warn('[WebSocket] Unable to authenticate on WebSocket channel. See error below');
        this.logger.warn(err);
        return Promise.reject();
      });
  }

  /**
   * Generate unique message ID
   */
  private generateMessageId(): string {
    // Now we use integer counter. If something will goes wrong - we'll switch to GUID (see commented code below)
    this.requestIdCounter++;
    if (this.requestIdCounter >= Number.MAX_SAFE_INTEGER) {
      this.requestIdCounter = 1;
    }
    return this.requestIdCounter.toString(10);

    // Generate UUIDs for globally unique values
    // if (crypto && crypto.getRandomValues && Uint8Array) {
    //   return ('' + 1e7 + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: string) =>
    //     // @ts-ignore
    //     (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    //   );
    // } else {
    //   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    //     .replace(/[xy]/g, function (c) {
    //       let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    //       return v.toString(16);
    //     });
    // }
  }

  private setStatus(newStatus: WebSocketConnectionStatus) {
    if (this._status === newStatus) {
      return;
    }
    this._status = newStatus;
    this.logger.debug('[WebSocket] WebSocket Hub status changed to: ', this._status);

    this.onStatusChangeEvent.trigger(this._status);

    if (newStatus !== WebSocketConnectionStatus.OPEN) {
      this.stopPingPong();
    }
  }

  private startIdleCheck() {
    setInterval(() => {
      if (this.webSocket?.readyState === WebSocket.OPEN
        && this.packetQueue?.length === 0
        && this.subscriptions?.length === 0
        && new Date().getTime() - this.lastPacketSendOrReceived.getTime() >= WS_IDLE_TIMEOUT) {

        this.logger.debug('[WebSocket] Closing idle WebSocket connection');
        // @ts-ignore
        this.webSocket.unsubscribeEvents();
        this.setStatus(WebSocketConnectionStatus.DISCONNECTED);
        this.webSocket.close(1000, 'Idle');
        this.webSocket = undefined;
      }
    }, WS_IDLE_TIMEOUT);
  }

}
