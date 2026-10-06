import { ApiResponseBase } from '../../../models/apiResponseBase';
import { DeviceSimulationStatus } from '../devices/getDeviceByIdApiResponse';

export interface GetEscalationsApiResponse extends ApiResponseBase {
  escalations: Array<{
    escalationId: number;
    locationId: number;

    /**
     * Escalation type.
     */
    escalationType: EscalationType;

    /**
     * Escalation status.
     */
    status: EscalationStatus;

    title: string;
    description: string;

    /**
     * Escalation priority.
     */
    priority: EscalationPriority;

    /**
     * Escalation date.
     */
    creationDate: string;
    creationDateMs: number;
    eventDate: string;
    eventDateMs: number;

    /**
     * Resident (user) related to escalation.
     */
    userId: number;

    /**
     * Device triggered escalation.
     */
    deviceId?: string;
    device?: {
      id: string;
      type: number;
      modelId?: number;
      locationId: number;
      userId?: number;
      goalId?: number;
      desc?: string;
      lastDataReceivedDate?: string;
      lastDataReceivedDateMs?: number;
      lastMeasureDate?: string;
      lastMeasureDateMs?: number;
      connected: boolean;
      newDevice: boolean;
      applicationId?: number;
      simulated?: DeviceSimulationStatus;
      proxyId?: string;
      zoneId?: string;
      authId?: number;
    };

    /**
     * Escalation source type.
     * Specific source type also defines category.
     */
    eventSourceType: EscalationSourceType;

    eventData?: {
      [key: string]: any;
    }

    /**
     * Bot and service related to escalation.
     */
    createBotInstanceId: number;
    createBotService: string;

    /**
     * Confirmation attributes.
     */
    confirmUserId?: number;
    confirmationDate?: string;
    confirmationDateMs?: number;

    /**
     * Resolution attributes.
     */
    resolveUserId: number;
    resolveSourceType: EscalationSourceType;
    resolutionDate: string;
    resolutionDateMs: number;
  }>;
}

export enum EscalationType {
  /** Care alerts */
  FallDetected = 1,
  FallRisk = 2,
  CallForHelp = 3,
  DidNotWakeUp = 4,
  Inactivity = 5,
  SleepInterruption = 6,
  NotBackHome = 7,
  Wandering = 8,
  HealthAlert = 9,
  OutOfBedTooLong = 19,
  DidntComeToBed = 20,
  BedExit = 21,

  /** Security and hazards */
  SecurityAlarm = 10,
  Duress = 11,
  Smoke = 12,
  WaterLeak = 13,
  StoveHazard = 14,

  /** Technical issues */
  GatewayOffline = 15,
  DeviceOffline = 16,
  LowBattery = 17,
  UnstableConnection = 18,
}

export enum EscalationCategory {
  Care = 1,
  Security = 2,
  Technical = 3,
}

/**
 * Maps each escalation type to its category.
 */
export const ESCALATION_TYPE_CATEGORY: Record<EscalationType, EscalationCategory> = {
  /** Care alerts */
  [EscalationType.FallDetected]: EscalationCategory.Care,
  [EscalationType.FallRisk]: EscalationCategory.Care,
  [EscalationType.CallForHelp]: EscalationCategory.Care,
  [EscalationType.DidNotWakeUp]: EscalationCategory.Care,
  [EscalationType.Inactivity]: EscalationCategory.Care,
  [EscalationType.SleepInterruption]: EscalationCategory.Care,
  [EscalationType.NotBackHome]: EscalationCategory.Care,
  [EscalationType.Wandering]: EscalationCategory.Care,
  [EscalationType.HealthAlert]: EscalationCategory.Care,
  [EscalationType.OutOfBedTooLong]: EscalationCategory.Care,
  [EscalationType.DidntComeToBed]: EscalationCategory.Care,
  [EscalationType.BedExit]: EscalationCategory.Care,

  /** Security and hazards */
  [EscalationType.SecurityAlarm]: EscalationCategory.Security,
  [EscalationType.Duress]: EscalationCategory.Security,
  [EscalationType.Smoke]: EscalationCategory.Security,
  [EscalationType.WaterLeak]: EscalationCategory.Security,
  [EscalationType.StoveHazard]: EscalationCategory.Security,

  /** Technical issues */
  [EscalationType.GatewayOffline]: EscalationCategory.Technical,
  [EscalationType.DeviceOffline]: EscalationCategory.Technical,
  [EscalationType.LowBattery]: EscalationCategory.Technical,
  [EscalationType.UnstableConnection]: EscalationCategory.Technical,
};

export enum EscalationStatus {
  Open = 1,
  Confirmed = 2,
  Resolved = 3,
  Cancelled = 4,
  Expired = 5,
}

export enum EscalationPriority {
  Normal = 1,
  High = 2,
  Urgent = 3,
}

export enum EscalationSourceType {
  EndUser = 1,
  BotLogic = 2,
  SystemLogic = 3,
  ExternalApplication = 7,
  DeviceData = 8,
  Staff = 10,
  Administrator = 11,
}
