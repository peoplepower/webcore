/**
 * Exposes some service helper methods relating to URI.
 */
export class Uri {
  /**
   * Encodes supplied string to be in the form valid for URI insertion.
   *
   * It is just a shorter signature form of the 'encodeURIComponent()'.
   * @param {string} stringValue
   * @returns {string}
   * @constructor
   */
  public static Enc(stringValue: string | number) {
    return encodeURIComponent(stringValue.toString());
  }
}
