import { ApiResponseBase } from '../../../models/apiResponseBase';
import { RuleParameterCategory } from './createRulePhraseApiResponse';

/**
 * Rule status
 * 0 - incomplete
 * 1 - Active
 * 2 - Inactive
 */
export enum RuleStatus {
  Incomplete = 0,
  Active = 1,
  Inactive = 2
}

/**
 * Type of the rule triggers.
 */
export enum RuleTriggerType {
  /**
   * This type of trigger is based on a schedule. For example, "If the time is 8:00 PM on school nights".
   */
  Schedule = 11,
  /**
   * Location event, such as 'HOME', 'AWAY', etc.
   */
  Event = 12,
  /**
   * Device state includes the last update date, the last measurement date, the registration date, and the connected
   * status of the device.
   */
  DeviceState = 13,
  /**
   * Measurements
   */
  NewDeviceData = 14
}

/**
 * Rule states
 */
export enum RuleStateType {
  /**
   * Type 21 simply means this phrase is a state condition. This is the only 'type' field available for a state.
   */
  GeneralStateCondition = 21,
  /**
   * This phrase is to say "I am home" or "I am away"
   */
  LocationState = 22,
  /**
   * This phrase is to specify a state for a device parameter, such as "temperature is greater than 73 degrees
   * Fahrenheit" for example.
   */
  DeviceParameterState = 23
}

/**
 * Rule action types.
 */
export enum RuleActionType {
  /**
   * Send a push notification to the user
   */
  PushNotification = 31,
  /**
   * Send an email notification to the user
   */
  Email = 32,
  /**
   * Send a command to a device
   */
  SendCommand = 33
}

export interface Rule {
  /**
   * Rule identifier
   */
  id: number;
  /**
   * Rule name
   */
  name: string;
  /**
   * Rule status
   */
  status: RuleStatus;
  /**
   * Rule visibility
   */
  hidden: boolean;
  /**
   * Is it a default rule or not
   */
  default: boolean;
  /**
   * Rule trigger
   */
  trigger: {
    id: number;
    name: string;
    type: RuleTriggerType;
    display: number;
    timezone: boolean;
    desc: string;
    past: string;
    parameters: Array<{
      name: string;
      category: RuleParameterCategory
      value: string;
    }>;
  };
  states: {
    state: Array<{
      id: number;
      name: string;
      type: RuleStateType;
      display: number;
      timezone: boolean;
      desc: string;
      past: string;
      parameters: Array<{
        name: string;
        category: RuleParameterCategory;
        value: string;
      }>;
    }>;
  },
  /**
   * An action is what takes place if the trigger executes while all the state conditions are met. A valid rule must
   * have at least one action. For example, "make the light turn on" / "make the light turn off".
   */
  actions: Array<{
    id: number;
    name: string;
    type: RuleActionType;
    display: number;
    timezone: boolean;
    desc: string;
    past: string;
    parameters: Array<{
      name: string;
      category: RuleParameterCategory;
      value: string;
    }>;
  }>;
}

export interface GetDeviceTypeDefaultRulesApiResponse extends ApiResponseBase {
  rules: Array<Rule>;
}
