import { inject } from '../../modules/common/di';
import { Logger } from '../../modules/logger/logger';

export class BaseService {
  @inject('Logger') protected readonly logger: Logger;

  constructor() {}

  /**
   * Handles error and returns rejection promise
   * @param reason Reason or error.
   * @returns {Promise<never>}
   */
  protected reject(reason: any): Promise<never> {
    this.logger.error(reason.toString());
    return Promise.reject(reason);
  }
}
