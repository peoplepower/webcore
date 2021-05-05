import { WsSubscriptionType } from './wsSubscriptionType';
import { WsSubscriptionParams } from './wsSubscriptionParams';
import { WsSubscriptionOperation } from './wsSubscriptionOperation';
import { LiteEvent } from '../common/liteEvent';
import { DataWsMessage } from './wsResponse';

export class WsSubscription {

  /**
   * Id of the request that create that subscription
   */
  public id: string | undefined;

  /**
   * Subscription ID generated by the server (used only for unsubscribe)
   */
  public subscriptionId: string | undefined;

  get status(): SubscriptionStatus {
    return this._status;
  }

  set status(value: SubscriptionStatus) {
    if (value !== this._status) {
      this._status = value;
      this.statusChangeEvent.trigger(value);
    }
  }

  createEvent: LiteEvent<DataWsMessage['data']> = new LiteEvent<DataWsMessage['data']>();
  editEvent: LiteEvent<DataWsMessage['data']> = new LiteEvent<DataWsMessage['data']>();
  deleteEvent: LiteEvent<DataWsMessage['data']> = new LiteEvent<DataWsMessage['data']>();
  errorEvent: LiteEvent<any> = new LiteEvent<any>();
  private statusChangeEvent: LiteEvent<SubscriptionStatus> = new LiteEvent<SubscriptionStatus>();
  private unsubscribeEvent: LiteEvent<void> = new LiteEvent<void>();

  private _status: SubscriptionStatus = SubscriptionStatus.INACTIVE;

  constructor(public readonly type: WsSubscriptionType,
              public readonly operation: WsSubscriptionOperation,
              public readonly params: WsSubscriptionParams) {
  }

  onCreate(callback: (data?: DataWsMessage['data']) => void): () => void {
    this.createEvent.on(callback);
    return () => {
      this.createEvent.off(callback);
    };
  }

  onEdit(callback: (data?: DataWsMessage['data']) => void): () => void {
    this.editEvent.on(callback);
    return () => {
      this.editEvent.off(callback);
    };
  }

  onDelete(callback: (data?: DataWsMessage['data']) => void): () => void {
    this.deleteEvent.on(callback);
    return () => {
      this.deleteEvent.off(callback);
    };
  }

  onError(callback: (data?: any) => void): () => void {
    this.errorEvent.on(callback);
    return () => {
      this.errorEvent.off(callback);
    };
  }

  onStatusChange(callback: (data?: SubscriptionStatus) => void): () => void {
    this.statusChangeEvent.on(callback);
    return () => {
      this.statusChangeEvent.off(callback);
    };
  }

  onUnsubscribe(callback: () => void): () => void {
    this.unsubscribeEvent.on(callback);
    return () => {
      this.unsubscribeEvent.off(callback);
    };
  }

  unsubscribe() {
    this.status = SubscriptionStatus.CANCELLED;
    this.unsubscribeEvent.trigger();
  }

  destroy() {
    this.createEvent.reset();
    this.editEvent.reset();
    this.deleteEvent.reset();
    this.errorEvent.reset();
    this.statusChangeEvent.reset();
    this.unsubscribeEvent.reset();
  }
}

export enum SubscriptionStatus {
  /**
   * Subscriptions is in inactive state
   */
  INACTIVE = 'inactive',

  /**
   * Subscription is up and running
   */
  ACTIVE = 'active',

  /**
   * Subscription is in creation process
   */
  PENDING = 'pending',

  /**
   * Subscription was cancelled (by unsubscribe method). Once unsubscribed, you can not use subscription.
   */
  CANCELLED = 'cancelled'
}
