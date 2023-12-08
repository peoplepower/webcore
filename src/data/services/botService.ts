import { inject, injectable } from '../../modules/common/di';
import { BaseService } from './baseService';
import { ApiResponseBase } from '../models/apiResponseBase';
import { AuthService } from './authService';
import { BotShopApi } from '../api/bot/endUserBotShop/endUserBotShopApi';
import { BotCategory, BotCoreClass, BotObjectName, BotType, SearchBotsApiResponse } from '../api/bot/endUserBotShop/searchBotsApiResponse';
import { GetBotInfoApiResponse } from '../api/bot/endUserBotShop/getBotInfoApiResponse';
import { PurchaseBotApiResponse } from '../api/bot/endUserBotShop/purchaseBotApiResponse';
import { GetListOfBotsApiResponse } from '../api/bot/endUserBotShop/getListOfBotsApiResponse';
import { BotInstanceStatus, ConfigureBotBody } from '../api/bot/endUserBotShop/configureBotApiResponse';
import { GetBotSummaryApiResponse } from '../api/bot/endUserBotShop/getBotSummaryApiResponse';
import { DataStreamMessage, DataStreamScope } from '../api/bot/endUserBotShop/dataStreamMessageApiResponse';

@injectable('BotService')
export class BotService extends BaseService {
  @inject('AuthService') protected readonly authService!: AuthService;
  @inject('BotShopApi') protected readonly botShopApi!: BotShopApi;

  constructor() {
    super();
  }

  /**
   * Search for available bots.
   * @param [params] Options to search bots according to.
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
   * @returns {Promise<BotsList>}
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
  }): Promise<BotsList> {
    if (params) {
      if (params.organizationId && (params.organizationId < 0 || isNaN(params.organizationId))) {
        return this.reject(`Organization ID is incorrect [${params.organizationId}].`);
      }
      if (params.locationId && (params.locationId < 0 || isNaN(params.locationId))) {
        return this.reject(`Location ID is incorrect [${params.locationId}].`);
      }
    }

    return this.authService.ensureAuthenticated().then(() => this.botShopApi.searchBots(params));
  }

  /**
   * Retrieve bot information.
   * @param params Request parameters.
   * @param {string} params.bundle Globally unique bundle ID for the app
   * @param {string} [params.lang] Language identifier, default is user's language or 'en'
   * @param {string} [params.lastNVersions] Max number of versions to show, default is 10
   * @param {BotObjectName} [params.objectName] Show objects with such name(s). Multiple values are allowed.
   * @returns {Promise<GetBotInfoApiResponse>}
   */
  public getBotInfo(params: {
    bundle: string;
    lang?: string;
    lastNVersions?: number;
    objectName?: BotObjectName;
  }): Promise<GetBotInfoApiResponse> {
    if (!params?.bundle) {
      return this.reject('Bot bundle ID is mandatory.');
    }

    return this.authService.ensureAuthenticated().then(() => this.botShopApi.getBotInfo(params));
  }

  /**
   * Get bot object (binary file).
   * Each bot can contain a publicly available icon and/or other images.
   * @param params Request parameters.
   * @param {BotObjectName} params.name Object name. Use "icon" for icons.
   * @param {number} params.bundle Globally unique bundle ID for the bot, i.e. `com.peoplepowerco.MyBot`
   * @returns {Promise<Blob>}
   */
  public getBotObject(
    params: {
      name: BotObjectName,
      bundle: string,
    }
  ): Promise<Blob> {
    return this.authService.ensureAuthenticated().then(() => this.botShopApi.getBotObject(params));
  }

  /**
   * Allows to purchase bot for organization or location
   * @param {string} bundle Globally unique bundle ID for purchase.
   * @param {number} [organizationId] Organization ID.
   * @param {number} [locationId] Location ID.
   * @returns {Promise<PurchaseBotApiResponse>}
   */
  public purchaseBotInstance(bundle: string, organizationId?: number, locationId?: number): Promise<PurchaseBotApiResponse> {
    if (!bundle) {
      return this.reject('Bot bundle ID is mandatory.');
    }
    if (organizationId && (organizationId < 0 || isNaN(organizationId))) {
      return this.reject(`Organization ID is incorrect [${organizationId}].`);
    }
    if (locationId && (locationId < 0 || isNaN(locationId))) {
      return this.reject(`Location ID is incorrect [${locationId}].`);
    }

    const params: {
      bundle: string;
      organizationId?: number;
      locationId?: number;
    } = {
      bundle: bundle,
      organizationId: organizationId,
      locationId: locationId,
    };

    return this.authService.ensureAuthenticated().then(() => this.botShopApi.purchaseBot(params));
  }

  /**
   * Returns a list of bot instances for specified organization, location or user
   * @param {number} [appInstanceId] Bot instance ID.
   * @param {number} [organizationId] Organization ID.
   * @param {number} [locationId] Location ID.
   * @param {string} [bundle] Bot bundle ID.
   * @param {number} [userId] Administrator user ID.
   * @param {BotObjectName} [objectName] Show objects with such name(s). Multiple values are allowed.
   * @returns {Promise<GetListOfBotsApiResponse>}
   */
  public getListOfBotInstances(
    appInstanceId?: number,
    organizationId?: number,
    locationId?: number,
    bundle?: string,
    userId?: number,
    objectName?: BotObjectName
  ): Promise<GetListOfBotsApiResponse> {
    if (appInstanceId && (appInstanceId < 0 || isNaN(appInstanceId))) {
      return this.reject(`Bot Instance ID is incorrect [${appInstanceId}].`);
    }
    if (organizationId && (organizationId < 0 || isNaN(organizationId))) {
      return this.reject(`Organization ID is incorrect [${organizationId}].`);
    }
    if (locationId && (locationId < 0 || isNaN(locationId))) {
      return this.reject(`Location ID is incorrect [${locationId}].`);
    }
    if (userId && (userId < 0 || isNaN(userId))) {
      return this.reject(`User ID is incorrect [${userId}].`);
    }

    const params: {
      appInstanceId?: number;
      organizationId?: number;
      locationId?: number;
      bundle?: string;
      userId?: number;
      objectName?: BotObjectName;
    } = {
      appInstanceId: appInstanceId,
      organizationId: organizationId,
      locationId: locationId,
      bundle: bundle,
      userId: userId,
      objectName: objectName
    };

    return this.authService.ensureAuthenticated().then(() => this.botShopApi.getListOfBots(params));
  }

  /**
   * Configure Bot Instance
   * @param {number} appInstanceId Bot instance ID.
   * @param {BotInstanceStatus} [status] New status, 1 - active, 2 - inactive.
   * @param {ConfigureBotBody} [objectBotInstance] Bot properties.
   * @returns {Promise<ApiResponseBase>}
   */
  public configureBotInstance(
    appInstanceId: number,
    status?: BotInstanceStatus,
    objectBotInstance?: ConfigureBotBody,
  ): Promise<ApiResponseBase> {
    if (!appInstanceId || appInstanceId < 0 || isNaN(appInstanceId)) {
      return this.reject(`Bot Instance ID is incorrect [${appInstanceId}].`);
    }
    if (status && (status < 1 || isNaN(status))) {
      return this.reject(`Status is incorrect [${status}].`);
    }

    if (!objectBotInstance) {
      objectBotInstance = {} as ConfigureBotBody;
    }
    const params: {
      appInstanceId: number;
      status?: number;
    } = {
      appInstanceId: appInstanceId,
      status: status,
    };

    return this.authService.ensureAuthenticated().then(() => this.botShopApi.configureBot(objectBotInstance!, params));
  }

  /**
   * Allows to delete specific bot instance
   * @param {number} appInstanceId Bot instance ID to delete.
   * @returns {Promise<ApiResponseBase>}
   */
  public deleteBotInstance(appInstanceId: number): Promise<ApiResponseBase> {
    if (appInstanceId < 1 || isNaN(appInstanceId)) {
      return this.reject(`Bot Instance ID is incorrect [${appInstanceId}].`);
    }

    const params: {
      appInstanceId: number;
    } = {
      appInstanceId: appInstanceId,
    };

    return this.authService.ensureAuthenticated().then(() => this.botShopApi.deleteBot(params));
  }

  /**
   * Returns Bot Summary
   * @param {number} [locationId] Location ID.
   * @param {number} [organizationId] Organization ID.
   * @returns {Promise<GetBotSummaryApiResponse>}
   */
  public getBotSummary(locationId?: number, organizationId?: number): Promise<GetBotSummaryApiResponse> {
    if (!locationId && !organizationId) {
      return this.reject(`Missing Location ID or Organization ID.`);
    }

    const params: {
      locationId?: number;
      organizationId?: number;
    } = {
      locationId: locationId,
      organizationId: organizationId,
    };

    return this.authService.ensureAuthenticated().then(() => this.botShopApi.getBotSummary(params));
  }

  /**
   * Send data-stream message.
   * See {@link https://iotbots.docs.apiary.io/#reference/end-user-bot-shop-apis/data-stream/send-message}
   *
   * The message can be sent to bots subscribed on the specific data stream address or bots of provided instance ID's.
   *
   * @param {DataStreamMessage} message Data stream message
   * @param params Request parameters.
   * @param {DataStreamScope} params.scope Bitmask to feed organizational, individual and circle bots.
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
    return this.authService.ensureAuthenticated().then(() => this.botShopApi.sendDataStreamMessage(message, params));
  }
}

export interface BotsList extends SearchBotsApiResponse {
}
