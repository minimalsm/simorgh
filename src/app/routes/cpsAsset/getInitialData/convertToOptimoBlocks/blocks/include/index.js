import 'isomorphic-fetch';
import {
  INCLUDE_ERROR,
  INCLUDE_FETCH_ERROR,
  INCLUDE_MISSING_URL,
  INCLUDE_REQUEST_RECEIVED,
  INCLUDE_UNSUPPORTED,
} from '#lib/logger.const';
import nodeLogger from '#lib/logger.node';

const logger = nodeLogger(__filename);

const buildIncludeUrl = (href, type) => {
  const resolvers = {
    idt1: '',
    idt2: '/html',
    vj: '',
  };

  const withTrailingHref = href.startsWith('/') ? href : `/${href}`;

  return `${process.env.SIMORGH_INCLUDES_BASE_URL}${withTrailingHref}${resolvers[type]}`;
};

const fetchMarkup = async ({ includeUrl, pagePath }) => {
  try {
    /* The timeout value here is arbitrary and subject to change. It's purpose is to ensure that pending promises do not delay page rendering on the server.
      Using isomorphic-fetch means we use window.fetch, which does not have a timeout option, on the client and node-fetch, which does, on the server.
    */
    const res = await fetch(includeUrl, { timeout: 3000 });
    if (res.status !== 200) {
      logger.error(INCLUDE_FETCH_ERROR, {
        pagePath,
        status: res.status,
        includeUrl,
      });
      return null;
    }
    const html = await res.text();
    logger.info(INCLUDE_REQUEST_RECEIVED, {
      pagePath,
      includeUrl,
    });
    return html;
  } catch (error) {
    logger.error(INCLUDE_ERROR, {
      pagePath,
      error: error.toString(),
      includeUrl,
    });
    return null;
  }
};

const convertInclude = async includeBlock => {
  const pagePath = '/mundo/23263889';
  const supportedTypes = {
    indepthtoolkit: 'idt1',
    idt2: 'idt2',
    include: 'vj',
    'news/special': 'vj',
    'market-data': 'vj',
    'smallprox/include': 'vj',
  };

  const { href, type, ...rest } = includeBlock;

  if (!href) {
    logger.error(INCLUDE_MISSING_URL, { pagePath, includeBlock });
    return null;
  }

  // This determines if the href has a leading '/'
  const hrefTypePostion = () => (href.indexOf('/') === 0 ? 1 : 0);

  // This checks if the supportedType is in the correct position of the href
  const hrefIsSupported = () => supportedType =>
    href.startsWith(supportedType, hrefTypePostion());

  // This extracts the type from the href
  const typeExtraction = Object.keys(supportedTypes).find(
    hrefIsSupported(href),
  );

  // This determines if the type is supported and returns the include type name
  const includeType = supportedTypes[typeExtraction];
  if (!includeType) {
    logger.info(INCLUDE_UNSUPPORTED, {
      pagePath,
      type,
      includeUrl: href,
    });
    return null;
  }

  return {
    type,
    model: {
      href,
      html: await fetchMarkup({
        includeUrl: buildIncludeUrl(href, includeType),
        pagePath,
      }),
      type: includeType,
      ...rest,
    },
  };
};

export default convertInclude;
