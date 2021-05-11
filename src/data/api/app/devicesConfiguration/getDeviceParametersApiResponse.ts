import { ApiResponseBase } from '../../../models/apiResponseBase';

/**
 * Unit multipliers are used to normalize data before storing the data to the database. For example: if a parameter
 * ppc.power was created with a unit multiplier of "1" and units of "W", then incoming measurement of 1.0 kW for the
 * parameter ppc.power will automatically be converted to 1000 W before storing the value to the IoT Software Suite.
 */
export enum UnitMultipliers {
  Nano = 'n', //0.000000001,
  Micro = 'u', //0.000001,
  Milli = 'm', //0.001,
  Centi = 'c', //0.01,
  Percent = '%', //0.01,
  Deci = 'd', //0.1,
  Empty = '', //1,
  Deca = 'Da', //10,
  Hecto = 'h', //100,
  Kilo = 'k', //1000,
  Mega = 'M', //1000000,
  Giga = 'G', //1000000000
}

/**
 * 0 - Do not save a history of measurements, keep the current state only (least expensive).
 * 1 - Update the history either every 15 minutes, or when the value changes significantly (more than 25% for numeric parameters).
 * 2 - Update the measurement history with every value change (most expensive).
 */
export enum MeasurementsHistoryUpdateBehavior {
  DontSave = 0,
  UpdatePeriodicallyOrOnSignificantChange = 1,
  UpdateOnEveryChange = 2,
}

/**
 * Display types is a UI element at frontend level.
 * 1 - Boolean (for parameters with 0/1 values only)
 0 - on/off switch (default)
 1 - yes/no checkbox
 2 - single "yes" button only as a button
 * 2 - Select
 0 - radio buttons (default)
 1 - dropdown with options
 * 4 - Select with multiple choices
 0 - checkboxes or multiple-able radio buttons (default)
 1 - dropdown with multiple selection enabled
 * 5 - Textbox (text input)
 * 6 - Day of the week
 0 - choose multiple days simultaneously (default)
 1 - pick a single day only
 * 7 - Slider (range)
 0 - integer selection between min and max (default is 0 to 100, default)
 1 - floating point selector (e.g. in a range from 0 to 1)
 2 - as a minutes:seconds format between a min and max (e.g. from 0 to 5 minutes)
 * 8 - Time (in seconds)
 0 - as hours:minutes:seconds (am/pm, default)
 1 - as hours:minutes (am/pm)
 * 9 - Datetime
 0 - date and time picker (default)
 1 - date only
 */
export enum ParamDisplayType {
  Boolean = 1,
  BooleanOnOffSwitch = 10,
  BooleanYesNoCheckbox = 11,
  BooleanSingleYesButton = 12,
  Select = 2,
  SelectRadioButtons = 20,
  SelectDropdown = 21,
  MultipleSelect = 4,
  MultipleSelectCheckboxes = 40,
  MultipleSelectDropdown = 41,
  Textbox = 5,
  DayOfWeek = 6,
  DayOfWeekMultiple = 60,
  DayOfWeekSingleDay = 61,
  Slider = 7,
  SliderMinMax = 70,
  SliderFloatingPoint = 71,
  SliderMinutesSecondsMinMax = 72,
  Time = 8,
  TimeHoursMinutesSeconds = 80,
  TimeMinutesSeconds = 81,
  Datetime = 9,
  DatetimeDateAndTimePicker = 90,
  DatetimeTimePicker = 91,
}

/**
 * Value types to set as a value for parameters.
 * 1 - Any
 * 2 - Number
 * 3 - Boolean
 * 4 - String
 * 5 - Array of any, e.g. [1, "string", 45, true ]
 * 6 - Array of numbers, e.g. [1, 3, 77]
 * 7 - Array of strings, e.g. ["horn", "bull", "rose"]
 * 8 - Object
 */
export enum ParamValueType {
  Any = 1,
  Number = 2,
  Boolean = 3,
  String = 4,
  ArrayOfAny = 5,
  ArrayOfNumbers = 6,
  ArrayOfStrings = 7,
  Object = 8,
}

export interface GetDeviceParametersApiResponse extends ApiResponseBase {
  deviceParams: Array<{
    /**
     * true - You may edit this parameter
     * false - You do not have rights to edit this parameter
     */
    editable: boolean;
    /**
     * true - This parameter may be used as a command to the device
     * false - This parameter will never be sent as a command to the device, don't allocate space for it.
     */
    configured: boolean;
    /**
     * Default system unit if this is a numeric parameter to store measurements, how its values will be stored
     */
    systemUnit: string;
    /**
     * 0 - Do not save a history of measurements, keep the current state only (least expensive).
     * 1 - Update the history either every 15 minutes, or when the value changes significantly (more than 25% for
     * numeric parameters).
     * 2 - Update the measurement history with every value change (most expensive).
     */
    historical: MeasurementsHistoryUpdateBehavior;
    /**
     * For numeric values, how many digits after the decimal point should we store.
     */
    scale?: number;
    /**
     * A product may define an attribute that describes a supported algorithm that will filter, adjust, and correct
     * data. By turning this flag on, this parameter will apply the type of data correction algorithm defined by the
     * product's attributes it is being used with. true - Enable data correction and filtered based on the product's
     * defined attributes false - No data correction or filtering needed
     */
    adjustment: boolean;
    description?: string;
    /**
     * true - Accept this parameter as a measurement from the device
     * false - This parameter will never be accepted as a measurement from the device, don't allocate space for it.
     */
    profiled: boolean;
    /**
     * Parameter name (no spaces)
     */
    name: string;
    /**
     * true - This parameter represents a number
     * false - This parameter is a string
     */
    numeric: boolean;
    /**
     * Default multiplier if this is a numeric parameter to store measurements. Other specified measurement multipliers
     * will be converted to this multiplier before storing. Example multipliers include 'n', 'u', 'm', 'c', '%', 'd',
     * '1', 'Da', 'h', 'k', 'M', 'G', etc. See the device API for more details.
     */
    systemMultiplier?: UnitMultipliers;
    /**
     * Special parameter attributes for UI logic
     */
    displayInfo?: {
      displayType: ParamDisplayType;
      valueType: ParamValueType;
      defaultOption?: number;
      mlName: {
        [key: string]: string;
      };
      options?: Array<{
        id: number;
        value: string;
        mlName: {
          [key: string]: string;
        };
      }>;
      linkedParams?: string[];
      minValue?: number;
      maxValue?: number;
      step?: number;
    };
  }>;
}
