const { getPageUrls } = require('./cypress/support/helpers/getPageUrls');

// allPageWidths = [240, 360, 600, 1008, 1280];
// Run a11y on 360px only since designs are done in this width
// This functionality can be extended to allow for testing on all widths
const pageWidths = [360];
const environment = 'local';
const isSmoke = true;
const baseUrl = 'http://localhost:7080';

// '/html/head/iframe' Added to prevent false negatives from mPulse beacon
// which creates iframe in document head

// '//div[@id='root']/main/div/div/div/div/iframe' Added to hide
// iframe errors to be fixed in https://github.com/bbc/bbc-a11y/issues/298

// '//div[@id='root']/header/nav/div/div[1]/div/ul' Added to hide
// errors in scrollable navigation for RTL languages to be fixed in
// https://github.com/bbc/simorgh/issues/5222

const pageTypes = {
  frontPage: [
    '/html/head/iframe',
    "//div[@id='root']/header/nav/div/div[1]/div/ul",
  ],
  articles: [
    '/html/head/iframe',
    "//div[@id='root']/header/nav/div/div[1]/div/ul",
  ],
  liveRadio: [
    '/html/head/iframe',
    "//div[@id='root']/main/div/div/div/iframe",
    "//div[@id='root']/header/nav/div/div[1]/div/ul",
  ],
  photoGalleryPage: [
    '/html/head/iframe',
    "//div[@id='root']/header/nav/div/div[1]/div/ul",
  ],
  mostReadPage: [
    '/html/head/iframe',
    "//div[@id='root']/header/nav/div/div[1]/div/ul",
  ],
};

Object.keys(pageTypes).forEach(pageType => {
  getPageUrls({ pageType, environment, isSmoke }).forEach(url =>
    pageWidths.forEach(width =>
      // eslint-disable-next-line no-undef
      page(`${baseUrl}${url}`, { width, hide: pageTypes[pageType] }),
    ),
  );
});
