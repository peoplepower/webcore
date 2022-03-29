import { TrendCategoryName } from "./trendsCategoryLocationState";

export type TrendsMetadataLocationState = {
  [trendName in TrendName]?: TrendMetadata;
};

export type TrendName =
// Summary category

// MAIN Wellness Score: Total wellness score composed of the history of all other scores and observations, 0-100%.
  'trend.wellness_score' |


  // Sleep category

  // MAIN Sleep Score: Relative sleep quality score, abstract 0-100%.
  'trend.sleep_score' |

  // Bedtime Score: Consistency of bedtime, 0-100%.
  'trend.bedtime_score' |

  // Wakeup Score: Consistency of wakeup time, 0-100%.
  'trend.wakeup_score' |

  // Bedtime: Time occupants went to sleep, as timestamp.
  'trend.bedtime' |

  // Sleep Duration: Amount of sleep, in milliseconds.
  'trend.sleep_duration' |

  // Wake Time: Time occupants woke up, as timestamp.
  'trend.wakeup' |

  // Naps: Time spent napping in bed today, in milliseconds.
  'trend.nap_duration' |

  // Restlessness Score: Restlessness while sleeping.
  'trend.restlessness_score' |

  // Movement while Sleeping: Amount of time motion was detected while occupants were believed to be asleep, duration in milliseconds.
  'trend.sleep_movement' |


  // Activity category

  // MAIN Mobility Score: Relative mobility score, 0-100%.
  'trend.mobility_score' |

  // Time Away from Home: Time occupants have been away from home today, a possible indicator of exercise or social activity, in milliseconds.
  'trends.absent' |

  // Time Present at Home: Time occupants have been seen at home today, in milliseconds.
  'trends.present' |

  // Time Spent in Motion: An indicator of activity, In milliseconds.
  'trends.movement_duration' |

  // Time spent sitting today, in milliseconds.
  'sitting - Sitting' |

  // Rooms Visited: An indicator of activity, number of rooms.
  'trend.mobility_rooms' |


  // Bathroom category

  // MAIN Bathroom Score from 0-100%
  'trend.bathroom_score' |

  // Hygiene Score: Our hygiene score is based on showering and bathing over the past 2 weeks, 0-100%.
  'trend.hygiene_score' |

  // Bathroom Visits: Bathroom visits today, as number (visits).
  'trend.bathroom_visits' |

  // Bathroom Duration: Bathroom duration today, in milliseconds.
  'trend.bathroom_duration' |

  // Shower Visits: Shower visits today. We may transform this into a hygiene score.
  'trend.shower_visits' |

  // Bathroom Visits at Night: Number of bathroom visits at night, as number (visits).
  'trend.sleep_bathroom_visits' |


  // Social category

  // MAIN Social score from 0-100%
  'trend.social_score' |

  // Visitors: Time multiple people were detected somewhere in the living space, in milliseconds.
  'trend.visitors' |

  // Socially Together: Time multiple people were together.
  'trend.together' |

  // Someone reached out today.
  'trend.communications' |


  // Stability (falls) category

  // MAIN Score from 0-100% that represents stability
  'trend.stability_score' |

  // Potential Falls: Total falls detected each day, including fall alerts that were muted, in number of falls.
  'trend.total_falls' |

  // Fall Duration: Amount of time detected on the ground.
  'trend.fall_duration' |


  // Ambient category
  // MAIN Ambient Temperature: Average ambient temperature, in Celsius.
  'trends.ambient_temperature';


export interface TrendMetadata {
  /**
   * Category ID for this trend.
   * Now non-hidden trends could not live without category
   */
  category?: TrendCategoryName,

  title: string;
  comment: string;
  units: string;

  /**
   * Set to 'true' if trend should be hidden from UI
   */
  hidden?: boolean;

  /**
   * Optional, trends may have additional hierarchy within own category (not used now)
   */
  parent_id?: TrendName;

  daily: boolean;
  icon: string;
  operation: number;
  services: string[];
  updated_ms: number;
  window: number;
}
