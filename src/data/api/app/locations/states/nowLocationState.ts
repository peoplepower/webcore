export interface NowLocationState {
  cards?: Array<{
    type: 0;
    title: string;
    weight: number;
    content?: Array<{
      status: NowLocationStateCardStatus;

      comment: string;

      /**
       * If a 'device_id' is presented, tapping on the row should bring you to the device ID's UI
       * (or somewhere useful to help diagnose the problem).
       */
      device_id?: string;

      /**
       * Card icon
       */
      icon?: string;

      /**
       * Default to "far" (font awesome regular)
       */
      icon_font?: string;

      // Apps can ignore these fields:

      /**
       * Weight: Can be ignored by the app as the cards will come pre-sorted by the bots.
       * For the bots, lower weights float to the top.
       */
      weight: number;

      /**
       * Card ID
       */
      id: string;

      /**
       * Updated timestamp in ms
       */
      updated: number;

      /**
       * These alarms are used by bots only to automatically update the dashboard
       */
      alarms?: {
        timestamp_ms: NowLocationStateCardTimestampedCommand;
      }
    }>;
  }>;
}

/**
 * Status fields for color coding
 */
export enum NowLocationStateCardStatus {
  STATUS_HIDDEN = -1,
  STATUS_GOOD = 0,
  STATUS_WARNING = 1,
  STATUS_CRITICAL = 2,
}

/**
 * Timestamped commands for NowLocationState
 */
export enum NowLocationStateCardTimestampedCommand {
  COMMAND_DELETE = -2,
  COMMAND_SET_STATUS_HIDDEN = -1,
  COMMAND_SET_STATUS_GOOD = 0,
  COMMAND_SET_STATUS_WARNING = 1,
  COMMAND_SET_STATUS_CRITICAL = 2,
}
