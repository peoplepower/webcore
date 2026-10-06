import { LocationPriorityCategory } from "../../userAccounts/getUserInformationApiResponse";

export interface DashboardHeaderLocationState {
  /**
   * Unique identifying name. App Required.
   */
  name: string;

  /**
   * Priority of this dashboard header, which dictates color. App Required.
   */
  priority: LocationPriorityCategory;

  /**
   * Title at the top of the dashboard. App Required.
   */
  title: string;

  /**
   * Comment to display under the title. App Required.
   */
  comment: string;

  /**
   * Icon name. App Required.
   */
  icon: string;

  /**
   * Icon font package (app default is 'far')
   */
  'icon_font': string;

  /**
   * Auto-Populated by a Conversation: True to show the emergency call button (app default is False)
   */
  call: boolean;

  /**
   * If the emergency call button is present, this flag allows the user to contact the Emergency Call Center by sending data stream message "contact_ecc" with a "user_id" in the content. (app default is False)
   */
  ecc: boolean;

  /**
   * Time at which this was updated - you can use this to show a human friendly update time on the dashboard if you want. Like "a few seconds ago" or "earlier today"
   * Timestamp in milliseconds.
   */
  'updated_ms': number;

  /**
   * Question for the resolution question (app default is not to show a resolution option)
   */
  resolution: {
    /**
     * Button to show on the dashboard
     */
    button: string;

    /**
     * Title at the top of the bottom modal action sheet
     */
    title: string;

    /**
     * To answer this question, send a data stream message to this address...
     * ... and include `this.content` field merged with the 'content' from the selected option.
     * Whatever the bot presents here is mandatory to send back to the bot
     * It is your responsibility to create/fill out the user_id field yourself.
     * Your final data stream content may look like:
     *   {
     *       "microservice_id": "26e636d2-c9e6-4caa-a2dc-a9738505c9f2",
     *       "conversation_id": "68554d0f-da4a-408c-80fb-0c8f60b0ebc3",
     *       "user_id": 1234,
     *       "answer": 0
     *   }
     */
    'datastream_address': string;

    /**
     * Content that should be merged with the 'content' from the selected option to answer this question.
     */
    content: {
      /**
       * Optional microservice ID
       */
      'microservice_id'?: string;

      /**
       * Optional conversation ID
       */
      'conversation_id'?: string;

      /**
       * User ID resolving this problem. Note that you should fill this field while processing response.
       */
      'user_id'?: string;

      /**
       * Other metadata that you should also include.
       */
      [key: string | number]: any;
    };

    /**
     * Collection of Response options
     */
    'response_options': Array<{
      /**
       * Human-readable response option text
       */
      text: string;

      /**
       * Content that should be merged with the `content` field from 'resolution' object to answer this question.
       */
      content: {
        /**
         * Answer ID.
         */
        answer: number;

        /**
         * Other metadata that you should also include.
         */
        [key: string | number]: any;
      }
    }>;
  };

  /**
   * Question IDs for feedback
   */
  feedback: {
    /**
     * Question (human-readable) to pose for the thumbs-up / thumbs-down area.
     * E.g. "Did People Power Family do a good job?"
     */
    quantified: string;

    /**
     * Suggested text (human-readable) in the open-ended text field.
     * E.g. "What do you think caused the alert?"
     */
    verbatim: string;

    /**
     * To answer this feedback question, send a data stream message to this address ...
     */
    'datastream_address': string;

    /**
     * ... and include this content - you NEED TO fill in the 'quantified', 'verbatim', and 'user_id' fields.
     */
    content: {
      'microservice_id': string;

      /**
       * Quantified: 0=thumbs-down; 1=thumbs-up
       */
      quantified?: number;

      /**
       * Verbatim: Open-ended string
       */
      verbatim?: string;

      /**
       * Optional user ID who filled out this feedback
       */
      'user_id'?: number
    };
  };

  /**
   * Internal bot usage only: Future timestamp to apply this header
   * @deprecated
   */
  'future_timestamp_ms'?: number;

  /**
   * Internal bot usage only: Conversation object, so we can make sure headers are auto-deleted if the conversation no longer exists.
   * @deprecated
   */
  'conversation_object'?: any;

  /**
   * Internal bot usage only: Percentage good, to help rank two identical priority headers against each other. Lower percentages get shown first because they're not good.
   * 0-100 weight.
   */
  percent?: number;
}
