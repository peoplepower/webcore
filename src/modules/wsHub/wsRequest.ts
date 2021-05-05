import { WsPacketGoal } from './wsPacketGoal';
import { WsSubscriptionType } from './wsSubscriptionType';
import { WsSubscriptionParams } from './wsSubscriptionParams';

export interface WsRequestBase {
  id: string;
  goal: WsPacketGoal;
}

export interface AuthWsRequest extends WsRequestBase {
  goal: WsPacketGoal.Auth;
  key: string;
}

export interface PresenceWsRequest extends WsRequestBase {
  goal: WsPacketGoal.Presence;
}

export interface SubscribeWsRequest extends WsRequestBase {
  goal: WsPacketGoal.Subscribe;
  subscription: {
    type: WsSubscriptionType;
  } & WsSubscriptionParams;
}

export interface UnsubscribeWsRequest extends WsRequestBase {
  goal: WsPacketGoal.Unsubscribe;
  subscription: {
    /**
     * Request ID, which made this subscription
     */
    id: string;
  };
}

export interface StatusWsRequest extends WsRequestBase {
  goal: WsPacketGoal.Status;
}

// Not implemented yet
// export interface RequestWsRequest extends WsRequestBase {
//   goal: WsPacketGoal.Request;
//   // ...
// }
// export interface UpdateWsRequest extends WsRequestBase {
//   goal: WsPacketGoal.Update;
//   // ...
// }
// export interface CreateWsRequest extends WsRequestBase {
//   goal: WsPacketGoal.Create;
//   // ...
// }
// export interface DeleteWsRequest extends WsRequestBase {
//   goal: WsPacketGoal.Delete;
//   // ...
// }
