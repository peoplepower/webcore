import { WsPacketGoal } from './wsPacketGoal';
import { WsSubscriptionType } from './wsSubscriptionType';
import { WsSubscriptionParams } from './wsSubscriptionParams';
import { WsSubscriptionOperation } from './wsSubscriptionOperation';

export interface WsResponseBase {
  /**
   * Unique request identifier
   */
  id: string;

  /**
   * Request type (goal)
   */
  goal: WsPacketGoal;

  /**
   * @see {API_ERROR_CODES}
   */
  resultCode: number;

  /**
   * Optional error message
   */
  resultCodeMessage?: string;
}

export interface AuthWsResponse extends WsResponseBase {
  goal: 1;
}

export interface PresenceWsResponse extends WsResponseBase {
  goal: 2;
  types: Array<WsSubscriptionType>;
}

export interface SubscribeWsResponse extends WsResponseBase {
  goal: 3;
  /**
   * Server-generated ID of the subscription
   */
  subscriptionId: string;
}

export interface UnsubscribeWsResponse extends WsResponseBase {
  goal: 4;
}

export interface StatusWsResponse extends WsResponseBase {
  goal: 5;
  subscriptions: Array<{
    /**
     * Request ID, which made this subscription
     */
    requestId: string;

    /**
     * Subscription type
     */
    type: WsSubscriptionType;

    // Other fields here (subscription params)
  } & WsSubscriptionParams>;
}

/**
 * Subscription data message
 */
export interface DataWsMessage extends WsResponseBase {
  goal: 6;
  data: {
    type: WsSubscriptionType;
    operation: WsSubscriptionOperation;
    [field: string]: any;
  };
}
