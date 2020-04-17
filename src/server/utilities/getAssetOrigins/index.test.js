import getAssetOrigins from '.';

jest.mock('../serviceConfigs', () => ({
  news: {
    default: {
      fonts: ['sans-serif'],
    },
  },
  foobar: {
    default: {
      fonts: [],
    },
  },
}));

const fontOrigins = [
  'https://gel.files.bbci.co.uk',
  'https://ws-downloads.files.bbci.co.uk',
];

const defaultOrigins = [
  'https://www.bbc.com',
  'https://ichef.bbci.co.uk',
  'https://cookie-oven.api.bbc.com',
  'https://cookie-oven.api.bbc.co.uk',
  'https://a1.api.bbc.co.uk',
  'https://static.chartbeat.com',
  'https://ping.chartbeat.net',
];

describe('getAssetOrigins', () => {
  it('should return the asset origins as an array', async () => {
    expect(getAssetOrigins('foobar')).toEqual([...defaultOrigins]);
  });

  it('asset origins should include fonts origins', async () => {
    expect(getAssetOrigins('news')).toEqual([
      ...defaultOrigins,
      ...fontOrigins,
    ]);
  });
});
