import { AppApi } from './data/api/app/appApi';
import { BotApi } from './data/api/bot/botApi';
import { DeviceStreamingApi } from './data/api/deviceStreamingApi/deviceStreamingApi';
import { AuthService } from './data/services/authService';
import { OperationTokenService } from './data/services/operationTokenService';
import { OfflineService } from './data/services/offlineService';
import { CloudConfigService } from './data/services/cloudConfigService';
import { WeatherService } from './data/services/weatherService';
import { UserService } from './data/services/userService';
import { Logger } from './modules/logger/logger';
import { DeviceService } from './data/services/deviceService';
import { WcStorage } from './modules/localStorage/localStorage';
import { UserLocalStorage } from './modules/userLocalStorage/userLocalStorage';
import { LocationService } from './data/services/locationService';
import { SystemPropertiesService } from './data/services/systemPropertiesService';
import { DeviceStreamingService } from './data/services/deviceStreamingService';
import { MessagingService } from './data/services/messagingService';
import { RulesService } from './data/services/rulesService';
import { SubscriptionsService } from './data/services/subscriptionsService';
import { ProfessionalMonitoringService } from './data/services/professionalMonitoringService';
import { NarrativeService } from './data/services/narrativeService';
import { BotService } from './data/services/botService';
import { StoriesService } from './data/services/storiesService';
import { FilesService } from './data/services/filesService';
import { QueryService } from './data/services/queryService';
import { QuestionsService } from './data/services/questionsService';
import { AppApiDal } from "./data/api/app/appApiDal";
import { AppApiOAuthDal } from "./data/api/app/appApiOAuthDal";
import { AppApiReportsDal } from "./data/api/app/appApiReportsDal";
import { BotApiDal } from "./data/api/bot/botApiDal";
import { DeviceStreamingApiDal } from "./data/api/deviceStreamingApi/deviceStreamingApiDal";

// Decorators
import { inject, injectable } from './modules/common/di';
import { WebCoreConfig } from './modules/tuner/config';
import { Envir } from './modules/environment/environment';
import type { Environment } from './modules/environment/environment';
import type { Tuner } from './modules/tuner/tuner';

@injectable('WebCoreApis')
export class WebCoreApis {
  @inject('AppApi') app!: AppApi;
  @inject('DeviceStreamingApi') devices!: DeviceStreamingApi;
  @inject('BotApi') bot!: BotApi;
}

@injectable('WebCoreServices')
export class WebCoreServices {
  @inject('AuthService') auth!: AuthService;
  @inject('OperationTokenService') operationToken!: OperationTokenService;
  @inject('CloudConfigService') cloudConfig!: CloudConfigService;
  @inject('OfflineService') offline!: OfflineService;
  @inject('WeatherService') weather!: WeatherService;
  @inject('UserService') user!: UserService;
  @inject('DeviceService') device!: DeviceService;
  @inject('LocationService') location!: LocationService;
  @inject('Logger') logger!: Logger;
  @inject('UserLocalStorage') userLocalStorage!: UserLocalStorage;
  @inject('WcStorage') localStorage!: WcStorage;
  @inject('SystemPropertiesService') systemProperties!: SystemPropertiesService;
  @inject('DeviceStreamingService') deviceStreaming!: DeviceStreamingService;
  @inject('MessagingService') messaging!: MessagingService;
  @inject('NarrativeService') narrative!: NarrativeService;
  @inject('ProfessionalMonitoringService') professionalMonitoring!: ProfessionalMonitoringService;
  @inject('RulesService') rules!: RulesService;
  @inject('SubscriptionsService') subscriptions!: SubscriptionsService;
  @inject('BotService') bots!: BotService;
  @inject('StoriesService') stories!: StoriesService;
  @inject('FilesService') files!: FilesService;
  @inject('QueryService') query!: QueryService;
  @inject('QuestionsService') questions!: QuestionsService;
}

@injectable('WebCoreDals')
export class WebCoreDals {
  @inject('AppApiDal') public readonly appApiDal!: AppApiDal;
  @inject('AppApiOAuthDal') public readonly appApiOAuthDal!: AppApiOAuthDal;
  @inject('AppApiReportsDal') public readonly appApiReportsDal!: AppApiReportsDal;
  @inject('BotApiDal') public readonly botApiDal!: BotApiDal;
  @inject('DeviceStreamingApiDal') public readonly deviceStreamingApiDal!: DeviceStreamingApiDal;
}

@injectable('WebCore')
export class WebCore {
  @inject('WebCoreApis') public api!: WebCoreApis;
  @inject('WebCoreServices') public services!: WebCoreServices;

  /**
   * Data access layers. Use it to manually assemble requests.
   */
  @inject('WebCoreDals') public dals!: WebCoreDals;

  @inject('Tuner') private tuner!: Tuner;
  @inject('Envir') private envir!: Envir;

  constructor(environment?: Environment, config?: WebCoreConfig) {
    if (environment && config) {
      this.setEnvironment(environment);
      this.addConfig(environment, config);
    } else if (environment) {
      this.setEnvironment(environment);
    }
  }

  /**
   * Add configuration
   * @param {Environment} environment
   * @param {WebCoreConfig} config
   */
  public addConfig(environment: Environment, config: WebCoreConfig) {
    this.tuner.addConfig(environment, config);
  }

  public setEnvironment(environment: Environment) {
    this.envir.environment = environment;
  }
}

// Additional exports for admin webcore
export * from './modules/common/di';
