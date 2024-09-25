/**
 * Location properties Location State
 */
export interface LocationPropertiesLocationState {

  /**
   * Location freeze time.
   *  This time should be used as the current time for this location.
   *  This is necessary to "rewind" the state of the location.
   */
  datetime_freeze_ms?: number;

  // Below are described tons of fields that bots use for some internal logic.
  //  These fields are described just for example, and are formed from real data from SBOX.
  //  We do not have documentation regarding the data structure for this Location State.
  additional_properties?: string[];
  welcomed?: boolean;
  has_security?: boolean;
  timeseries_properties?: {
    dailyreport?: number;
    trends?: number;
    trends_weekly?: number;
    occupancy?: number;
    weeklyreport?: number;
    monthlyreport?: number;
  };
  trends?: any; // trends structure inside
  users_total?: number;
  users_control_everything?: number;
  users_control_nothing?: number;
  users_alert_livehere?: number;
  users_alert_familyfriend?: number;
  users_alert_social?: number;
  users_alert_none?: number;
  devices_total?: number;
  devices_online?: number;
  devices_offline?: number;
  has_gateway?: boolean;
  current_occupancy_status?: string;
  current_occupancy_reason?: string;
  current_user_mode?: string;
  task__init__?: boolean;
  presencefamilypack_installed?: boolean;
  care_generalinactivity?: boolean;
  sunset_ms?: number;
  sunrise_ms?: number;
  latitude?: string;
  longitude?: string;
  timezone?: string;
  wellness_score?: number;
  users_control_devices?: number;
  users_control_readonly?: number;
  users_control_other?: number;
  users_alert_live_here?: number;
  users_alert_family?: number;
  users_alert_other?: number;

}
