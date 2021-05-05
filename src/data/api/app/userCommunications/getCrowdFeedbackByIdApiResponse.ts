import { ApiResponseBase } from '../../../models/apiResponseBase';
import { CrowdFeedbackType } from './postCrowdFeedbackApiResponse';

export interface GetCrowdFeedbackByIdApiResponse extends ApiResponseBase {
  feedbacks: Array<{
    /**
     * Id of the feedback entry
     */
    id: number;
    /**
     * Unique name / identifier of the app or product, selected by the developer
     */
    appName: string,
    /**
     * Version of the app that generated this request
     */
    appVersion: string,
    /**
     * 1 - New feature request
     * 2 - Problem report
     */
    type: CrowdFeedbackType,
    /**
     * Subject line describing the feature or issue
     */
    subject: string,
    /**
     * Email address of the user generating this request, not shown publicly.
     */
    email: string,
    /**
     * Problem device ID
     */
    deviceId: string,
    /**
     * Model of the device that generated the request (i.e. iPhone5,1)
     */
    deviceModel: string,
    /**
     * Operating system on the device that generated the request (i.e. iOS 8.1.2)
     */
    deviceOs: string,
    /**
     * Product ID, present if the user is giving feedback on a specific type of product.
     */
    productId: number,
    /**
     * Category of the product, present if the user is giving feedback on a specific type of product.
     */
    productCategory: number,
    /**
     * Viewer description
     */
    viewer: string,
    /**
     * Feedback content - what user suggests or the problem description, etc.
     */
    description: string,
    /**
     * Number of votes from other users for this feedback
     */
    votingCount: number,
    /**
     * This user rank of the feedback (depends on the user who asks for the feedback)
     */
    rank: number,
    /**
     * Indicates whether the entry is enabled or not
     */
    enabled: boolean
  }>;
}
