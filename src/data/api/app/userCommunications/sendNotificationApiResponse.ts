import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface SendNotificationApiResponse extends ApiResponseBase {

}

export interface SendNotificationModel {
  brand: string;
  pushMessage?: {
    type: number;
    template: string;
    sound: string;
    content: string;
    model: {
      [key: string]: string;
    };
    info: {
      [key: string]: string;
    };
  };
  emailMessage?: {
    subject: string;
    html: boolean;
    template: string;
    content: string;
    model: {
      [key: string]: string;
    };
    attachments: Array<{
      name: string;
      content: string;
      contentType: string;
      contentId: string;
    }>;
  };
}
