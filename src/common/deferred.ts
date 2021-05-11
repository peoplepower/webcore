/**
 * Promise-based deferred object
 */
export class Deferred<T> {
  /**
   * Promise of the deferred object
   */
  public promise: Promise<T>;

  /**
   * Deferred state
   *  0 - PENDING
   *  1 - RESOLVED
   *  2 - REJECTED
   */
  public get state(): DeferredState {
    return this._state;
  }

  private _state: DeferredState = DeferredState.PENDING;
  private _resolve: Function;
  private _reject: Function;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  resolve(value?: T) {
    if (this._state !== DeferredState.PENDING) {
      throw new Error('Deferred cannot be resolved twice');
    }
    this._state = DeferredState.RESOLVED;
    this._resolve(value);
  }

  reject(reason?: any) {
    if (this._state !== DeferredState.PENDING) {
      throw new Error('Deferred cannot be resolved twice');
    }
    this._state = DeferredState.REJECTED;
    this._reject(reason);
  }

  isResolved() {
    return this._state === DeferredState.RESOLVED;
  }

  isPending() {
    return this._state === DeferredState.PENDING;
  }

  isRejected() {
    return this._state === DeferredState.REJECTED;
  }
}

/**
 * State of Promise-based deferred object
 */
export enum DeferredState {
  /**
   * Deferred in pending state
   */
  PENDING,

  /**
   * Deferred is resolved successfully
   */
  RESOLVED,

  /**
   * Deferred is rejected
   */
  REJECTED,
}
