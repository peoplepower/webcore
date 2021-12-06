import { AppApiDal } from '../appApiDal';
import { inject, injectable } from '../../../../modules/common/di';
import { GetSupportedDeviceTypesApiResponse } from './getSupportedDeviceTypesApiResponse';
import { CreateDeviceTypeApiResponse, DeviceTypeModel } from './createDeviceTypeApiResponse';
import { GetDeviceParametersApiResponse } from './getDeviceParametersApiResponse';
import { CreateOrUpdateDeviceParameterApiResponse, DeviceParameterModel } from './createOrUpdateDeviceParameterApiResponse';
import { GetDeviceTypeDefaultRulesApiResponse } from './getDeviceTypeDefaultRulesApiResponse';
import { GetDeviceGoalsByDeviceTypeApiResponse } from './getDeviceGoalsByDeviceTypeApiResponse';
import { GetDeviceGoalInstallationInstructionsApiResponse } from './getDeviceGoalInstallationInstructionsApiResponse';
import { ApiResponseBase } from '../../../models/apiResponseBase';

/**
 * Creating Products API.
 * See {@link http://docs.iotapps.apiary.io/#reference/creating-products}
 *
 * This API allows developers to create and manage new products. Each product defines a category to help
 * organize UI's and groups of devices.On the developer platform, only the creator of a product may see its existence.
 * When the product is ready for commercial deployment, we manually migrate the product and parameter definitions to the production server.
 */
@injectable('DevicesConfigurationApi')
export class DevicesConfigurationApi {
  @inject('AppApiDal') protected readonly dal!: AppApiDal;

  // #region --------------- Device Types & Attributes -----------------

  /**
   * Retrieve supported device types descriptions.
   * See {@link https://iotapps.docs.apiary.io/#reference/creating-products/supported-device-types/get-device-types}
   *
   * Device types attributes are documented in the Supported Product Attributes API.
   * See
   * {@link http://docs.iotapps.apiary.io/#reference/managing-products/supported-products/get-supported-product-attributes}
   *
   * @param [params] Request parameters.
   * @param {number} [params.deviceType] Specific device type to look up details on.
   * @param {string} [params.attrName] Return device types, which have an attribute with this name.
   * @param {string} [params.attrValue] Also filter the response by the attribute value.
   * @param {boolean} [params.own] Return only products created by this user.
   * @param {boolean} [params.simple] Return only product fields without user and attributes information.
   * @param {number} [params.organizationId] Return only device types related to the specific organization.
   * @returns {Promise<GetSupportedDeviceTypesApiResponse>}
   */
  getSupportedDeviceTypes(params?: {
    deviceType?: number;
    attrName?: string;
    attrValue?: string;
    own?: boolean;
    simple?: boolean;
    organizationId?: number;
    sortCollection?: string;
    sortBy?: string;
  }): Promise<GetSupportedDeviceTypesApiResponse> {
    return this.dal.get('deviceTypes', {params: params});
  }

  /**
   *  =============================================================================
   *  WARNING: DO NOT COVER WITH INTEGRATION TEST UNLESS CONFIRMED BY SERVER POLICE
   *  =============================================================================
   */

  /**
   * Creates new device type (product). Used by developers to have own products.
   * See {@link http://docs.iotapps.apiary.io/#reference/creating-products/create-a-product/create-a-product}
   *
   * Each device type is created with a default name and a set of attributes to define the behavior of the product. See the Product Attributes API for details.
   * For attributes, use the number '1' to indicate true, '0' to indicate false.
   *
   * @param {DeviceTypeModel} deviceType Name and attributes for new device type.
   * @returns {Promise<CreateDeviceTypeApiResponse>}
   */
  createDeviceType(deviceType: DeviceTypeModel): Promise<CreateDeviceTypeApiResponse> {
    return this.dal.post('deviceType', deviceType);
  }

  /**
   * Allows to update the product (device type). You must be the owner of the product in order to update it.
   * See {@link http://docs.iotapps.apiary.io/#reference/creating-products/update-a-product/update-a-product}
   *
   * For attributes, use the number '1' to indicate true, '0' to indicate false.
   *
   * @param {number} deviceTypeId Id of the device type to update.
   * @param {DeviceTypeModel} deviceType Device type attributes to update.
   * @returns {Promise<CreateDeviceTypeApiResponse>}
   */
  updateDeviceType(deviceTypeId: number, deviceType: DeviceTypeModel): Promise<CreateDeviceTypeApiResponse> {
    return this.dal.put(`deviceType/${encodeURIComponent(deviceTypeId.toString())}`, deviceType);
  }

  // #endregion

  // #region ------------------- Device Parameters ---------------------

  /**
   * Allows to get device parameters.
   * See {@link http://docs.iotapps.apiary.io/#reference/creating-products/manage-parameters/get-parameters}
   *
   * A parameter is an individual stream of data between a device and the IoT Software Suite. System
   * enables parameters to be optimized for performance and storage, which facilitates massive scalability of the platform.
   * The IoT Software Suite has a single namespace for parameters. Each parameter name must contain no spaces,
   * and include a prefix that is separated from the rest of the name by a period ('.').
   * We recommend prefixes that contain the initials of the company or organization.
   *
   * @param [params] Request parameters.
   * @param {string|string[]} [params.paramName] Name of the specific parameter to get.
   * @returns {Promise<GetDeviceParametersApiResponse>}
   */
  getDeviceParameters(params?: { paramName?: string | string[] }): Promise<GetDeviceParametersApiResponse> {
    return this.dal.get('deviceParameters', {params: params});
  }

  /**
   * Creates or updates the specified parameter.
   * See
   * {@link http://docs.iotapps.apiary.io/#reference/creating-products/manage-parameters/create-and-update-a-parameter}
   *
   * A normal developer can update only their own parameters. A system administrator can edit any parameter.
   *
   * @param {DeviceParameterModel} deviceParameterModel
   * @returns {Promise<CreateOrUpdateDeviceParameterApiResponse>}
   */
  createOrUpdateDeviceParameter(deviceParameterModel: DeviceParameterModel): Promise<CreateOrUpdateDeviceParameterApiResponse> {
    return this.dal.post('deviceParameters', deviceParameterModel);
  }

  /**
   * Deletes a specified device parameter.
   * See {@link http://docs.iotapps.apiary.io/#reference/creating-products/delete-a-parameter/delete-a-parameter}
   *
   * A normal developer can delete only their own parameters. A system administrator can delete any parameter.
   *
   * @param {string} parameterName Name of the device parameter to delete.
   * @returns {Promise<ApiResponseBase>}
   */
  deleteDeviceParameter(parameterName: string): Promise<ApiResponseBase> {
    return this.dal.delete(`deviceParameters/${encodeURIComponent(parameterName)}`);
  }

  // #endregion

  // #region ---------------------- Default Rules ----------------------

  /**
   * This API allows you to get default rules by device type ID. You must be the owner of the product or system administrator in order to retrieve them.
   * See {@link http://docs.iotapps.apiary.io/#reference/creating-products/default-rules/get-product-default-rules}
   *
   * @param {number} deviceTypeId The product / "device type" ID.
   * @param [params] Request parameters.
   * @param {boolean} [params.details] Level of details to return for the requested rules.
   *  'true' - Return details for these rules, including all the triggers, states, and actions that compose the rule.
   *  'false' - Only return the high level information about the rule, including the id, description text, on/off status,
   *  whether the rule is a default rule, and whether the rule is hidden and not editable, default.
   *
   * @returns {Promise<GetDeviceTypeDefaultRulesApiResponse>}
   */
  getDeviceTypeDefaultRules(
    deviceTypeId: number,
    params?: {
      details?: boolean;
    },
  ): Promise<GetDeviceTypeDefaultRulesApiResponse> {
    return this.dal.get(`deviceType/${encodeURIComponent(deviceTypeId.toString())}/rules`, {params: params});
  }

  /**
   * Assign a rule as default for a specific product.
   * See {@link http://docs.iotapps.apiary.io/#reference/creating-products/manage-default-rules/add-default-rule}
   *
   * When a user register a new device of this type, the system will automatically create a new rule based on this default rule.
   * You must be the owner of the product and the rule. The rule cannot be deleted after that.
   *
   * @param {number} deviceTypeId The product / "device type" ID.
   * @param {number} ruleId The Id of the rule to add to a device type as a default rule.
   * @param [params] Request parameters.
   * @param {boolean} [params.hidden] If the rule should be hidden or not.
   *  'true' - A new generated rule will be hidden and a user will not see it.
   *  'false' - A user will see this rule in the list, default.
   * @returns {Promise<ApiResponseBase>}
   */
  addDeviceTypeDefaultRule(
    deviceTypeId: number,
    ruleId: number,
    params?: {
      hidden?: boolean;
    },
  ): Promise<ApiResponseBase> {
    return this.dal.post(`deviceType/${encodeURIComponent(deviceTypeId.toString())}/rules/${encodeURIComponent(ruleId.toString())}`, null, {
      params: params,
    });
  }

  /**
   * Delete an association of the default rule and the specific product. You must be the owner of the product and the rule.
   * See {@link http://docs.iotapps.apiary.io/#reference/creating-products/manage-default-rules/delete-default-rule}
   *
   * @param {number} deviceTypeId The product / "device type" ID.
   * @param {number} ruleId The Id of the rule to delete from the specified device type.
   * @returns {Promise<ApiResponseBase>}
   */
  deleteDeviceTypeDefaultRule(deviceTypeId: number, ruleId: number): Promise<ApiResponseBase> {
    return this.dal.delete(`deviceType/${encodeURIComponent(deviceTypeId.toString())}/rules/${encodeURIComponent(ruleId.toString())}`);
  }

  // #endregion

  // #region ----------------------- Device Goals ----------------------

  /**
   * Gets device goals by device type ID..
   * See {@link http://docs.iotapps.apiary.io/#reference/creating-products/manage-default-rules/get-device-goals-by-type}
   *
   * Device goals provide possible device usage scenarios. Depending on chosen device goal System assign default rules and suggest device installation.
   *
   * @param {number} deviceTypeId The product / "device type" ID.
   * @param [params] Request parameters.
   * @param {string} [params.appName] Specific app name (brand).
   * @returns {Promise<GetDeviceGoalsByDeviceTypeApiResponse>}
   */
  getDeviceGoalsByDeviceType(deviceTypeId: number, params?: { appName?: string }): Promise<GetDeviceGoalsByDeviceTypeApiResponse> {
    return this.dal.get(`deviceType/${encodeURIComponent(deviceTypeId.toString())}/goals`, {params: params});
  }

  /**
   * Gets device goal installation instructions by goal ID.
   * See {@link http://docs.iotapps.apiary.io/#reference/creating-products/device-goal-installation-instructions/get-installation-instructions}
   *
   * @param {number} goalId The Id of the goal to get installation instructions for.
   * @returns {Promise<GetDeviceGoalInstallationInstructionsApiResponse>}
   */
  getDeviceGoalInstallationInstructions(goalId: number): Promise<GetDeviceGoalInstallationInstructionsApiResponse> {
    return this.dal.get(`goals/${encodeURIComponent(goalId.toString())}/installation`);
  }

  // #endregion
}
