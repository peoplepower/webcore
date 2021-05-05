import { BotApiDal } from '../botApiDal';
import { inject, injectable } from '../../../../modules/common/di';
import { GetAnalyticKeyApiResponse } from './getAnalyticKeyApiResponse';

/**
 * Bot Server APIs are proprietary and closed.
 * See {@link https://iotbots.docs.apiary.io/#reference/bot-server-apis}
 *
 * People Power implements these APIs into the BotEngine class,
 * and expose them only as controlled software APIs to developers.
 *
 */
@injectable('BotServerApi')
export class BotServerApi {

  @inject('BotApiDal') protected readonly dal: BotApiDal;

  getAnalyticKey(params: { appInstanceId: number }): Promise<GetAnalyticKeyApiResponse> {
    return this.dal.get('analytic/appkey', {params: params});
  }

}
