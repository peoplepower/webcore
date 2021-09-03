import { inject, injectable } from '../../../modules/common/di';
import { BotServerApi } from './botServer/botServerApi';
import { BotShopApi } from './endUserBotShop/endUserBotShopApi';

@injectable('BotApi')
export class BotApi {
  @inject('BotServerApi') public readonly botServerApi!: BotServerApi;
  @inject('BotShopApi') public readonly botShopApi!: BotShopApi;
}
