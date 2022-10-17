import { AuthApi } from '../api/app/auth/authApi';
import { GetOperationTokenApiResponse } from '../api/app/auth/getOperationTokenApiResponse';
import { inject, injectable } from '../../modules/common/di';

@injectable('OperationTokenService')
export class OperationTokenService {
  constructor() {
  }

  /**
   * Get new OperationTokenProvider. After creation it will refresh Operation Token when expired, until getToken()
   * method will be called. Use getToken() method to get valid operation token. Use stop() method to stop refreshing
   * operational tokens.
   * @param {number} tokenType
   * @returns {OperationTokenProvider}
   */
  public prepareToken(tokenType: number): OperationTokenProvider {
    return new OperationTokenProvider(tokenType);
  }
}

/**
 * Operation Token provider. After creation it will refresh Operation Token when expired, until getToken() method will
 * be called. Use getToken() method to get valid operation token. Use stop() method to stop refreshing operational
 * tokens.
 */
export class OperationTokenProvider {
  @inject('AuthApi') protected readonly authApi!: AuthApi;

  get isStopped(): boolean {
    return this._isStopped;
  }

  private getTokenFromApiPromise: Promise<GetOperationTokenApiResponse> | undefined;
  private _isStopped: boolean;

  constructor(protected readonly tokenType: number) {
    this._isStopped = false;
    this.getTokenFromApi();
  }

  public getToken(): Promise<string> {
    return this.getTokenFromApiPromise!.then((result) => {
      this._isStopped = true;
      return result.token;
    });
  }

  public stop() {
    this._isStopped = true;
  }

  private getTokenFromApi() {
    if (this._isStopped) {
      return;
    }
    this.getTokenFromApiPromise = this.authApi.getOperationToken(this.tokenType).then((result) => {
      setTimeout(() => {
        this.getTokenFromApi();
      }, result.expire - result.validFrom);

      return new Promise<GetOperationTokenApiResponse>((resolve, reject) => {
        if (result.validFrom || result.validFrom === 0) {
          setTimeout(() => {
            resolve(result);
          }, result.validFrom);
        } else {
          reject();
        }
      });
    });
  }
}
