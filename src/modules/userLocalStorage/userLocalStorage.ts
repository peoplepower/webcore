import { UserService } from '../../data/services/userService';
import { inject, injectable } from '../common/di';
import { WcStorage } from '../localStorage/localStorage';
import { Logger } from '../logger/logger';

@injectable('UserLocalStorage')
export class UserLocalStorage {
  @inject('UserService') protected readonly userService: UserService;
  @inject('Logger') protected readonly logger: Logger;
  @inject('WcStorage') protected readonly wcStorage: WcStorage;

  public set(path: string, data: string | number | boolean | object): Promise<void> {
    let me = this;
    return this.userService.getCurrentUserInfo().then(function (userInfo) {
      if (userInfo && userInfo.user) {
        return me.wcStorage.set(userInfo.user.id + '.' + path, data);
      }
    });
  }

  public get<T>(path: string): Promise<T | null | undefined> {
    let me = this;
    return this.userService.getCurrentUserInfo().then(function (userInfo) {
      if (userInfo && userInfo.user) {
        return me.wcStorage.get<T>(userInfo.user.id + '.' + path);
      }
    });
  }

  public remove(path: string): Promise<void> {
    let me = this;
    return this.userService.getCurrentUserInfo().then(function (userInfo) {
      if (userInfo && userInfo.user) {
        return me.wcStorage.remove(userInfo.user.id + '.' + path);
      }
    });
  }
}
