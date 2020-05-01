import pathOr from 'ramda/src/pathOr';
import assocPath from 'ramda/src/assocPath';
import path from 'ramda/src/path';
import nodeLogger from '#lib/logger.node';
import {
  NO_MEDIA_BLOCK,
  MEDIA_ASSET_EXPIRED,
  MEDIA_ASSET_REVOKED,
  MEDIA_METADATA_UNAVAILABLE,
} from '#lib/logger.const';

const logger = nodeLogger(__filename);

export const UNAVAILABLE_MEDIA_TEXT = 'unavailableMedia';
export const EXTERNAL_VPID = 'external_vpid';
export const unavailableMediaBlock = {
  type: UNAVAILABLE_MEDIA_TEXT,
  model: {},
  id: UNAVAILABLE_MEDIA_TEXT,
};

export const logUnavailableMedia = ({ block, url }) => {
  const { statusCode } = block;
  switch (statusCode) {
    case 404:
      logger.warn(MEDIA_ASSET_REVOKED, { url });
      break;
    case 410:
      logger.warn(MEDIA_ASSET_EXPIRED, { url });
      break;
    default:
      logger.error(MEDIA_METADATA_UNAVAILABLE, { url });
  }
};

export const addUnavailableMediaBlock = pageData => {
  const blocks = pathOr([], ['content', 'model', 'blocks'], pageData);
  const url = path(['metadata', 'locators', 'assetUri'], pageData);
  const mediaBlocktypeExternalVpid = blocks.find(
    block => block.type === EXTERNAL_VPID,
  );
  if (mediaBlocktypeExternalVpid) {
    logUnavailableMedia({ block: mediaBlocktypeExternalVpid, url });
  }
  const filteredBlocks = blocks.filter(block => block.type !== EXTERNAL_VPID);
  return assocPath(
    ['content', 'model', 'blocks'],
    [unavailableMediaBlock, ...filteredBlocks],
    pageData,
  );
};

const logNoMedia = ({ pageData }) => {
  logger.warn(NO_MEDIA_BLOCK, {
    url: path(['metadata', 'locators', 'assetUri'], pageData),
  });
};

const transformer = pageData => {
  const BLOCKTYPES_WITH_PLAYABLE_MEDIA = ['media', 'legacyMedia', 'version'];

  const blockTypes = pathOr([], ['metadata', 'blockTypes'], pageData);
  const hasPlayableMedia = blockTypes.some(blockType =>
    BLOCKTYPES_WITH_PLAYABLE_MEDIA.includes(blockType),
  );
  if (!hasPlayableMedia) {
    logNoMedia({ pageData });

    // If there is no block of type 'media', 'legacyMedia', 'version',
    // why are we adding an 'unavailable_media' block to the pageData?

    // addUnavailableMediaBlock below is also logging via logUnavailableMedia
    return addUnavailableMediaBlock(pageData);
  }
  return pageData;
};

export default transformer;
