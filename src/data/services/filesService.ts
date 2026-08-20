import { inject, injectable } from '../../modules/common/di';
import { BaseService } from './baseService';
import { ApplicationFilesApi } from '../api/app/applicationFiles/applicationFilesApi';
import { AppFileType, GetApplicationFilesApiResponse } from '../api/app/applicationFiles/getApplicationFilesApiResponse';
import { GetApplicationFileUrlApiResponse } from '../api/app/applicationFiles/getApplicationFileUrlApiResponse';
import { CloudConfigService } from './cloudConfigService';
import { PublicMediaDal } from '../dal/publicMediaDal';
import { Path } from '../../modules/common/path';
import * as qs from 'qs';

const publicMediaBaseUrl = 'https://webmedia.peoplepowerco.com/';

/**
 * Directory each public media type is stored in, relative to the public media base url.
 */
const publicMediaPaths: { [type in PublicMediaType]: string } = {
  logo: '/logos/',
};

/**
 * Default timeout (ms) of the public media file existence check request.
 */
const publicMediaCheckTimeout = 10000;

@injectable('FilesService')
export class FilesService extends BaseService {
  @inject('ApplicationFilesApi') protected readonly applicationFilesApi!: ApplicationFilesApi;
  @inject('CloudConfigService') protected readonly cloudConfigService!: CloudConfigService;
  @inject('PublicMediaDal') protected readonly publicMediaDal!: PublicMediaDal;

  /**
   * Returns a list of application files filtered by query parameters.
   * See {@link https://iotapps.docs.apiary.io/#reference/application-files/files-management/get-files}
   *
   * API_KEY: Optional to get publicly available files.
   *
   * @param params Request parameters.
   * @param {number} [params.fileId] File ID to filter by.
   * @param {AppFileType} [params.type] Type of the file to filter by.
   * @param {number} [params.userId] User ID associated with this file. It can be used by admins to access other user accounts.
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
        const queryParams = qs.stringify(params);
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

  /**
   * Builds URL of a publicly available branded media file.
   *
   * No Cloud API and no authorization is involved here: files are served by the public media host
   * (`https://webmedia.peoplepowerco.com/` by default) and the URL is composed from the naming convention:
   * `{baseUrl}/logos/{brand}-logo[-vertical][-white][@2x].{svg|png}`.
   *
   * Examples for the `peoplepower` brand:
   * - `https://webmedia.peoplepowerco.com/logos/peoplepower-logo.svg` (defaults)
   * - `https://webmedia.peoplepowerco.com/logos/peoplepower-logo@2x.png` (`fileFormat: 'PNG'`)
   * - `https://webmedia.peoplepowerco.com/logos/peoplepower-logo-vertical.svg` (`orientation: 'portrait'`)
   * - `https://webmedia.peoplepowerco.com/logos/peoplepower-logo-vertical-white@2x.png` (all of the above + `white`)
   *
   * NOTE about `params.checkExistence`: the public media host does not send any `Access-Control-Allow-Origin`
   * header and rejects preflight requests, so the existence check can only succeed where the same origin policy
   * is not enforced (Node.js, React Native, server side rendering). In a browser the check request is blocked by
   * CORS for every URL, existing or not, therefore it is disabled by default. To validate a URL from a browser
   * render it in an `<img>` tag (image loading is not restricted by CORS) and handle the `error` event.
   *
   * @param {string} brand Brand name, e.g. `peoplepower`.
   * @param {PublicMediaType} mediaType Type of the media file. Only `logo` is supported for now.
   * @param [params] Request parameters.
   * @param {PublicMediaFileFormat} [params.fileFormat] File format, `SVG` by default.
   * @param {PublicMediaOrientation} [params.orientation] Media orientation, `landscape` by default.
   * @param {boolean} [params.white] Get the white (inverted) version of the media file.
   * @param {boolean} [params.checkExistence] Check that the file is really available before resolving the URL
   *     and reject if it is not. Disabled by default, see the CORS note above.
   * @param {number} [params.timeout] Timeout (ms) of the existence check request, 10000 by default.
   * @param {string} [params.baseUrl] Public media host to use instead of the default one.
   *
   * @returns {Promise<string>} Full URL of the media file.
   */
  getPublicMedia(
    brand: string,
    mediaType: PublicMediaType,
    params?: {
      fileFormat?: PublicMediaFileFormat;
      orientation?: PublicMediaOrientation;
      white?: boolean;
      checkExistence?: boolean;
      timeout?: number;
      baseUrl?: string;
    },
  ): Promise<string> {
    if (!brand || !brand.trim()) {
      return this.reject(`Brand can not be empty [${brand}].`);
    }
    if (!mediaType || !publicMediaPaths.hasOwnProperty(mediaType)) {
      return this.reject(`Unsupported public media type [${mediaType}].`);
    }

    const fileFormat: PublicMediaFileFormat = params?.fileFormat || 'SVG';
    if (fileFormat !== 'SVG' && fileFormat !== 'PNG') {
      return this.reject(`Unsupported public media file format [${fileFormat}].`);
    }

    const orientation: PublicMediaOrientation = params?.orientation || 'landscape';
    if (orientation !== 'landscape' && orientation !== 'portrait') {
      return this.reject(`Unsupported public media orientation [${orientation}].`);
    }

    const fileName =
      encodeURIComponent(brand.trim()) +
      `-${mediaType}` +
      (orientation === 'portrait' ? '-vertical' : '') +
      (params?.white ? '-white' : '') +
      (fileFormat === 'PNG' ? '@2x.png' : '.svg');

    const mediaUrl = Path.Combine(params?.baseUrl || publicMediaBaseUrl, publicMediaPaths[mediaType], fileName);

    if (!params?.checkExistence) {
      return Promise.resolve(mediaUrl);
    }

    return this.publicMediaDal
      .head<void>(mediaUrl, {
        noAuth: true,
        timeout: params.timeout || publicMediaCheckTimeout,
      })
      .then(() => mediaUrl)
      .catch((error) => {
        const status = error?.response?.status;
        return this.reject(
          `Public media file is not available [${mediaUrl}]${status ? ` (status ${status})` : ''}: ${error?.message || error}`,
        );
      });
  }
}

/**
 * Type of a publicly available media file. Only brand logos are supported for now.
 */
export type PublicMediaType = 'logo';

/**
 * File format of a publicly available media file.
 */
export type PublicMediaFileFormat = 'SVG' | 'PNG';

/**
 * Orientation of a publicly available media file.
 */
export type PublicMediaOrientation = 'landscape' | 'portrait';
