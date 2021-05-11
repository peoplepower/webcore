/**
 * Type of a WS request or a response
 */
export enum WsPacketGoal {
  /**
   * Websocket session authentication
   */
  Auth = 1,

  /**
   * Availability of subscriptions within current scope that available for current user
   */
  Presence = 2,

  /**
   * Subscription to specific data coming from other sources
   */
  Subscribe = 3,

  /**
   * Unsubscribe from a single subscription
   */
  Unsubscribe = 4,

  /**
   * Status of the session including current subscriptions
   */
  Status = 5,

  /**
   * Data from the server on which the client subscribed (responses only)
   */
  Data = 6,

  // Following goals are not supported yet
  // NOTE: numbers may change!
  //
  // /**
  //  * Request (get) action and response for some data for specific data model (used by Client only)
  //  */
  // Request = 7,
  //
  // /**
  //  * Update (put) of existing data for specific data model
  //  */
  // Update = 8,
  //
  // /**
  //  * Add new item(s) (post) into the data model
  //  */
  // Create = 9,
  //
  // /**
  //  * Delete some item(s) from some data model
  //  */
  // Delete = 10
}
