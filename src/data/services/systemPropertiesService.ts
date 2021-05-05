import { inject, injectable } from '../../modules/common/di';
import { SystemAndUserPropertiesApi } from '../api/app/systemAndUserProperties/systemAndUserPropertiesApi';
import { BaseService } from './baseService';

@injectable('SystemPropertiesService')
export class SystemPropertiesService extends BaseService {

  @inject('SystemAndUserPropertiesApi') protected readonly systemAndUserPropertiesApi: SystemAndUserPropertiesApi;

  constructor() {
    super();
  }

  /**
   * Gets the value of system property that holds regular expression for password validation.
   * @returns {Promise<string>}
   */
  public getPasswordValidationRegex(): Promise<string> {
    const PASSWORD_REGEX_STR = 'web-password_regex';
    return this.systemAndUserPropertiesApi.getUserOrSystemProperty(PASSWORD_REGEX_STR);
  }

}
