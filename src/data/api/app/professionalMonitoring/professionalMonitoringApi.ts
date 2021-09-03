import { AppApiDal } from '../appApiDal';
import { inject, injectable } from '../../../../modules/common/di';
import { GetCallCenterApiResponse } from './getCallCenterApiResponse';
import { UpdateCallCenterApiResponse, UpdateCallCenterModel } from './updateCallCenterApiResponse';
import { GetCallCenterAlertsApiResponse } from './getCallCenterAlertsApiResponse';

/**
 * Using this API, User can specify call center contacts and check the call center service status.
 * See {@link http://docs.iotapps.apiary.io/#reference/professional-monitoring}
 */
@injectable('ProfessionalMonitoringApi')
export class ProfessionalMonitoringApi {
  @inject('AppApiDal') protected readonly dal!: AppApiDal;

  /**
   * Retrieve call center service statuses, if the service is available and if the registration in the third party application has been completed.
   * See {@link http://docs.iotapps.apiary.io/#reference/professional-monitoring/call-center/get-call-center}
   *
   * To complete the call center registration the user has to submit own name, phone number and address
   * using the update user info API and a list of emergency contacts.
   * The complete list of missing fields is returned.
   * Also this API returns an array of emergency contacts including the first, last name, phone number of  person in the order, how they have to be contacted.
   *
   * The alert status with the alert date is returned in a case of an emergency situation.
   *
   * @param params Request parameters
   * @param {number} params.locationId Location ID.
   * @returns {Promise<GetCallCenterApiResponse>}
   */
  getCallCenter(params: { locationId: number }): Promise<GetCallCenterApiResponse> {
    return this.dal.get('callCenter', {params: params});
  }

  /**
   * Update user's call center record.
   * The API can raise a alert by setting the alert status.
   * See {@link http://docs.iotapps.apiary.io/#reference/professional-monitoring/call-center/update-call-center}
   *
   * If the new alert status is not provided, the API overwrites the call center contacts information.
   * Submitting an empty contacts array will remove all existing contacts data.
   *
   * @param {UpdateCallCenterModel} model Call Center model.
   * @param params Request parameters.
   * @param {number} params.locationId Location ID.
   * @returns {Promise<UpdateCallCenterApiResponse>}
   */
  updateCallCenter(model: UpdateCallCenterModel, params: { locationId: number }): Promise<UpdateCallCenterApiResponse> {
    return this.dal.put('callCenter', model, {params: params});
  }

  /**
   * Retrieve history of call center alerts.
   * See {@link http://docs.iotapps.apiary.io/#reference/professional-monitoring/call-center-alerts/get-call-center-alerts}
   *
   * @param params Request parameters.
   * @param {number} params.locationId Location ID.
   * @returns {Promise<GetCallCenterAlertsApiResponse>}
   */
  getCallCenterAlerts(params: { locationId: number }): Promise<GetCallCenterAlertsApiResponse> {
    return this.dal.get('callCenterAlerts', {params: params});
  }
}
