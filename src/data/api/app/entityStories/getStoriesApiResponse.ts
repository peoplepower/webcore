import { ApiResponseBase } from '../../../models/apiResponseBase';
import { MediaType } from '../media/getMediaApiResponse';

/**
 * Type of the story entry
 */
export enum StoryType {
  DeviceConnect = 1, // The initial part of the add device OOBE.
  DeviceConnectionSuccess = 2, // Displayed when a device successfully connected, or the second part of OOBE.
  DeviceConnectionFail = 3, // Displayed when a device fails to connect or it takes too long for connection.
  DeviceInstallationHelp = 4, // How to install your device, it should shows as third part of OOBE.
  PaidService = 5, // How-to setup and what you've got with paid subscription.
  Scenarios = 6, // Device goals.
  Promotions = 7, // Marketing information that can shows up in app.
  Bots = 10, // Bot microservices stories.
  DeviceReconnectionRandom = 11, // Troubleshooting if something goes wrong with device connection.
  DeviceReconnectionBattery = 12, // Troubleshooting if the battery is dead and the device is now disconnected.
  DeviceReconnectionWireless = 13, // Troubleshooting if the wireless signal strength was bad and the device is now disconnected.
  OAuthSuccess = 20,
  OAuthFailure = 21,
  FAQ = 30,
}

/**
 * Type of the action.
 */
export enum ActionType {
  LinkToAnotherStory = 1,
  InAppLink = 2,
  MakePhoto = 3,
  RecordAudio = 4,
  OpenContacts = 5,
}

/**
 * Action style.
 */
export enum ActionStyle {
  Button = 1,
  Link = 2,
}

export interface GetStoriesApiResponse extends ApiResponseBase {
  stories: Array<{
    id: string;
    models?: Array<{
      id: string;
      brand: string;
    }>;
    brands?: Array<string>;
    storyType: StoryType;
    lang: string;
    title: string;
    search: string;
    pages: Array<{
      index: number;
      hidden: boolean;
      dismissible: boolean;
      subtitle: string;
      desc: string;
      style: string;
      content: string;
      actionType: ActionType;
      actionStyle: ActionStyle;
      actionStoryId: string;
      actionDesc: string;
      media: Array<{
        id: string;
        mediaType: MediaType;
        url: string;
        contentType: string;
        desc: string;
      }>;
      actions?: Array<{
        index: 0;
        type?: ActionType;
        style?: ActionStyle;
        desc?: string;
        storyId?: string;
        url?: string;
      }>;
    }>;
  }>;
}
