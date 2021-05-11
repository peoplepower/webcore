import Axios, { AxiosResponse } from 'axios';
import { LiteEvent } from '../../modules/common/liteEvent';
import { CloudConfigService } from './cloudConfigService';
import { inject, injectable } from '../../modules/common/di';
import { BaseService } from './baseService';
import { Tuner } from '../../modules/tuner/tuner';

// Default values. Real values come from configuration
const INITIAL_PING_INTERVAL = 1000;
const PING_INTERVAL_INCREASE = 1000;
const MAX_PING_INTERVAL = 5000;
const AFTER_PING_TIMEOUT = 100;

@injectable('OfflineService')
export class OfflineService extends BaseService {
  @inject('CloudConfigService') private readonly cloudConfigService: CloudConfigService;
  @inject('Tuner') private readonly tuner: Tuner;

  public readonly onDisconnected: LiteEvent<string> = new LiteEvent<string>();
  public readonly onConnected: LiteEvent<string> = new LiteEvent<string>();

  private pingPromise: Promise<void> | undefined;
  private whenConnectedPromise: Promise<void> | undefined;

  private _offline: boolean = false;
  public get offline(): boolean {
    return this._offline;
  }

  /**
   * Internal online/offline state, just to manage events
   */
  private state: OnlineState = OnlineState.Online;

  private setState(state: OnlineState) {
    if (state === this.state) {
      return;
    }
    this.state = state;
    if (state === OnlineState.Online) {
      this.onConnected.trigger();
    } else if (state === OnlineState.Offline) {
      this.onDisconnected.trigger();
    }
  }

  /**
   * Wait until server will be online
   * @returns {Promise<void>}
   */
  public waitOnline(): Promise<void> {
    if (this._offline && this.whenConnectedPromise) {
      return this.whenConnectedPromise;
    }
    return Promise.resolve();
  }

  /**
   * Ping server until it will respond correctly
   * @returns {Promise<string>}
   */
  public goOfflineAndWaitOnline(): Promise<void> {
    if (this.whenConnectedPromise) {
      return this.whenConnectedPromise;
    }
    this._offline = true;
    this.whenConnectedPromise = this.pingRecursive(this.tuner.config?.ping?.initialPingInterval || INITIAL_PING_INTERVAL).then(() => {
      this._offline = false;
      delete this.whenConnectedPromise;
      this.setState(OnlineState.Online);
    });

    return this.whenConnectedPromise;
  }

  private pingRecursive(nextPingTimeout: number): Promise<void> {
    let me = this;
    return me
      .ping()
      .then(() => {
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            setTimeout(() => {
              me.setState(OnlineState.Online);
            });
            resolve();
          }, this.tuner.config?.ping?.afterPingTimeout || AFTER_PING_TIMEOUT);
        });
      })
      .catch(() => {
        me.setState(OnlineState.Offline);
        let timeout = nextPingTimeout + (this.tuner.config?.ping?.pingIntervalIncrease || PING_INTERVAL_INCREASE);
        if (timeout > (this.tuner.config?.ping?.maxPingInterval || MAX_PING_INTERVAL)) {
          timeout = this.tuner.config?.ping?.maxPingInterval || MAX_PING_INTERVAL;
        }
        return new Promise<void>(function (resolve) {
          setTimeout(() => {
            resolve(me.pingRecursive(timeout));
          }, timeout);
        });
      });
  }

  /**
   * Ping server once
   * @returns {Promise<string>}
   */
  public ping() {
    if (this.pingPromise) {
      return this.pingPromise;
    }

    this.pingPromise = this.cloudConfigService
      .getBaseUrl()
      .then((url) => {
        return Axios.get('espapi/watch', { baseURL: url });
      })

      .then((resp) => {
        if (resp && resp.status === 200) {
          this.logger.debug(`ping request OK`);
          delete this.pingPromise;
          return;
        } else {
          return Promise.reject(resp);
        }
      })

      .catch((err: AxiosResponse) => {
        delete this.pingPromise;
        this.logger.debug(`ping request failed: ${err.status} ${err.statusText}`);
        return Promise.reject(err);
      });

    return this.pingPromise;
  }
}

export enum OnlineState {
  Online = 'ONLINE',
  Offline = 'OFFLINE',
}
