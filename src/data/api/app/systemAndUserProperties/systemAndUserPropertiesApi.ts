import { AppApiDal } from '../appApiDal';
import { inject, injectable } from '../../../../modules/common/di';
import { GetUserPropertiesApiResponse } from './getUserPropertiesApiResponse';
import { UpdateUserPropertiesApiResponse, UpdateUserPropertiesModel } from './updateUserPropertiesApiResponse';
import { ApiResponseBase } from '../../../models/apiResponseBase';

/**
 * System Properties are one of the most useful tools to manage and synchronize the behavior of production apps,
 * without releasing a new build of the app. System Properties are key/value pairs that are distributed across every user in the system.
 * See {@link http://docs.iotapps.apiary.io/#reference/system-and-user-properties}
 */
@injectable('SystemAndUserPropertiesApi')
export class SystemAndUserPropertiesApi {
  @inject('AppApiDal') protected readonly dal!: AppApiDal;

  /**
   * This API will first attempt to return a user-specific property value in plain text.
   * If there is no user-specific property set, it will attempt to return a system wide property value as plain text, otherwise it will return no content.
   * See {@link http://docs.iotapps.apiary.io/#reference/system-and-user-properties/get-user-or-system-property}
   *
   * @param {string} propertyName Name of the property value to retrieve, i.e. "presence-ios-debug_level".
   * @returns {Promise<string>}
   */
  getUserOrSystemProperty(propertyName: string): Promise<string> {
    return this.dal.get('systemProperty/' + encodeURIComponent(propertyName), {responseType: 'text'});
  }

  /**
   * This API returns only user-specific property values.
   * See {@link http://docs.iotapps.apiary.io/#reference/system-and-user-properties/manage-multiple-user-properties/get-user-properties}
   *
   * @param [params] Request parameters.
   * @param {string|string[]} [params.name] Property name or optional name prefix to filter properties in the batch version.
   * @param {number} [params.userId] User ID, used by an account with administrative privileges to retrieve the properties of another user.
   * @returns {Promise<GetUserPropertiesApiResponse>}
   */
  getUserProperties(params?: { name?: string | string[]; userId?: number }): Promise<GetUserPropertiesApiResponse> {
    return this.dal.get('userProperties', {params: params});
  }

  /**
   * The application may update several user properties simultaneously.
   * The maximum value size may be 10,000 characters using this API.
   * See {@link http://docs.iotapps.apiary.io/#reference/system-and-user-properties/manage-multiple-user-properties/update-multiple-user-properties}
   *
   * @param {UpdateUserPropertiesModel} model Model.
   * @param [params] Request parameters.
   * @param {number} [params.userId] User ID, used by an account with administrative privileges to update the properties for another user.
   * @returns {Promise<UpdateUserPropertiesApiResponse>}
   */
  updateUserProperties(
    model: UpdateUserPropertiesModel,
    params?: {
      userId?: number;
    },
  ): Promise<UpdateUserPropertiesApiResponse> {
    return this.dal.post('userProperties', model, {params: params});
  }

  /**
   * The application may update a single user property with a very simple API requiring no JSON body.
   * See {@link https://iotapps.docs.apiary.io/#reference/system-and-user-properties/manage-a-single-user-property/update-a-single-user-property}
   *
   * @param {string} name Name of the property to set a value for. Maximum of 250 characters.
   * @param params Requst parameters.
   * @param {string} params.value Value to set for this property. Maximum of 250 characters.
   * @param {number} [params.userId] User ID, used by an account with administrative privileges to update the properties for another user.
   * @returns {Promise<ApiResponseBase>}
   */
  updateUserProperty(
    name: string,
    params: {
      value: string;
      userId?: number;
    },
  ): Promise<ApiResponseBase> {
    return this.dal.put('userProperty/' + encodeURIComponent(name), {}, {params: params});
  }
}
