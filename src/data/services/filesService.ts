import { inject, injectable } from '../../modules/common/di';
import { BaseService } from './baseService';
import { ApplicationFilesApi } from '../api/app/applicationFiles/applicationFilesApi';
import { AppFileType, GetApplicationFilesApiResponse } from '../api/app/applicationFiles/getApplicationFilesApiResponse';
import { GetApplicationFileUrlApiResponse } from '../api/app/applicationFiles/getApplicationFileUrlApiResponse';
import { CloudConfigService } from './cloudConfigService';
import { Path } from '../../modules/common/path';
import * as qs from 'qs';

@injectable('FilesService')
export class FilesService extends BaseService {
  @inject('ApplicationFilesApi') protected readonly applicationFilesApi!: ApplicationFilesApi;
  @inject('CloudConfigService') protected readonly cloudConfigService!: CloudConfigService;

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
    return this.applicationFilesApi.getApplicationFiles(params);
  }

  /**
   * Create link to download single application file.
   * See related API {@link https://iotapps.docs.apiary.io/#reference/application-files/files-management/download-file}
   *
   * A temporary API key provided in the query parameter may be used to forward a link to other part of the app.
   * A temporary API key can be obtained by calling the loginByKey API. It is expired soon after receiving.
   *
   * API_KEY: Required for private files and optional for public files or when the key provided in the query parameter.
   *
   * @param {number} fileId ID of the file to generate link to.
   * @param [params] Request parameters.
   * @param {string} [params.API_KEY] Temporary file API key.
   * @param {number} [params.userId] User ID to download the file as an administrator.
   * @param {number} [params.locationId] Location ID to download the file as an administrator.
   * @param {boolean} [params.attach] Download the file content as an attachment with the Content-Disposition header.
   *
   * @returns {Promise<string>}
   */
  getApplicationFileDownloadUrl(
    fileId: number,
    params?: {
      API_KEY?: string;
      userId?: number;
      locationId?: number;
      attach?: boolean;
    },
  ): Promise<string> {
    return this.cloudConfigService.getBaseUrl().then((baseUrl) => {
      let downloadFileUrl: string = Path.Combine(baseUrl, `/cloud/json/appfiles/${encodeURIComponent(fileId.toString())}`);
      if (params) {
        let queryParams = qs.stringify(params);
        if (queryParams) {
          downloadFileUrl = `${downloadFileUrl}?${queryParams}`;
        }
      }
      return downloadFileUrl;
    });
  }

  /**
   * Get download URL for application file.
   * See {@link https://iotapps.docs.apiary.io/#reference/application-files/single-file-management/get-download-url}
   *
   * @param {number} fileId ID of the file to generate URL.
   * @param [params] Request parameters.
   * @param {number} [params.userId] User ID to download the file.
   * @param {number} [params.locationId] Location ID to download the file.
   * @param {string} [params.expiration] URL's expiration in milliseconds since the current time.
   *
   * @returns {Promise<GetDownloadUrlApiResponse>}
   */
  getApplicationFileUrl(
    fileId: number,
    params?: {
      userId?: number;
      locationId?: number;
      expiration?: string;
    },
  ): Promise<GetApplicationFileUrlApiResponse> {
    if (!fileId || isNaN(fileId)) {
      return this.reject(`File ID can not be empty [${fileId}].`);
    }
    return this.applicationFilesApi.getApplicationFileUrl(fileId, params);
  }
}
