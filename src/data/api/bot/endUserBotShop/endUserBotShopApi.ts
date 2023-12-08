import { BotApiDal } from '../botApiDal';
import { inject, injectable } from '../../../../modules/common/di';
import { PurchaseBotApiResponse } from './purchaseBotApiResponse';
import { GetListOfBotsApiResponse } from './getListOfBotsApiResponse';
import { BotInstanceStatus, ConfigureBotApiResponse, ConfigureBotBody } from './configureBotApiResponse';
import { GetBotInfoApiResponse } from './getBotInfoApiResponse';
import { ApiResponseBase } from '../../../models/apiResponseBase';
import { BotCategory, BotCoreClass, BotObjectName, BotType, SearchBotsApiResponse } from './searchBotsApiResponse';
import { GetBotSummaryApiResponse } from './getBotSummaryApiResponse';
import { DataStreamMessage, DataStreamScope } from './dataStreamMessageApiResponse';

/**
 * The Bot Shop APIs allow a user to discover and manage their bots.
 * See {@link https://iotbots.docs.apiary.io/#reference/end-user-bot-shop-apis/purchase-a-new-bot-instance}
 */
@injectable('BotShopApi')
export class BotShopApi {
  @inject('BotApiDal') protected readonly dal!: BotApiDal;

  /**
   * Search for available bots.
   * See {@link https://iotbots.docs.apiary.io/#reference/end-user-bot-shop-apis/bot-shop-search/search}
   *
   * @param [params] Request parameters.
   * @param {string} [params.searchBy] Search in name, author, keywords, bundle. Use * for a wildcard.
   * @param {BotCategory | BotCategory[]} [params.category] Category search. i.e. 'S', 'E', etc. Multiple values are allowed and OR-ed.
   * @param {boolean} [params.compatible] Filter by bots that are compatible with our user account or not, leave blank to return all bots.
   * @param {string} [params.lang] Language filter, i.e. 'en'. Leave blank to return bots in all languages
   * @param {BotType} [params.type] Filter by the bot type field.
   * @param {BotType} [params.core] Filter by the bot core class.
   * @param {number} [params.locationId] Return bots available for this location.
   * @param {number} [params.organizationId] Return bots available for this organization.
   * @param {BotObjectName} [params.objectName] Show objects with such name(s). Multiple values are allowed.
   * @param {number} [params.limit] Limit the response size
   * @returns {Promise<SearchBotsApiResponse>}
   */
  searchBots(params?: {
    searchBy?: string;
    category?: BotCategory | BotCategory[];
    compatible?: boolean;
    lang?: string;
    type?: BotType;
    core?: BotCoreClass;
    locationId?: number;
    organizationId?: number;
    objectName?: BotObjectName;
    limit?: number;
  }): Promise<SearchBotsApiResponse> {
    return this.dal.get('cloud/appstore/search', {params: params});
  }

  /**
   * Retrieve bot information.
   * See {@link https://iotbots.docs.apiary.io/#reference/end-user-bot-shop-apis/bot-information/get-bot-information}
   *
   * @param params Request parameters.
   * @param {string} params.bundle Globally unique bundle ID for the app
   * @param {string} [params.lang] Language identifier, default is user's language or 'en'
   * @param {string} [params.lastNVersions] Max number of versions to show, default is 10
   * @param {BotObjectName} [params.objectName] Show objects with such name(s). Multiple values are allowed.
   * @returns {Promise<GetBotInfoApiResponse>}
   */
  getBotInfo(params: {
    bundle: string;
    lang?: string;
    lastNVersions?: number;
    objectName?: BotObjectName;
  }): Promise<GetBotInfoApiResponse> {
    return this.dal.get('cloud/appstore/appInfo', {params: params});
  }

  /**
   * Purchase a new bot instance.
   * See {@link https://iotbots.docs.apiary.io/#reference/end-user-bot-shop-apis/bot-purchases/purchase-a-new-bot-instance}
   *
   * @param params Request parameters.
   * @param {string} params.bundle Globally unique bundle ID for the app.
   * @param {number} [params.locationId] Assign the bot instance to the specific user location.
   * @param {number} [params.organizationId] Assign the bot instance to the specific organization.
   * @returns {Promise<PurchaseBotApiResponse>}
   */
  purchaseBot(params: {
    bundle: string;
    locationId?: number;
    organizationId?: number;
  }): Promise<PurchaseBotApiResponse> {
    return this.dal.post('cloud/appstore/appInstance', {}, {params: params});
  }

  /**
   * The API is for changing the status or/and altering the access or communication parameters.
   * See {@link https://iotbots.docs.apiary.io/#reference/end-user-bot-shop-apis/bot-purchases/configure-a-bot-instance}
   *
   * @param {ConfigureBotBody} objectBotInstance. Configuration.
   * @param params Request parameters.
   * @param {string} params.appInstanceId Bot instance ID.
   * @param {BotInstanceStatus} [params.status] New bot instance status. Optional parameter.
   * @returns {Promise<ConfigureBotApiResponse>}
   */
  configureBot(
    objectBotInstance: ConfigureBotBody,
    params: { appInstanceId: number; status?: BotInstanceStatus },
  ): Promise<ConfigureBotApiResponse> {
    return this.dal.put('cloud/appstore/appInstance', objectBotInstance, {params: params});
  }

  /**
   * A List of bot instances belonging to the user or organization.
   * See {@link https://iotbots.docs.apiary.io/#reference/end-user-bot-shop-apis/bot-purchases/get-a-list-of-bot-instances}
   *
   * Each item of the list includes parameters of the bot instance and parameters of bot itself (marketing name, bundle, version, etc).
   * Parameters of bot instances include an access list and communication channels.
   * Items in the access list can contain the attribute "excluded", which means that they are allowed by the bot, but not allowed by the bot instance.
   *
   * @param [params] Request parameters.
   * @param {number} [params.appInstanceId] Get specific bot instance by ID.
   * @param {string} [params.bundle] Filter by the bots' bundle ID.
   * @param {number} [params.locationId] Filtering bot instances by location, locationId=0 means the bot instances accessing to all locations.
   * @param {number} [params.organizationId] Return bots purchased by this organization.
   * @param {number} [params.userId] Get specific user bot instances by organization administrator.
   * @param {BotObjectName} [params.objectName] Show objects with such name(s). Multiple values are allowed.
   * @returns {Promise<GetListOfBotsApiResponse>}
   */
  getListOfBots(params?: {
    appInstanceId?: number;
    bundle?: string;
    locationId?: number;
    organizationId?: number;
    userId?: number;
    objectName?: BotObjectName;
  }): Promise<GetListOfBotsApiResponse> {
    return this.dal.get('cloud/appstore/appInstance', {params: params});
  }

  /**
   * Delete a bot instance.
   * See {@link https://iotbots.docs.apiary.io/#reference/end-user-bot-shop-apis/bot-purchases/delete-a-bot-instance}
   *
   * @param params Request parameters.
   * @param {string} params.appInstanceId Bot instance ID to delete.
   * @returns {Promise<ApiResponseBase>}
   */
  deleteBot(params: { appInstanceId: number }): Promise<ApiResponseBase> {
    return this.dal.delete('cloud/appstore/appInstance', {params: params});
  }

  /**
   * Send data-stream message.
   * See {@link https://iotbots.docs.apiary.io/#reference/end-user-bot-shop-apis/data-stream/send-message}
   *
   * The message can be sent to bots subscribed on the specific data stream address or bots of provided instance ID's.
   *
   * @param {DataStreamMessage} message Data stream message
   * @param params Request parameters.
   * @param {DataStreamScope} params.scope Bitmask to feed organizational or individual bots.
   * @param {string} params.address Data stream address.
   * @param {number} [params.locationId] Send data to bots of this location. Mandatory for users.
   * @param {number} [params.organizationId] Send data to bots of this organization, used by an administrators.
   * @returns {Promise<ApiResponseBase>}
   */
  sendDataStreamMessage(
    message: DataStreamMessage,
    params: {
      scope: DataStreamScope;
      address: string;
      locationId?: number;
      organizationId?: number;
    },
  ): Promise<ApiResponseBase> {
    return this.dal.post('cloud/appstore/stream', message, {params: params});
  }

  /**
   * Get bots summary.
   * See {@link https://iotbots.docs.apiary.io/#reference/end-user-bot-shop-apis/data-stream/get-summary}
   *
   * Returns microservices and data stream addresses for specified location or organization.
   *
   * @param [params] Request parameters.
   * @param {number} [params.locationId] Location ID.
   * @param {number} [params.organizationId] Organization ID.
   * @returns {Promise<GetBotSummaryApiResponse>}
   */
  getBotSummary(params?: { locationId?: number; organizationId?: number }): Promise<GetBotSummaryApiResponse> {
    return this.dal.get('cloud/appstore/summary', {params: params});
  }

  /**
   * Get bot object (binary file).
   * Each bot can contain a publicly available icon and/or other images.
   *
   * See {@link https://iotbots.docs.apiary.io/#/reference/end-user-bot-shop-ap-is/bot-objects/get-an-object}
   *
   * @param params Request parameters.
   * @param {BotObjectName} params.name Object name. Use "icon" for icons.
   * @param {number} params.bundle Globally unique bundle ID for the bot, i.e. `com.peoplepowerco.MyBot`
   * @returns {Promise<Blob>}
   */
  getBotObject(
    params: {
      name: BotObjectName,
      bundle: string,
    }
  ): Promise<Blob> {
    return this.dal.get(
      'cloud/appstore/objects/' + encodeURIComponent(params.name),
      {
        params: {...params, name: undefined},
        responseType: 'blob'
      }
    );
  }
}
