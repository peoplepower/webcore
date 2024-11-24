import { inject, injectable } from '../../modules/common/di';
import { BaseService } from './baseService';
import { AuthService } from './authService';
import { ProfessionalMonitoringApi } from '../api/app/professionalMonitoring/professionalMonitoringApi';
import { GetCallCenterApiResponse } from '../api/app/professionalMonitoring/getCallCenterApiResponse';
import { GetCallCenterAlertsApiResponse } from '../api/app/professionalMonitoring/getCallCenterAlertsApiResponse';
import { UpdateCallCenterApiResponse, UpdateCallCenterModel } from '../api/app/professionalMonitoring/updateCallCenterApiResponse';
import { CreateCallCenterTestApiResponse, CreateCallCenterTestModel } from '../api/app/professionalMonitoring/createCallCenterTestApiResponse';
import { ApiResponseBase } from '../models/apiResponseBase';

@injectable('ProfessionalMonitoringService')
export class ProfessionalMonitoringService extends BaseService {
  @inject('AuthService') private readonly authService!: AuthService;
  @inject('ProfessionalMonitoringApi') protected readonly professionalMonitoringApi!: ProfessionalMonitoringApi;

  constructor() {
    super();
  }

  /**
   * Retrieve call center service statuses.
   * If the service is available and if the registration in the third party application has been completed.
   * If the service is available, but the registration has not been completed yet, then Ensemble does not have enough information to do it.
   *
   * @param {number} locationId Location ID.
   * @return {Promise<CallCenter>}
   */
  public getCallCenter(locationId: number): Promise<CallCenter> {
    return this.authService.ensureAuthenticated().then(() =>
      this.professionalMonitoringApi.getCallCenter({
        locationId: locationId,
      }),
    );
  }

  /**
   * Update user's call center record.
   * The API can raise a alert by setting the alert status. If the new alert status is not provided, the API
   * overwrites the call center contacts information. Submitting an empty contacts array will remove all existing contacts data.
   * @param {UpdateCallCenter} callCenter Call Center data.
   * @param {number} locationId Location ID.
   * @return {Promise<UpdateCallCenterResponse>}
   */
  public updateCallCenter(callCenter: UpdateCallCenter, locationId: number): Promise<UpdateCallCenterResponse> {
    return this.authService.ensureAuthenticated().then(() =>
      this.professionalMonitoringApi.updateCallCenter(callCenter, {
        locationId: locationId,
      }),
    );
  }

  /**
   * Retrieve history of call center alerts.
   * @param {number} locationId Location ID
   * @param [params] Additional request parameters
   * @return {Promise<CallCenterAlerts>}
   */
  public getCallCenterAlerts(locationId: number, params?: any): Promise<CallCenterAlerts> {
    if (locationId < 1 || isNaN(locationId)) {
      return this.reject(`Location ID is incorrect [${locationId}].`);
    }

    let parameters: {
      locationId: number;
      sortCollection?: string;
      sortBy?: string;
      sortOrder?: string;
      firstRow?: number;
      rowCount?: number;
    } = params || {};

    parameters.locationId = locationId;
    if (params && !parameters.sortCollection) {
      parameters.sortCollection = 'callCenterAlerts';
    }

    return this.authService.ensureAuthenticated().then(() =>
      this.professionalMonitoringApi.getCallCenterAlerts(parameters)
    );
  }

  /**
   * Create or update call center test.
   * @param {number} locationId Location ID.
   * @param {CreateCallCenterTestModel} testModel Call center test model.
   * @param {number} [testId] Call center test ID to update existing test.
   * @return {Promise<CreateCallCenterTestApiResponse>}
   */
  public createCallCenterTest(locationId: number, testModel: CreateCallCenterTestModel, testId?: number): Promise<CreateCallCenterTestApiResponse> {
    let parameters: {
      locationId: number;
      testId?: number;
    } = {
      locationId: locationId,
    }

    if (testId) {
      parameters.testId = testId;
    }

    return this.authService.ensureAuthenticated().then(() =>
      this.professionalMonitoringApi.createCallCenterTest(parameters, testModel),
    );
  }

  /**
   * Cancel call center test(s).
   * @param {number} locationId Location ID.
   * @param {number} [testId] Call center test ID to cancel a specific test.
   * @return {Promise<ApiResponseBase>}
   */
  public cancelCallCenterTest(locationId: number, testId?: number): Promise<ApiResponseBase> {
    let parameters: {
      locationId: number;
      testId?: number;
    } = {
      locationId: locationId,
    }

    if (testId) {
      parameters.testId = testId;
    }

    return this.authService.ensureAuthenticated().then(() =>
      this.professionalMonitoringApi.cancelCallCenterTest(parameters),
    );
  }
}

export interface CallCenter extends GetCallCenterApiResponse {
}

export interface UpdateCallCenter extends UpdateCallCenterModel {
}

export interface CallCenterAlerts extends GetCallCenterAlertsApiResponse {
}

export interface UpdateCallCenterResponse extends UpdateCallCenterApiResponse {
}
