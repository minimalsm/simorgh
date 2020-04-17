import services from '../serviceConfigs';

const FONTS_ORIGINS = [
  'https://gel.files.bbci.co.uk',
  'https://ws-downloads.files.bbci.co.uk',
];

const getAssetOrigins = (service) => {
  const assetOrigins = [
    'https://www.bbc.com', // manifest.json
    'https://ichef.bbci.co.uk', // images
    'https://news.files.bbci.co.uk', // static assets
    'https://cookie-oven.api.bbc.com', // cookies
    'https://cookie-oven.api.bbc.co.uk', // cookies
    'https://a1.api.bbc.co.uk', // ATI analytics origin
    'https://static.chartbeat.com', // Chartbeat JS origin
    'https://ping.chartbeat.net', // Chartbeat ping origin
  ];

  // include fonts domains if fonts are defined in service config
  const config = services[service];

  if (config) {
    const keys = Object.keys(config);
    const { fonts } = config[keys[0]];
    if (fonts && fonts.length > 0) {
      assetOrigins.push(...FONTS_ORIGINS);
    }
  }

  return assetOrigins;
};

export default getAssetOrigins;
