import { inject, injectable } from '../../modules/common/di';
import { SystemAndUserPropertiesApi } from '../api/app/systemAndUserProperties/systemAndUserPropertiesApi';
import { BaseService } from './baseService';
import { ApiResponseBase } from "../models/apiResponseBase";

@injectable('SystemPropertiesService')
export class SystemPropertiesService extends BaseService {
  @inject('SystemAndUserPropertiesApi') protected readonly systemAndUserPropertiesApi!: SystemAndUserPropertiesApi;

  constructor() {
    super();
  }

  /**
   * Gets the value of system property that holds regular expression for password validation.
   * @returns {Promise<string | undefined>}
   */
  public getPasswordValidationRegex(): Promise<string | undefined> {
    return this.systemAndUserPropertiesApi.getSystemProperty('web-password_regex')
      .then(value => {
        return value || undefined;
      });
  }

  /**
   * Gets the passcode resend timeout.
   * @returns {Promise<number | undefined>}
   */
  public getPasscodeResendTimeout(): Promise<number | undefined> {
    return this.systemAndUserPropertiesApi.getSystemProperty('ppc.account.passcode.timeout')
      .then(value => {
        return parseInt(value, 10) || undefined;
      });
  }

  /**
   * Gets the Google Maps API key.
   * @returns {Promise<string | undefined>}
   */
  public getGoogleMapsKey(): Promise<string | undefined> {
    return this.systemAndUserPropertiesApi.getSystemProperty('google-maps-key')
      .then(value => {
        return value || undefined;
      });
  }

  /**
   * Gets the Cloud languages list
   * @returns {Promise<string[] | undefined>}
   */
  public getCloudLanguages(): Promise<string[] | undefined> {
    return this.systemAndUserPropertiesApi.getSystemProperty('ppc.api.languages')
      .then(value => {
        return value?.split(',') || undefined;
      });
  }

  /**
   * Gets branded idle timeouts
   * @returns {Promise<{[brand: string]: number} | undefined>}
   */
  public getBrandedIdleTimeoutConfig(): Promise<BrandedIdleTimeoutConfig | undefined> {
    return this.systemAndUserPropertiesApi.getSystemProperty('ppc.web.brandedIdleTimeout')
      .then(str => {
        if (str) {
          try {
            return JSON.parse(str);
          } catch (e) {
            this.logger.error(`Unable to parse as JSON 'ppc.web.brandedIdleTimeout' System Property: ${str}`, e);
          }
        }
        return undefined;
      });
  }

  /**
   * Get current user system of measurements
   * @returns {Promise<'metric' | 'us'>}
   */
  public getSystemOfMeasurement(): Promise<SystemOfMeasurement> {
    return this.systemAndUserPropertiesApi.getUserOrSystemProperty('system-of-measurement') // system-of-measurement
      .then(property => {
        return (property.value === SystemOfMeasurement.Metric || property.value === SystemOfMeasurement.Us)
          ? (property.value as SystemOfMeasurement)
          : SystemOfMeasurement.Us;
      });
  }

  /**
   * Save current user preferred System of measurement
   * @param {'metric' | 'us'} systemOfMeasurement
   */
  public updateSystemOfMeasurement(systemOfMeasurement: SystemOfMeasurement): Promise<ApiResponseBase> {
    return this.systemAndUserPropertiesApi.updateUserProperty('system-of-measurement', {value: systemOfMeasurement});
  }
}

export enum SystemOfMeasurement {
  /**
   * International System of Units
   */
  Metric = 'metric',

  /**
   * United States customary units / imperial units
   */
  Us = 'us',
}

/**
 * Brand (organization.brand) to timout (in seconds) map
 */
export interface BrandedIdleTimeoutConfig {
  [brand: string]: number;
}
