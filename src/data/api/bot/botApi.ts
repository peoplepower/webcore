import { inject, injectable } from '../../../modules/common/di';
import { BotShopApi } from './endUserBotShop/endUserBotShopApi';

@injectable('BotApi')
export class BotApi {
  @inject('BotShopApi') public readonly botShopApi!: BotShopApi;
}
