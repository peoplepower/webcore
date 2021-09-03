import { AppApiDal } from '../appApiDal';
import { inject, injectable } from '../../../../modules/common/di';
import { AppFileType, GetApplicationFilesApiResponse } from './getApplicationFilesApiResponse';
import { GetApplicationFileUrlApiResponse } from './getApplicationFileUrlApiResponse';
import { UploadAppFileContentApiResponse } from './uploadAppFileContentApiResponse';
import { ApiResponseBase } from '../../../models/apiResponseBase';

/**
 * Application Files API.
 * See {@link https://iotapps.docs.apiary.io/#reference/application-files}
 *
 * Store application specific binary files associated with users, locations or devices.
 * For example, apps can store user images (avatars), location plans, device installation pictures.
 */
@injectable('ApplicationFilesApi')
export class ApplicationFilesApi {
  @inject('AppApiDal') protected readonly dal!: AppApiDal;

  /**
   * Allows to upload a particular file content to the server.
   * See {@link https://iotapps.docs.apiary.io/#reference/application-files/files-management/upload-file-content}
   *
   * The "Content-Type" header must be like image/*, video/*, audio/* or application/octet-stream.
   * For example: image/jpeg, video/mp4, audio/mp3.
   *
   * @param file File content data to upload.
   * @param params Request parameters.
   * @param {AppFileType} params.type Type of the file.
   * @param {number} [params.fileId] Existing file ID to replace the content and properties.
   * @param {number} [params.userId] User ID associated with this file. It can be used by admins to upload files on other user accounts.
   * @param {number} [params.locationId] ID of the location associated with the file.
   * @param {string} [params.deviceId] ID of the device associated with the file.
   * @param {string} [params.name] Name of the file.
   * @param {boolean} [params.publicAccess] Publicly available file.
   * @param contentType Type of the content of the file being uploaded.
   * @param [onUploadProgress] Uploading progress callback.
   * @returns {Promise<UploadAppFileContentApiResponse>}
   */
  uploadAppFileContent(
    file: ArrayBuffer,
    params: {
      type: AppFileType;
      fileId?: number;
      userId?: number;
      locationId?: number;
      deviceId?: string;
      name?: string;
      publicAccess?: boolean;
    },
    contentType: string = 'application/octet-stream',
    onUploadProgress?: (progressEvent: any) => void,
  ): Promise<UploadAppFileContentApiResponse> {
    // TODO: In order to actually conveniently use this method we need to introduce the service around it with public
    //  access which uses the html5 FileReader component
    return this.dal.post('appfiles', file, {
      params: params,
      onUploadProgress: onUploadProgress,
      headers: {'Content-Type': contentType},
    });
  }

  /**
   * Returns a list of application files filtered by query parameters.
   * See {@link https://iotapps.docs.apiary.io/#reference/application-files/files-management/get-files}
   *
   * API_KEY: Optional to get publicly available files.
   *
   * @param params Request parameters.
   * @param {number} [params.fileId] File ID to filter by.
   * @param {AppFileType} [params.type] Type of the file to filter by.
   * @param {number} [params.userId] User ID associated with this file. It can be used by adminis to access other user accounts.
   * @param {number} [params.locationId] ID of the location associated with the file to filter by.
   * @param {string} [params.deviceId] ID of the device associated with the file to filter by.
   * @param {string} [params.name] Name of the file to filter by.
   * @returns {Promise<GetApplicationFilesApiResponse>}
   */
  getApplicationFiles(params?: {
    fileId?: number;
    type?: AppFileType;
    userId?: number;
    locationId?: number;
    deviceId?: string;
    name?: string;
  }): Promise<GetApplicationFilesApiResponse> {
    return this.dal.get('appfiles', {params: params});
  }

  /**
   * Get a temporary URL to download the file's content directly from S3.
   * See {@link https://iotapps.docs.apiary.io/#reference/application-files/single-file-management/get-download-url}
   *
   * @param {number} fileId ID of the file to generate URL.
   * @param [params] Request parameters.
   * @param {number} [params.userId] User ID to download the file.
   * @param {number} [params.locationId] Location ID to download the file.
   * @param {string} [params.expiration] URL's expiration in milliseconds since the current time.
   *
   * @returns {Promise<GetApplicationFileUrlApiResponse>}
   */
  getApplicationFileUrl(
    fileId: number,
    params?: {
      userId?: number;
      locationId?: number;
      expiration?: string;
    },
  ): Promise<GetApplicationFileUrlApiResponse> {
    return this.dal.get(`appfiles/${encodeURIComponent(fileId.toString())}/url`, {params: params});
  }

  /**
   * Download single application file.
   * See {@link https://iotapps.docs.apiary.io/#reference/application-files/files-management/download-file}
   *
   * A temporary API key provided in the query parameter may be used to forward a link to other part of the app.
   * A temporary API key can be obtained by calling the loginByKey API. It is expired soon after receiving.
   *
   * API_KEY: Required for private files and optional for public files or when the key provided in the query parameter.
   * ANALYTIC_API_KEY: Bot API key should be used by apps instead of user keys.
   * Range: Optional request of a part of the file content. <ultiple of 10240 bytes (i.e. Range:bytes=10240-20479).
   *
   * Instead of Range you can pass attach query parameter to force response with attachment.
   *
   * @param {number} fileId ID of the file to delete.
   * @param [params] Request parameters.
   * @param {string} [params.API_KEY] Temporary file API key.
   * @param {number} [params.userId] User ID to download the file as an administrator.
   * @param {number} [params.locationId] Location ID to download the file as an administrator.
   * @param {boolean} [params.attach] Download the file content as an attachment with the Content-Disposition header.
   *
   * The response will include:
   * - The file content
   * - A Content-Type HTTP Header containing the file's content type
   * - Content range in the Content-Range header, if the Range of the content was requested.
   *   This will be in the format of bytes {start}-{end}/{total size}.
   *   For example: Content-Range: bytes 21010-47021/47022.
   * - The Accept-Ranges header containing accepted content range values in bytes.
   *   For example "0-47022".
   * - The Content-Disposition HTTP header that contains the filename when requesting a non-image, when the whole file
   *   is requested.
   *
   * See http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html for a discussion on the header options.
   *
   * HTTP Status Codes:
   * - 200 (OK): The file content is returned in full.
   * - 204 (No Content): The file exist, but the content is not available for this request.
   * - 206 (Partial Content): The file content is partially returned.
   * - 401 (Unauthorized): The API key is wrong.
   * - 404 (Not Found): The file does not exists.
   * - 500 (Internal error): Something went wrong on the server side.
   *
   * @returns {ArrayBuffer} File content.
   */
  downloadFile(
    fileId: number,
    params?: {
      API_KEY?: string;
      userId?: number;
      locationId?: number;
      attach?: boolean;
    },
  ): Promise<ArrayBuffer> {
    // TODO: In order to actually conveniently use this method we need to introduce the service around it with public
    //  access The response stream with file content actually can be used as: .then(function(response) {
    //  response.data.pipe(fs.createWriteStream('ada_lovelace.jpg')) })
    return this.dal.get(`appfiles/${encodeURIComponent(fileId.toString())}`, {params: params, responseType: 'stream'});
  }

  /**
   * Deletes specified application file.
   * See {@link https://iotapps.docs.apiary.io/#reference/application-files/single-file-management/delete-a-file}
   *
   * @param {number} fileId ID of the file to delete.
   * @param [params] Request parameters.
   * @param {number} [params.userId] User ID to delete the file as an administrator.
   * @param {number} [params.locationId] Location ID to delete the file as an administrator.
   * @returns {Promise<DeleteApplicationFileApiResponse>}
   */
  deleteFile(
    fileId: number,
    params?: {
      userId?: number;
      locationId?: number;
    },
  ): Promise<ApiResponseBase> {
    return this.dal.delete(`appfiles/${encodeURIComponent(fileId.toString())}`, {params: params});
  }
}
