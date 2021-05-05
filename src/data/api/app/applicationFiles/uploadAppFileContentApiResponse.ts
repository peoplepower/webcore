import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface UploadAppFileContentApiResponse extends ApiResponseBase {
  /**
   * Id of the created file entity if it was a submission of a new file.
   */
  fileId: number;
}
