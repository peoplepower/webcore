import { WsRequestBase } from './wsRequest';
import { WsResponseBase } from './wsResponse';
import { Deferred } from '../../common/deferred';
import { WsPacketGoal } from './wsPacketGoal';

export class WsPacket {
  public response: WsResponseBase;

  public readonly created: Date = new Date();
  public sent?: Date;
  public received?: Date;

  public readonly receiveDeferred: Deferred<WsResponseBase> = new Deferred<WsResponseBase>();

  public attempt: number = 0;

  public readonly id: string;
  public readonly goal: WsPacketGoal;

  constructor(public readonly request: WsRequestBase, public readonly needAuth: boolean = true) {
    this.id = request.id;
    this.goal = request.goal;
  }
}
