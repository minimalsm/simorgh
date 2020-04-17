export default ({ hasScriptFonts = false } = {}) => {
  [amp, canonical].forEach((page) => {
    describe(`And using ${page.platform}`, () => {
      it('Resource hints tell the browser to load some things in advance', () => {
        const resources = [
          'https://www.bbc.com',
          'https://ichef.bbci.co.uk',
          'https://cookie-oven.api.bbc.com',
          'https://cookie-oven.api.bbc.co.uk',
          'https://a1.api.bbc.co.uk',
          'https://static.chartbeat.com',
          'https://ping.chartbeat.net',

          ...(hasScriptFonts
            ? [
                'https://gel.files.bbci.co.uk',
                'https://ws-downloads.files.bbci.co.uk',
              ]
            : []),
        ];

        resources.forEach((resource) => {
          const resourceEls = Array.from(
            page.document.querySelectorAll(`head link[href="${resource}"]`),
          );

          expect(resourceEls[0].getAttribute('rel')).toBe('preconnect');
          expect(resourceEls[1].getAttribute('rel')).toBe('dns-prefetch');
        });
      });
    });
  });
};
