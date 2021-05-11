import { AppApiDal } from '../appApiDal';
import { ApiResponseBase } from '../../../models/apiResponseBase';
import { inject, injectable } from '../../../../modules/common/di';
import { FileOwningType, FileType, GetFilesApiResponse } from './getFilesApiResponse';
import { FileAttributesModel, UpdateFileAttributesApiResponse } from './updateFileAttributesApiResponse';
import { FilesAggregation, GetAggregatedFileListApiResponse } from './getAggregatedFileListApiResponse';
import { GetListOfFileDevicesApiResponse } from './getListOfFileDevicesApiResponse';
import { GetFileInformationApiResponse } from './getFileInformationApiResponse';
import { UploadFileApiResponse } from './uploadFileApiResponse';
import { GetDownloadUrlApiResponse } from './getDownloadUrlApiResponse';

/**
 * File Management API.
 * See {@link https://iotapps.docs.apiary.io/#reference/file-management}
 *
 * The IoT Software Suite securely manages sensitive binary files associated with location.
 * These files may be videos, images, audio, or other types of data.The storage system has a 10,240 byte write size.
 * When uploading large files, it is recommended that the file is uploaded in chunk sizes that are multiples of 10 KB.
 * The file upload mechanism is compatible with devices; that is, you do not need a valid API key
 * to upload a file.
 */
@injectable('FileManagementApi')
export class FileManagementApi {
  @inject('AppApiDal') protected readonly dal: AppApiDal;

  /**
   * Returns a list of location files.
   * See {@link https://iotapps.docs.apiary.io/#reference/file-management/files-management/get-files}
   *
   * API_KEY: API Key required
   *
   * @param params Request parameters
   * @param {number} params.locationId Location ID.
   * @param {FileType} [params.type] Type of file to obtain in the list.
   * @param {FileOwningType} [params.owners] Filter files by owners type.
   * @param {number} [params.ownerId] User ID to filter files by the specific owner.
   * @param {string} [params.deviceId] Camera device ID to filter files by the specific camera.
   * @param {string} [params.deviceDescription] Camera device description to filter files by the specific camera.
   * @param {string} [params.startDate] Optional start date to start the list of files.
   * @param {string} [params.endDate] Optional end date to end the list of files.
   * @param {string} [params.searchTag] Search by file tag.
   * @returns {Promise<GetFilesApiResponse>}
   */
  getFiles(params: {
    locationId: number;
    type?: FileType;
    owners?: FileOwningType;
    ownerId?: number;
    deviceId?: string;
    deviceDescription?: string;
    startDate?: string;
    endDate?: string;
    searchTag?: string;
  }): Promise<GetFilesApiResponse> {
    return this.dal.get('files', { params: params });
  }

  /**
   * Returns a list of N last files for the current user.
   * See {@link https://iotapps.docs.apiary.io/#reference/file-management/last-n-files/get-last-n-files}
   *
   * Parameters "count" and "endDate" are mandatory.
   * The endDate parameter is set to the current date, if not provided.
   *
   * The startDate parameter is optional and must be ignored, if it is too far from the endDate.
   * In this case it should be predicted according to summary data.
   *
   * @param {number} count Number of files to get information for.
   *
   * @param [params] Request parameters
   * @param {FileType} [params.type] Type of file to obtain in the list.
   * @param {string} [params.deviceId] Camera device ID to filter files by the specific camera.
   * @param {string} [params.deviceDescription] Camera device description to filter files by the specific camera.
   * @param {string} [params.startDate] Optional start date to start the list of files.
   * @param {string} [params.endDate] Optional end date to end the list of files, default is the current date.
   * @returns {Promise<GetFilesApiResponse>}
   */
  getLastNFiles(
    count: number,
    params?: {
      startDate?: string;
      endDate?: string;
      type?: FileType;
      deviceId?: string;
      deviceDescription?: string;
    },
  ): Promise<GetFilesApiResponse> {
    return this.dal.get(`filesByCount/${count}`, { params: params });
  }

  /**
   * This action will delete all files that are not marked as favorite.
   * See {@link https://iotapps.docs.apiary.io/#reference/file-management/files-management/delete-all-files}
   *
   * API_KEY:API Key required
   *
   * @param {number} locationId Location ID.
   * @returns {Promise<ApiResponseBase>}
   */
  deleteAllFiles(locationId: number): Promise<ApiResponseBase> {
    return this.dal.delete('files', { params: { locationId: locationId } });
  }

  /**
   * This action will delete specified file.
   * See {@link https://iotapps.docs.apiary.io/#reference/file-management/file-content-management/delete-a-file}
   *
   * API_KEY: API Key required
   *
   * @param {number} fileId File ID to update.
   * @param {number} locationId Location ID.
   * @returns {Promise<DeleteFileApiResponse>}
   */
  deleteFile(fileId: number, locationId: number): Promise<ApiResponseBase> {
    return this.dal.delete(`files/${encodeURIComponent(fileId.toString())}`, { params: { locationId: locationId } });
  }

  /**
   * Updates the file's attributes to declare, access, view and favourite preferences.
   * The file publisher (camera) can update it as completed. Also this API can be used to recover deleted files.
   * See {@link https://iotapps.docs.apiary.io/#reference/file-management/file-content-management/update-file-attributes}
   *
   * API_KEY: API Key (required for updating file attributes)
   * PPCAuthorization: esp token="ABC12345" (required for updating file as completed)
   *
   * @param {number} fileId File ID to update.
   * @param {FileAttributesModel} fileAttributes File attributes data model to send to server.
   *
   * @param params Request parameters.
   * @param {number} params.locationId Location ID.
   * @param {string} [params.proxyId] Device ID of the proxy that this file is being uploaded through.
   * @param {boolean} [params.incomplete] Set it to false to update the file as completed.
   * @param {boolean} [params.recover] Set it to true to recover a deleted file.
   * @param {boolean} [params.pure] If 'true' - Server will not make any modification of the file content.
   * @returns {Promise<UpdateFileAttributesApiResponse>}
   */
  updateFileAttributes(
    fileId: number,
    fileAttributes: FileAttributesModel,
    params: {
      locationId: number;
      proxyId?: string;
      incomplete?: boolean;
      recover?: boolean;
      pure?: boolean;
    },
  ): Promise<UpdateFileAttributesApiResponse> {
    return this.dal.put(`files/${encodeURIComponent(fileId.toString())}`, fileAttributes, { params: params });
  }

  /**
   * Allows to upload a new file to the server.
   * See {@link https://iotapps.docs.apiary.io/#reference/file-management/files-management/upload-new-file}
   *
   * The PPCAuthorization headers may take on one of two forms, to identify the source device:
   *  - Using a Device Authentication Token:
   *    PPCAuthorization: esp token="ABC12345"
   *  - Using a Streaming Session ID:
   *    PPCAuthorization: stream session="DEF67890"
   *
   * @param file File content data to upload.
   * @param [onUploadProgress] Uploading progress callback.
   * @param contentType Type of the actual content of the file being uploaded.
   * The "Content-Type" header must be like video/*, image/*, audio/*, text/plain or application/    octet-stream.
   * See https://en.wikipedia.org/wiki/Internet_media_type for possible exact values.
   * For example: video/mp4, image/jpeg, audio/mp3. The content type of a thumbnail image is always image/jpeg.
   *
   * @param params Request parameters
   * @param {string} params.proxyId Device ID of the proxy that this file is being uploaded through.
   * @param {number} [params.fileId] Existing file ID to replace the content and properties
   * @param {string} params.ext File extension (For example, mp4 or png).
   * @param {number} [params.expectedSize] Expected total size in bytes, if available.
   * @param {number} [params.duration] Duration of the video in seconds, for reporting to the UI.
   * @param {number} [params.rotate] Rotation in degrees. The UI is expected to manually rotate the video back to being upright if this is set.
   * @param {boolean} [params.thumbnail] When 'true; - the content is a thumbnail image and the file content will be uploaded later.
   * @param {boolean} [params.incomplete] When 'true' - This file content will be replaced or extended later. When 'false' - This file is complete.
   * @param {FileType} [params.type] File type. By default it is defined from the content type. However this parameter is useful.
   * If a thumbnail with different content type is uploaded first.
   * @param {boolean} [params.uploadUrl] If 'true' - Generate upload URL's for file's content and thumbnail, if the thumbnail parameter is 'true'.
   * @returns {Promise<UploadFileApiResponse>}
   */
  uploadNewFile(
    file: ArrayBuffer,
    params: {
      ext: string;
      proxyId: string;
      fileId?: number;
      deviceId?: string;
      expectedSize?: number;
      duration?: number;
      rotate?: number;
      thumbnail?: boolean;
      type?: FileType;
      incomplete?: boolean;
      uploadUrl?: boolean;
    },
    contentType: string = 'application/octet-stream',
    onUploadProgress?: (progressEvent: any) => void,
  ): Promise<UploadFileApiResponse> {
    // TODO: In order to actually conveniently use this method we need to introduce the service around it with public
    // access which uses the html5 FileReader component
    return this.dal.post('files', file, {
      params: params,
      onUploadProgress: onUploadProgress,
      headers: { 'Content-Type': contentType },
    });
  }

  /**
   * Allow to add a fragment to the content of the existing file or upload a thumbnail.
   * See {@link https://iotapps.docs.apiary.io/#reference/file-management/file-content-management/upload-a-file-fragment-or-a-thumbnail}
   *
   * The PPCAuthorization headers may take on one of two forms, to identify the source device:
   *  - Using a Device Authentication Token:
   *    PPCAuthorization: esp token="ABC12345"
   *  - Using a Streaming Session ID:
   *    PPCAuthorization: stream session="DEF67890"
   *
   * @param {number} fileId Existing file ID.
   * @param fileFragment File fragment content data to upload.
   * @param [onUploadProgress] Uploading progress callback.
   * @param [contentType] Type of the actual content of the file being uploaded.
   * The "Content-Type" header must be like video/*, image/*, audio/*, text/plain or application/octet-stream.
   * See https://en.wikipedia.org/wiki/Internet_media_type for possible exact values.
   * For example: video/mp4, image/jpeg, audio/mp3. The content type of a thumbnail image is always image/jpeg.
   *
   * @param params Request parameters.
   * @param {string} params.proxyId Device ID of the proxy that this file is being uploaded through.
   * @param {boolean} [params.thumbnail] When 'true; - the content is a thumbnail image and the file content will be uploaded later.
   * @param {boolean} [params.incomplete] When 'true' - This file content will be replaced or extended later. When 'false' - This file is complete.
   * @param {number} [params.index] Fragment index starting from 0 to identify unique file fragment.
   * @returns {Promise<UploadFileApiResponse>}
   */
  uploadFileFragmentOrThumb(
    fileId: number,
    fileFragment: ArrayBuffer,
    params: {
      proxyId: string;
      thumbnail?: boolean;
      incomplete?: boolean;
      index?: number;
    },
    contentType: string = 'application/octet-stream',
    onUploadProgress?: (progressEvent: any) => void,
  ): Promise<UploadFileApiResponse> {
    // TODO: In order to actually conveniently use this method we need to introduce the service around it with public
    //  access which uses the html5 FileReader component
    return this.dal.post(`files/${encodeURIComponent(fileId.toString())}`, fileFragment, {
      params: params,
      onUploadProgress: onUploadProgress,
      headers: { 'Content-Type': contentType },
    });
  }

  /**
   * Download or open specified file.
   * See {@link https://iotapps.docs.apiary.io/#reference/file-management/file-content-management/download-file}
   *
   * The Range HTTP Header is optional, and will only return a chunk of the total content.
   * If used, it is recommended to select a range that is a multiple of 10240 bytes (i.e. Range:bytes=10240-20479).
   * A temporary API key provided in the query parameter may be used to forward a link to other part of the app.
   * A temporary API key can be obtained by calling the loginByKey API. It is expired soon after receiving.
   *
   * - API_KEY: API key, required for private files and optional for public files or when the key provided in the query parameter
   * - ANALYTIC_API_KEY: Bot API key should be used by apps instead of user keys
   *
   * @param {number} fileId File ID to download.
   *
   * @param [params] Request parameters.
   * @param {string} [params.API_KEY] Temporary API key to download file.
   * @param {boolean} [params.thumbnail] If 'true' - Request thumbnail for downloading, if 'falce' - download actual file.
   *
   * The response will include:
   * - The file content
   * - A Content-Type HTTP Header containing the file's content type
   * - Content range in the Content-Range header, if the Range of the content was requested.
   *   This will be in the format of bytes {start}-{end}/{total size}.
   *   For example: Content-Range: bytes 21010-47021/47022.
   * - The Accept-Ranges header containing accepted content range values in bytes.
   *   For example "0-47022".
   * - The Content-Disposition HTTP header that contains the filename when requesting a non-image, when the whole file is requested.
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
   * @returns {Promise<ArrayBuffer>} File content.
   */
  downloadFile(
    fileId: number,
    params?: {
      API_KEY?: string;
      thumbnail?: boolean;
    },
  ): Promise<ArrayBuffer> {
    // TODO: In order to actually conveniently use this method we need to introduce the service around it with public
    //  access The response stream with file content actually can be used as: .then(function(response) {
    //  response.data.pipe(fs.createWriteStream('ada_lovelace.jpg')) })
    return this.dal.get(`files/${encodeURIComponent(fileId.toString())}`, { params: params, responseType: 'stream' });
  }

  /**
   * Get download URL's for file content and/or thumbnail.
   * See {@link https://iotapps.docs.apiary.io/#reference/file-management/file-content-management/get-download-url's}
   *
   * @param {number} fileId
   *
   * @param [params] Request parameters.
   * @param {number} params.locationId File location ID.
   * @param {boolean} [params.content] Request file content URL.
   * @param {boolean} [params.thumbnail] Request thumbnail content URL.
   * @param {boolean} [params.expiration] URL's expiration in milliseconds since the current time.
   * @returns {Promise<GetDownloadUrlApiResponse>}
   */
  getDownloadUrl(
    fileId: number,
    params: {
      locationId: number;
      content?: boolean;
      thumbnail?: boolean;
      expiration?: boolean;
    },
  ): Promise<GetDownloadUrlApiResponse> {
    return this.dal.get(`files/${encodeURIComponent(fileId.toString())}/url`, { params: params });
  }

  /**
   * Request files summary.
   * See {@link https://iotapps.docs.apiary.io/#reference/file-management/files-summary/get-aggregated-list-of-files}
   *
   * This API will return a list of files sorted by creation date in descending
   * order, providing summary information for the files within each aggregation period (day, week, month, etc.):
   * - File creation date rounded to the beginning of an aggregation period
   * - Total number of files
   * - Total size of the files
   * - Total duration in seconds
   * - Total viewed files
   * - Total favourite files
   *
   * In addition, each API call will return:
   * - If endDate is not provided, it is set to the current time.
   * - For aggregation by hour startDate is set to endDate minus 2 days.
   * - For aggregation by days startDate is set to endDate minus 60 days.
   * - For other aggregations startDate is set to endDate minus 400 days.
   *
   * @param {FilesAggregation} aggregation The duration of time across which to aggregate summary information.
   * @param params Request parameters
   * @param {number} params.locationId Location ID.
   * @param {string} [params.timeZone] Time zone ID to separate aggregated summary information. For example, 'America/Los_Angeles'.
   * @param {FileType} [params.type] Type of file to obtain in the list.
   * @param {string} [params.startDate] Optional start date to start the list of files.
   * @param {string} [params.endDate] Optional end date to end the list of files.
   * @param {boolean} [params.details] If 'true' - all the stored details will be returned. Otherwise - from the special and fast aggregated table.
   * @returns {Promise<GetAggregatedFileListApiResponse>}
   */
  getAggregatedFileList(
    aggregation: FilesAggregation,
    params: {
      locationId: number;
      timeZone?: string;
      type?: FileType;
      startDate?: string;
      endDate?: string;
      details?: boolean;
    },
  ): Promise<GetAggregatedFileListApiResponse> {
    return this.dal.get(`filesSummary/${encodeURIComponent(aggregation.toString())}`, { params: params });
  }

  /**
   * Returns all combinations of device ID's and device descriptions from existing user files.
   * See {@link https://iotapps.docs.apiary.io/#reference/file-management/file-devices/get-list-of-file-devices}
   *
   * @param {number} locationId Location ID.
   * @returns {Promise<GetListOfFileDevicesApiResponse>}
   */
  getListOfFileDevices(locationId: number): Promise<GetListOfFileDevicesApiResponse> {
    return this.dal.get('fileDevices', { params: { locationId: locationId } });
  }

  /**
   * Gets specified file information.
   * See {@link https://iotapps.docs.apiary.io/#reference/file-management/get-file-information/get-file-information}
   *
   * API_KEY: For public files the API key header is optional.
   *
   * @param {number} fileId ID of the file to get information for.
   * @param {number} locationId Location ID.
   * @returns {Promise<GetFileInformationApiResponse>}
   */
  getFileInformation(fileId: number, locationId: number): Promise<GetFileInformationApiResponse> {
    return this.dal.get(`filesInfo/${encodeURIComponent(fileId.toString())}`, { params: { locationId: locationId } });
  }

  /**
   * Applies a tag to the specified file.
   * See {@link https://iotapps.docs.apiary.io/#reference/file-management/file-tags/apply-tag}
   *
   * API_KEY: API Key required
   *
   * @param {number} fileId File to add tag to.
   * @param {string} tag Tag to add to the file.
   * @param {number} locationId Location ID.
   * @returns {Promise<ApplyFileTagApiResponse>}
   */
  applyFileTag(fileId: number, tag: string, locationId: number): Promise<ApiResponseBase> {
    return this.dal.put(`files/${encodeURIComponent(fileId.toString())}/tags/${encodeURIComponent(tag)}`, {
      params: { locationId: locationId },
    });
  }

  /**
   * Deletes a tag from the specified file.
   * See {@link https://iotapps.docs.apiary.io/#reference/file-management/file-tags/delete-tag}
   *
   * API_KEY: API Key required
   *
   * @param {number} fileId File to delete tag from.
   * @param {string} tag Tag to delete.
   * @param {number} locationId Location ID.
   * @returns {Promise<DeleteFileTagApiResponse>}
   */
  deleteFileTag(fileId: number, tag: string, locationId: number): Promise<ApiResponseBase> {
    return this.dal.delete(`files/${encodeURIComponent(fileId.toString())}/tags/${encodeURIComponent(tag)}`, {
      params: { locationId: locationId },
    });
  }

  /**
   * Allows to report an abuse on particular file.
   * See {@link https://iotapps.docs.apiary.io/#reference/file-management/report-abuse/report-abuse}
   *
   * API_KEY: The API key should only be used if a user is logged in and reporting abuse.
   *
   * @param {number} fileId File to report.
   * @param {string} reportType Type of report. This is typically 'abuse', but may be changed to trigger a different type of email template to support.
   * @returns {Promise<ReportAbuseApiResponse>}
   */
  reportAbuse(fileId: number, reportType: string): Promise<ApiResponseBase> {
    return this.dal.put(`files/${encodeURIComponent(fileId.toString())}/report/${encodeURIComponent(reportType)}`);
  }
}
