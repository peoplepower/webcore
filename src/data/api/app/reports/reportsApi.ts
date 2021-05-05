import { AppApiReportsDal } from '../appApiReportsDal';
import { inject, injectable } from '../../../../modules/common/di';
import { GetTotalDeviceAlertsApiResponse } from './getTotalDeviceAlertsApiResponse';

/**
 * The IoT Software Suite provides public online reports for different purposes.
 * See {@link http://docs.iotapps.apiary.io/#reference/reports/}
 */
@injectable('ReportsApi')
export class ReportsApi {

  @inject('AppApiReportsDal') protected readonly dal: AppApiReportsDal;

  /**
   * This reports returns total numbers of alerts generated by devices by alert types. User authentication is not required.
   * See {@link http://docs.iotapps.apiary.io/#reference/reports/device-alerts/get-total-device-alerts}
   * @param [params] Request parameters.
   * @param {string} [params.alertType] Return only number of this alert type (i.e.: motion, alert or reset, etc.).
   * @returns {Promise<GetTotalDeviceAlertsApiResponse>}
   */
  getTotalDeviceAlerts(params?: { alertType?: string; }): Promise<GetTotalDeviceAlertsApiResponse> {
    return this.dal.get('totalDeviceAlerts', {params: params});
  }

}
