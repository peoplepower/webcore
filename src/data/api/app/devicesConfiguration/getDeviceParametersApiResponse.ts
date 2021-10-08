import { ApiResponseBase } from '../../../models/apiResponseBase';

/**
 * Unit multipliers are used to normalize data before storing the data to the database.
 */
export enum UnitMultipliers {
  Nano = 'n', // 0.000000001,
  Micro = 'u', // 0.000001,
  Milli = 'm', // 0.001,
  Centi = 'c', // 0.01,
  Percent = '%', // 0.01,
  Deci = 'd', // 0.1,
  Empty = '', // 1,
  Deca = 'Da', // 10,
  Hecto = 'h', // 100,
  Kilo = 'k', // 1000,
  Mega = 'M', // 1000000,
  Giga = 'G', // 1000000000
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

export enum DeviceParamValueType {
  String = 0,
  Decimal = 1,
  Integer = 2,
  Boolean = 3,
}

export interface GetDeviceParametersApiResponse extends ApiResponseBase {
  deviceParams: Array<{

    /**
     * Set to 'true' if you may edit this parameter.
     */
    editable: boolean;

    /**
     * Set to 'true' if parameter may be used as a command to the device.
     */
    configured: boolean;

    /**
     * Default system unit if this is a numeric parameter to store measurements.
     */
    systemUnit: string;

    /**
     * Historical measurements behaviour configuration.
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

    /**
     * Set to 'true' if parameter accepted as a measurement from the device
     */
    profiled: boolean;

    /**
     * Parameter name (no spaces).
     */
    name: string;

    /**
     * Parameter description.
     */
    description?: string;

    /**
     * Set to 'true' if represents a number, otherwise it's string.
     */
    numeric: boolean;

    /**
     * Type of the device parameter value from Server perspective.
     * Should not be used by UI (use 'valueType' from displayInfo instead).
     */
    valueType: DeviceParamValueType;

    /**
     * Default multiplier if this is a numeric parameter to store measurements.
     */
    systemMultiplier?: UnitMultipliers;

    /**
     * Special parameter attributes for UI logic.
     */
    displayInfo?: {
      displayType: ParamDisplayType;
      valueType: ParamValueType;
      defaultOption?: number;

      /**
       * Icon font for the model. Default: 'far'.
       * Options: 'far', 'fal', 'fas', 'iotr', 'iotl'.
       */
      iconFont?: string;

      /**
       * Icon name within iconfont namespace.
       */
      icon?: string;

      mlName: {
        [key: string]: string;
      };

      /**
       * Available options.
       */
      options?: Array<{
        id: number;
        value: string;
        mlName: {
          [key: string]: string;
        };
      }>;

      /**
       * Parameters which should be passed along with current one.
       * Used in commands sent to device.
       */
      linkedParams?: string[];

      minValue?: number;
      maxValue?: number;
      step?: number;
      ranged?: boolean;
    };
  }>;
}
