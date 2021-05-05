import { ApiResponseBase } from './apiResponseBase';

export const API_ERROR_CODES: { [resultCode: number]: string } = {
  0: 'Success',
  1: 'Internal error',
  2: 'Wrong API key',
  3: 'Wrong location ID or location is not related to the user',
  4: 'Wrong device ID or device has not been found',
  5: 'Device proxy (gateway) has not been found',
  6: 'Object not found',
  7: 'Access denied',
  8: 'Wrong parameter value',
  9: 'Missed mandatory parameter value',
  10: 'No available device resources to complete operation',
  11: 'Not enough free files space',
  12: 'Invalid username or wrong password',
  13: 'Wrong index value',
  14: 'Error in parsing of input data',
  17: 'Wrong activation key',
  18: 'Wrong rule schedule format',
  20: 'Duplicate user name',
  21: 'Device is offline or disconnected',
  22: 'Device is under different location',
  23: 'Rule generation error',
  24: 'Wrong device registration code',
  26: 'Duplicate entity or property',
  27: 'Timeout in device communication',
  28: 'Device is not linked to any location',
  29: 'Requested API method not found',
  30: 'Service is temporary unavailable',
  31: 'Unknown OAuth client',
  32: 'External application error response',
  33: 'Wrong operation token',
  34: 'Cannot modify external resources',
  35: 'Wrong phone number',
  36: 'Operation cancelled',
};

/**
 * Class for errors for Webapps Core. Every rejected promise should return instance of this class.
 */
export class CoreApiError {
  protected apiErrorCodeDescriptions: { [key: number]: string } = API_ERROR_CODES;

  /**
   * API error
   */
  protected apiError?: ApiResponseBase;

  /**
   * Optional message string
   */
  protected message?: string;

  constructor(apiError: ApiResponseBase, message?: string);
  constructor(message: string);
  constructor(error: any, message?: string) {
    if (typeof error === 'string' || error instanceof String) {
      this.message = error.toString();
    } else {
      this.apiError = error;
      this.message = message;
    }
  }

  public getMessage(): string {
    let msg: string[] = [];
    if (this.apiError) {
      if (this.apiError.resultCode) {
        msg.push('Result code: ' + this.apiError.resultCode);
      }

      if (this.apiError.resultCodeMessage) {
        msg.push(this.apiError.resultCodeMessage);
      }

      if (this.apiError.resultCodeDesc) {
        msg.push(this.apiError.resultCodeDesc);
      } else if (this.apiError.resultCode && this.apiErrorCodeDescriptions[this.apiError.resultCode]) {
        msg.push(<string>this.apiErrorCodeDescriptions[this.apiError.resultCode]);
      }
    }

    if (this.message) {
      msg.push(this.message);
    }
    return msg.join('\n');
  }

  public toString(): string {
    return this.getMessage();
  }
}
