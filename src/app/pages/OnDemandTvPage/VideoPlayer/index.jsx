import React, { useContext } from 'react';
import { string } from 'prop-types';
import {
  CanonicalMediaPlayer,
  AmpMediaPlayer,
} from '@bbc/psammead-media-player';
import pathOr from 'ramda/src/pathOr';
import { RequestContext } from '#contexts/RequestContext';
import { ServiceContext } from '#contexts/ServiceContext';
import getPlaceholderImageUrl from '../../../routes/utils/getPlaceholderImageUrl';

const VideoPlayer = ({
  assetId,
  imageUrl,
  title,
  embedUrl,
  iframeTitle,
  type,
  className,
}) => {
  const { translations, service } = useContext(ServiceContext);
  const { isAmp, platform } = useContext(RequestContext);

  const isValidPlatform = ['amp', 'canonical'].includes(platform);
  const mediaInfo = {
    title,
    type,
  };
  const noJsMessage = pathOr(
    `This ${mediaInfo.type} cannot play in your browser. Please enable JavaScript or try a different browser.`,
    ['media', 'noJs'],
    translations,
  );
  const placeholderSrc = getPlaceholderImageUrl(imageUrl);

  if (!isValidPlatform || !assetId) return null;

  return (
    <div className={className}>
      {isAmp ? (
        <AmpMediaPlayer
          placeholderSrc={placeholderSrc}
          src={embedUrl}
          title={iframeTitle}
          noJsMessage={noJsMessage}
          service={service}
        />
      ) : (
        <CanonicalMediaPlayer
          showPlaceholder={false}
          src={embedUrl}
          title={iframeTitle}
          service={service}
          mediaInfo={mediaInfo}
          noJsMessage={noJsMessage}
          noJsClassName="no-js"
        />
      )}
    </div>
  );
};

VideoPlayer.propTypes = {
  embedUrl: string,
  assetId: string,
  imageUrl: string,
  type: string,
  title: string,
  iframeTitle: string,
  className: string,
};

VideoPlayer.defaultProps = {
  embedUrl: '',
  assetId: '',
  imageUrl: '',
  type: '',
  title: '',
  iframeTitle: '',
  className: '',
};

export default VideoPlayer;
