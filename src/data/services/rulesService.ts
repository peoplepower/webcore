import { inject, injectable } from '../../modules/common/di';
import { BaseService } from './baseService';
import { AuthService } from './authService';
import { UserService } from './userService';
import { GetRulesApiResponse } from '../api/app/rulesEngine/getRulesApiResponse';
import { RulesEngineApi } from '../api/app/rulesEngine/rulesEngineApi';
import { UpdateRuleApiResponse, UpdateRuleModel } from '../api/app/rulesEngine/updateRuleApiResponse';
import { GetRuleApiResponse } from '../api/app/rulesEngine/getRuleApiResponse';
import { GetRulePhrasesApiResponse } from '../api/app/rulesEngine/getRulePhrasesApiResponse';
import { ApiResponseBase } from '../models/apiResponseBase';

@injectable('RulesService')
export class RulesService extends BaseService {
  @inject('AuthService') private readonly authService!: AuthService;
  @inject('UserService') private readonly userService!: UserService;
  @inject('RulesEngineApi') private readonly rulesEngineApi!: RulesEngineApi;

  constructor() {
    super();
  }

  /**
   * Gets rules list filtered if specified so by userId. Admins-only method.
   * @param {number} locationId Location ID
   * @param {boolean} [details]
   * @returns {Promise<Rules>}
   */
  public getLocationRules(locationId: number, details?: boolean): Promise<Rules> {
    return this.getRulesInternal(locationId, undefined, details);
  }

  /**
   * Gets rules list filtered if specified so by deviceId.
   * @param {number} locationId Location ID
   * @param {string} [deviceId] Device Id
   * @param {string} [userId] User ID. If specified, the call will be made with Admin privileges
   * @param {boolean} [details]
   * @returns {Promise<Rules>}
   */
  public getDeviceRules(locationId: number, deviceId?: string, userId?: number, details?: boolean): Promise<Rules> {
    return this.getRulesInternal(locationId, deviceId, details);
  }

  /**
   * Internal method to actually return result.
   */
  protected getRulesInternal(locationId: number, deviceId?: string, details?: boolean): Promise<Rules> {
    const params: { locationId: number; deviceId?: string; details?: boolean; userId?: number } = {
      locationId: locationId,
    };

    if (locationId < 1 || isNaN(locationId)) {
      return this.reject(`Location ID is incorrect [${locationId}].`);
    }
    if (deviceId && deviceId.length > 0) {
      params.deviceId = deviceId;
    }
    if (details) {
      params.details = true;
    }

    return this.authService.ensureAuthenticated().then(() => this.rulesEngineApi.getRules(params));
  }

  /**
   * Update rule.
   * @param {number} ruleId Rule ID to update.
   * @param {UpdateRuleModel} updateRuleModel Rule data to update the entity with.
   * @param params Request parameters.
   * @param {number} params.locationId Location ID.
   * @returns {Promise<UpdateRuleApiResponse>}
   */
  public updateRule(ruleId: number, updateRuleModel: UpdateRuleModel, params: { locationId: number }): Promise<UpdateRuleApiResponse> {
    return this.authService.ensureAuthenticated().then(() => this.rulesEngineApi.updateRule(ruleId, updateRuleModel, params));
  }

  /**
   * Allows to get specific rule.
   * @param {number} ruleId Rule ID. Rule ID to obtain.
   * @param params Request parameters.
   * @param {number} params.locationId Location ID.
   * @param {boolean} [params.details] Details. Optional parameter.
   *  'true' - Return details for this rule, including all the triggers, states, and actions that compose the rule.
   *  'false' - Only return the high level information about the rule, including the id, description text, on/off status,
   *   whether the rule is a default rule, and whether the rule is hidden and not editable, default.
   * @returns {Promise<GetRuleApiResponse>}
   */
  public getRule(ruleId: number, params: { locationId: number; details?: boolean }): Promise<GetRuleApiResponse> {
    return this.authService.ensureAuthenticated().then(() => this.rulesEngineApi.getRule(ruleId, params));
  }

  /**
   * Gets rule phrases.
   * @param params Request parameters
   * @param {number} params.locationId Location ID.
   * @param {number} [params.version] Rules implementation version. Optional parameter.
   * @returns {Promise<GetRulePhrasesApiResponse>}
   */
  getRulePhrases(params: { locationId: number; version?: number }): Promise<GetRulePhrasesApiResponse> {
    return this.authService.ensureAuthenticated().then(() => this.rulesEngineApi.getRulePhrases(params));
  }

  /**
   * Deletes specified rule. UserId may be specified to perform the operaton by admin user, otherwise the ruleId of the
   * currently logged in user will be tried to be deleted.
   * @param {number} ruleId
   * @param {number} locationId
   * @returns {Promise<ApiResponseBase>}
   */
  public deleteRule(ruleId: number, locationId: number): Promise<ApiResponseBase> {
    if (locationId < 1 || isNaN(locationId)) {
      return this.reject(`Location ID is incorrect [${locationId}].`);
    }
    const params: { locationId: number } = {
      locationId: locationId,
    };

    return this.authService.ensureAuthenticated().then(() => this.rulesEngineApi.deleteRule(ruleId, params));
  }

  /**
   * Creates default rules for the device.
   * @param {string} deviceId
   * @param {number} locationId
   * @returns {Promise<ApiResponseBase>}
   */
  public createDeviceDefaultRules(deviceId: string, locationId: number): Promise<ApiResponseBase> {
    if (!deviceId || deviceId.length === 0) {
      return this.reject(`Device ID is incorrect [${deviceId}].`);
    }

    return this.authService.ensureAuthenticated().then(() =>
      this.rulesEngineApi.createDefaultRulesForDevice({
        deviceId: deviceId,
        locationId: locationId,
      }),
    );
  }

  /**
   * Creates default rules for all user's devices.
   * @param {number} locationId
   * @returns {Promise<ApiResponseBase>}
   */
  public createUserDevicesDefaultRules(locationId: number): Promise<ApiResponseBase> {
    if (locationId < 1 || isNaN(locationId)) {
      return this.reject(`Location ID is incorrect [${locationId}].`);
    }

    return this.authService.ensureAuthenticated().then(() =>
      this.rulesEngineApi.createDefaultRulesForDevice({
        locationId: locationId,
      }),
    );
  }
}

export interface Rules extends GetRulesApiResponse {
}
