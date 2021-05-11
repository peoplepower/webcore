import { AppApiDal } from '../appApiDal';
import { inject, injectable } from '../../../../modules/common/di';
import { GetRulePhrasesApiResponse } from './getRulePhrasesApiResponse';
import { CreateRuleApiResponse, CreateRuleModel } from './createRuleApiResponse';
import { UpdateRuleApiResponse, UpdateRuleModel } from './updateRuleApiResponse';
import { UpdateRuleAttributeApiResponse, UpdateRuleAttributeModel } from './updateRuleAttributeApiResponse';
import { GetRulesApiResponse } from './getRulesApiResponse';
import { GetRuleApiResponse } from './getRuleApiResponse';
import { CreateDefaultRulesForDeviceApiResponse } from './createDefaultRulesForDeviceApiResponse';
import { ApiResponseBase } from '../../../models/apiResponseBase';

/**
 * Rules Engine.
 * See {@link http://docs.iotapps.apiary.io/#reference/rules-engine}
 */
@injectable('RulesEngineApi')
export class RulesEngineApi {
  @inject('AppApiDal') protected readonly dal: AppApiDal;

  /**
   * Gets rule phrases.
   * See {@link http://docs.iotapps.apiary.io/#reference/rules-engine/get-rule-phrases}
   *
   * @param params Request parameters
   * @param {number} params.locationId Location ID.
   * @param {number} [params.version] Rules implementation version. Optional parameter.
   * @returns {Promise<GetRulePhrasesApiResponse>}
   */
  getRulePhrases(params: { locationId: number; version?: number }): Promise<GetRulePhrasesApiResponse> {
    return this.dal.get('ruleConditions', { params: params });
  }

  /**
   * Create a rule.
   * See {@link http://docs.iotapps.apiary.io/#reference/rules-engine/create-a-rule/create-a-rule}
   *
   * When creating a rule, specify a single trigger, one or more states, and one or more actions, by
   * referencing the ID's of the triggers/states/actions that are available.
   *
   * @param {CreateRuleModel} model Rule entity data for creation.
   * @param params Request parameters.
   * @param {number} params.locationId Location ID.
   * @returns {Promise<CreateRuleApiResponse>}
   */
  createRule(model: CreateRuleModel, params: { locationId: number }): Promise<CreateRuleApiResponse> {
    return this.dal.post('rules', model, { params: params });
  }

  /**
   * Allows to update rule.
   * See {@link http://docs.iotapps.apiary.io/#reference/rules-engine/update-a-rule/update-a-rule}
   *
   * @param {number} ruleId Rule ID to update.
   * @param {UpdateRuleModel} model Rule data to update the entity with.
   * @param params Request parameters.
   * @param {number} params.locationId Location ID.
   * @returns {Promise<UpdateRuleApiResponse>}
   */
  updateRule(ruleId: number, model: UpdateRuleModel, params: { locationId: number }): Promise<UpdateRuleApiResponse> {
    return this.dal.put(`rules/${encodeURIComponent(ruleId.toString())}`, model, { params: params });
  }

  /**
   * Allows to update rule name or status attributes.
   * See {@link http://docs.iotapps.apiary.io/#reference/rules-engine/update-a-rule-attribute/update-a-rule-attribute}
   *
   * @param {number} ruleId Rule ID to update.
   * @param {UpdateRuleModel} model Rule data to update entity with.
   * @param params Request parameters.
   * @param {number} params.locationId Location ID.
   * @returns {Promise<UpdateRuleAttributeApiResponse>}
   */
  updateRuleAttribute(
    ruleId: number,
    model: UpdateRuleAttributeModel,
    params: { locationId: number },
  ): Promise<UpdateRuleAttributeApiResponse> {
    return this.dal.put(`rules/${encodeURIComponent(ruleId.toString())}/attrs`, model, { params: params });
  }

  /**
   * Allows to get rules.
   * This API will allow you to filter the list of rules by device ID as well.
   * See {@link http://docs.iotapps.apiary.io/#reference/rules-engine/get-rules/get-rules}
   *
   * @param params Request parameters
   * @param {number} params.locationId Location ID.
   * @param {string} [params.deviceId] Only return rules for the given device ID. Optional parameter.
   * @param {boolean} [params.details] Details. Optional parameter.
   *  'true' - Return details for this rule, including all the triggers, states, and actions that compose the rule.
   *  'false' - Only return the high level information about the rule, including the id, description text, on/off status,
   *   whether the rule is a default rule, and whether the rule is hidden and not editable, default.
   * @returns {Promise<GetRulesApiResponse>}
   */
  getRules(params: { locationId: number; deviceId?: string; details?: boolean }): Promise<GetRulesApiResponse> {
    return this.dal.get('rules', { params: params });
  }

  /**
   * Allows to get specific rule.
   * See {@link http://docs.iotapps.apiary.io/#reference/rules-engine/manage-a-specific-rule/get-a-specific-rule}
   *
   * @param {number} ruleId Rule ID. Rule ID to obtain.
   * @param params Request parameters.
   * @param {number} params.locationId Location ID.
   * @param {boolean} [params.details] Details. Optional parameter.
   *  'true' - Return details for this rule, including all the triggers, states, and actions that compose the rule.
   *  'false' - Only return the high level information about the rule, including the id, description text, on/off status,
   *   whether the rule is a default rule, and whether the rule is hidden and not editable, default.
   * @returns {Promise<GetRuleApiResponse>}
   */
  getRule(ruleId: number, params: { locationId: number; details?: boolean }): Promise<GetRuleApiResponse> {
    return this.dal.get(`rules/${encodeURIComponent(ruleId.toString())}`, { params: params });
  }

  /**
   * Allows to delete specific rule.
   * See {@link http://docs.iotapps.apiary.io/#reference/rules-engine/manage-a-specific-rule/delete-a-rule}
   *
   * @param {number} ruleId Rule ID to delete.
   * @param params Request parameters.
   * @param {number} params.locationId Location ID.
   * @returns {Promise<ApiResponseBase>}
   */
  deleteRule(ruleId: number, params: { locationId: number }): Promise<ApiResponseBase> {
    return this.dal.delete(`rules/${encodeURIComponent(ruleId.toString())}`, { params: params });
  }

  /**
   * Creates all the default rules, if they do not already exist, for an individual device or for all of the user's devices.
   * See {@link http://docs.iotapps.apiary.io/#reference/rules-engine/create-default-rules-for-a-device/create-default-rules-for-a-device}
   *
   * @param params Request parameters
   * @param {number} params.locationId Location ID.
   * @param {number} [params.deviceId] Specific device ID to create default rules for. Optional parameter.
   * @returns {Promise<CreateDefaultRulesForDeviceApiResponse>}
   */
  createDefaultRulesForDevice(params: { locationId: number; deviceId?: string }): Promise<CreateDefaultRulesForDeviceApiResponse> {
    return this.dal.post('rulesCreateDefault', {}, { params: params });
  }
}
