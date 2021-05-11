/**
 * Event class
 * @template T event data type
 * @example
 * class Security {
 *   // defining event
 *   private readonly onLogin = new LiteEvent<string>();
 *   private readonly onLogout = new LiteEvent<void>();
 *
 *   // make it public as ILiteEvent<T> type to hide `trigger` function
 *   public get LoggedIn() { return this.onLogin.expose(); }
 *   public get LoggedOut() { return this.onLogout.expose(); }
 *
 *   // trigger the event
 *   // ... onLogin.trigger('bob');
 * }
 *
 *  function Init() {
 *   let security = new Security();
 *   let loggedOut = () => {
 *     // ...
 *   };
 *
 *   // Subscribe
 *   security.LoggedIn.on((username?) => {
 *     // ...
 *   });
 *   security.LoggedOut.on(loggedOut);
 *
 *   // ...
 *
 *   // Unsubscribe
 *   security.LoggedOut.off(loggedOut);
 * }
 */
export class LiteEvent<T> {
  private handlers: { (data?: T): void }[] = [];

  /**
   * Subscribe for event
   * @param {(data?: T) => void} handler handler function
   * @returns {() => void} cancel subscription function
   */
  public on(handler: { (data?: T): void }): () => void {
    this.handlers.push(handler);
    return () => {
      this.off(handler);
    };
  }

  /**
   * Unsubscribe for event
   * @param handler handler function used in `on` function
   */
  public off(handler: { (data?: T): void }): void {
    this.handlers = this.handlers.filter((h) => h !== handler);
  }

  /**
   * Trigger the event
   * @param data event data
   */
  public trigger(data?: T): void {
    this.handlers.slice(0).forEach((h) => {
      setTimeout(() => {
        try {
          h(data);
        } catch (err) {
          // using console.log here because of node circular dependency
          console.log('Event handler throws error:');
          console.log(err);
        }
      });
    });
  }

  /**
   * Reset event. Unsubscribe all event handlers.
   */
  public reset(): void {
    this.handlers = [];
  }
}
