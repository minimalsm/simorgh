import 'isomorphic-fetch';
import nodeLogger from '#lib/logger.node';
import onClient from '#lib/utilities/onClient';
import { getQueryString, getUrlPath } from '#lib/utilities/urlParser';
import getBaseUrl from './utils/getBaseUrl';
import isLive from '#lib/utilities/isLive';
import {
  DATA_REQUEST_RECEIVED,
  DATA_NOT_FOUND,
  DATA_FETCH_ERROR,
} from '#lib/logger.const';

const logger = nodeLogger(__filename);
const STATUS_OK = 200;
const STATUS_BAD_GATEWAY = 502;
const STATUS_INTERNAL_SERVER_ERROR = 500;
const STATUS_NOT_FOUND = 404;
const upstreamStatusCodesToPropagate = [STATUS_OK, STATUS_NOT_FOUND];

const ampRegex = /.amp$/;

const baseUrl = onClient()
  ? getBaseUrl(window.location.origin)
  : process.env.SIMORGH_BASE_URL;

export const getUrl = ({ pathname }) => {
  if (!pathname) return '';

  const params = isLive() ? '' : getQueryString(pathname);
  const basePath = getUrlPath(pathname);

  return `${baseUrl}${basePath.replace(ampRegex, '')}.json${params}`; // Remove .amp at the end of pathnames for AMP pages.
};

const handleResponse = ({ url, cmsType }) => async response => {
  const { status } = response;

  if (upstreamStatusCodesToPropagate.includes(status)) {
    if (status === STATUS_NOT_FOUND) {
      logger.error(DATA_NOT_FOUND, {
        url,
        status,
        cmsType,
      });
    }

    return {
      status,
      ...(status === STATUS_OK && {
        json: await response.json(),
      }),
    };
  }

  throw new Error(
    `Unexpected upstream response (HTTP status code ${status}) when requesting ${url}`,
  );
};

const handleError = ({ e, cmsType }) => {
  const error = e.toString();

  logger.error(DATA_FETCH_ERROR, { error, cmsType });

  return {
    error,
    status: onClient() ? STATUS_BAD_GATEWAY : STATUS_INTERNAL_SERVER_ERROR,
  };
};

const fetchData = ({ path, cmsType }) => {
  const url = getUrl(path);

  logger.info(DATA_REQUEST_RECEIVED, { url, cmsType });

  return fetch(url)
    .then(handleResponse({ url, cmsType }))
    .catch(e => handleError({ e, cmsType }));
};

export default fetchData;
