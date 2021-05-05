import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetCountriesApiResponse extends ApiResponseBase {
  /**
   * This is an array of Country objects maintained in Ensemble.
   */
  countries: Array<{
    /**
     * Country ID, for referencing this country elsewhere in Ensemble
     */
    id: number;

    /**
     * Name of the country
     */
    name: string;

    /**
     * ISO 3166-1 alpha-2 country code
     */
    countryCode: string;

    /**
     * ISO 4217 currency code
     */
    currencyCode: string;

    /**
     * Currency symbol
     */
    currencySymbol: string;

    /**
     * Regular expression describing the acceptable format for the zip / postal code. For example: ^\\d{5}$
     */
    zipFormat: string;

    /**
     * State name
     */
    stateName: string;

    /**
     * Zip / Postal code
     */
    zipName: string;

    /**
     * True for the country or state correlated with the current user IP address
     */
    preferred: boolean;

    /**
     * This is an array of timezone objects.
     */
    timezones: Array<{
      /**
       * Timezone ID ("US/Eastern")
       */
      id: string;

      /**
       * Timezone offset in minutes
       */
      offset: number;

      /**
       * Daylight saving time
       */
      dst: boolean;

      /**
       * Timezone name
       */
      name: string;
    }>;

    /**
     * This is an array of state objects, which include the state ID to reference this state in other API calls, the
     * name of the state, and the default timezone ID of state.
     */
    states: Array<{
      /**
       * State ID to reference this state in other API calls
       */
      id: number;

      /**
       * Name of the state
       */
      name: string;

      /**
       * Default timezone ID of state
       */
      timezoneId: string;

      /**
       * True for the country or state correlated with the current user IP address
       */
      preferred: boolean;

      /**
       * Abbreviation
       */
      abbr: string;

      /**
       * State ANSI code
       */
      code: string;
    }>;
  }>;
}
