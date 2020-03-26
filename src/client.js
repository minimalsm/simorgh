/* eslint-disable react/jsx-filename-extension  */
import React from 'react';
import { loadableReady } from '@loadable/component';
import { hydrate } from 'react-dom';
import { ClientApp } from './app/containers/App';
import routes from './app/routes';
import { template, templateStyles } from '#lib/joinUsTemplate';
import loggerNode from '#lib/logger.node';
import { htmlUnescape } from 'escape-goat';

const logger = loggerNode();

let data;
if (window.SIMORGH_DATA) {
  const unescaped = htmlUnescape(window.SIMORGH_DATA);
  console.log(unescaped);
  data = JSON.parse(unescaped);
} else {
  data = {};
}

const root = document.getElementById('root');

// Only hydrate the client if we're on the expected path
// When on an unknown route, the SSR would be discarded and the user would only
// see a blank screen. Avoid this by only hydrating when the embedded page data
// and window location agree what the path is. Otherwise, fallback to the SSR.
if (data.path === window.location.pathname) {
  loadableReady(() => {
    hydrate(<ClientApp data={data} routes={routes} />, root);
  });
} else {
  logger.warn(`
    Simorgh refused to hydrate.
    It attempted to hydrate page with path ${data.path},
    but window.location says path is ${window.location.pathname}
  `);
}

if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line no-console
  console.log(template, ...templateStyles);
}

if (module.hot) {
  module.hot.accept();
}
