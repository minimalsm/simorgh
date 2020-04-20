/* eslint-disable react/no-danger */
import React, { useRef, useEffect, useState } from 'react';
import { string } from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { GridItemConstrainedMedium } from '#lib/styledGrid';
import useToggle from '#hooks/useToggle';
import {
  createAppendScriptByCode,
  createAppendScriptBySrc,
} from './createAppendScript';

const StyledIframe = styled.iframe`
  border: 0;
`;

const IframeComponent = ({ html }) => {
  const [url, setUrl] = useState('');

  const [height, setHeight] = useState('100%');

  const commScript = `
  <script>
    var observer = new MutationObserver(function(mutations) {
      console.log({
        offsetHeight: document.body.offsetHeight,
        clientHeight: document.body.clientHeight,
        scrollHeight: document.body.scrollHeight,
        elemOffsetHeight: document.querySelector('body > div').offsetHeight,
        elemClientHeight: document.querySelector('body > div').clientHeight,
        elemScrollHeight: document.querySelector('body > div').scrollHeight,
      })
      parent.postMessage({ type: 'height', height: document.querySelector('body > div').offsetHeight + 70 }, 'http://localhost:7080');
    });
    observer.observe(document.querySelector('body > div'), {
      childList: true, 
      attributes: true,
      attributeOldValue: true
    });
  </script>
  `;

  const postMessageListener = function (e) {
    if (e.origin !== 'http://localhost:7080') return;

    if (e.data.type !== 'height') return;

    if (e.data.height !== height) {
      setHeight(e.data.height);
    }
  };

  useEffect(() => {
    const eventMethod = window.addEventListener
      ? 'addEventListener'
      : 'attachEvent';
    const eventer = window[eventMethod];
    const messageEvent =
      eventMethod === 'attachEvent' ? 'onmessage' : 'message';

    eventer(messageEvent, postMessageListener);

    return function () {
      const removeEventMethod = window.removeEventListener
        ? 'removeEventListener'
        : 'detachEvent';

      window[removeEventMethod](messageEvent, postMessageListener);
    };
  });

  useEffect(() => {
    const blob = new Blob([html + commScript], {
      type: 'text/html',
    });
    const blobUrl = URL.createObjectURL(blob);
    setUrl(blobUrl);
  }, [html, commScript]);

  return (
    <StyledIframe
      height={height}
      width="100%"
      title="iframe-component"
      src={url}
    />
  );
};

IframeComponent.propTypes = {
  html: string,
};

IframeComponent.defaultProps = {
  html: '',
};

const IncludeContainer = ({ html = '', type }) => {
  const scriptTagRegExp = new RegExp(/<script\b[^>]*>([\s\S]*?)<\/script>/gm);
  const { enabled } = useToggle('include');
  const isInitialMount = useRef(true);

  const supportedTypes = {
    idt2: 'idt2',
    vj: 'vj',
  };

  const shouldNotRenderInclude = !enabled || !html || !supportedTypes[type];

  // Keep the DOM up to date with our script tags.
  useEffect(() => {
    const originalHtml = html || '';
    const scriptTagMatches = originalHtml.matchAll(scriptTagRegExp);
    const scriptTags = Array.from(scriptTagMatches);
    async function placeScriptsOneAfterTheOther() {
      isInitialMount.current = false;
      // eslint-disable-next-line no-restricted-syntax
      for (const scriptTag of scriptTags) {
        const [textContent, contents] = scriptTag;
        const srcRegex = new RegExp(/src="(.*?)"/gm);
        const [srcContent] = Array.from(textContent.matchAll(srcRegex));
        if (srcContent) {
          const [src] = srcContent.slice(-1);
          if (src) {
            // eslint-disable-next-line no-await-in-loop
            await createAppendScriptBySrc(src);
          }
        } else if (contents) {
          // eslint-disable-next-line no-await-in-loop
          await createAppendScriptByCode(contents);
        }
      }
    }
    if (isInitialMount.current) {
      placeScriptsOneAfterTheOther();
    }
  }, [html, type, scriptTagRegExp]);

  if (shouldNotRenderInclude) {
    return null;
  }

  const isClient = typeof window !== 'undefined';

  return (
    <GridItemConstrainedMedium>
      <Link to="/pidgin/world-23252817">Pidgin STY</Link>
      <div>
        <Link to="/mundo/23263889">Mundo STY</Link>
      </div>
      <div>
        <Link to="/pidgin/tori-51745682">Pidgin Tori STY</Link>
      </div>

      {type === 'vj' && isClient ? (
        <IframeComponent html={html || ''} />
      ) : (
        <div
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: (html || '').replace(scriptTagRegExp, ''),
          }}
        />
      )}
    </GridItemConstrainedMedium>
  );
};

IncludeContainer.propTypes = {
  html: string,
  type: string.isRequired,
};

IncludeContainer.defaultProps = {
  html: null,
};

export default IncludeContainer;
