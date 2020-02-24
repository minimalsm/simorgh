import React from 'react';
import { render } from 'enzyme';
import ArticleTimestamp from '.';
import { ServiceContextProvider } from '#contexts/ServiceContext';
import {
  hasBeenUpdated,
  // publishedAndUpdatedToday,
  // shouldDisplayLastUpdatedTimestamp,
} from './shouldDisplayLastUpdatedTimestamp';
import { timestampGenerator } from './testHelpers';

const regexDate = /[0-9]{1,2} \w+ [0-9]{4}/;
// const regexDatetime = /[0-9]{1,2} \w+ [0-9]{4}[,] [0-9]{2}[:][0-9]{2} \w+/;

// const regexUpdatedDatetime = /Updated [0-9]{1,2} \w+ [0-9]{4}[,] [0-9]{2}[:][0-9]{2} \w+/;
// const regexUpdatedDate = /^Updated [0-9]{1,2} \w+ [0-9]{4}$/;

const firstChild = wrapper => wrapper[0].children[0].data;
// const secondChild = wrapper => wrapper[1].children[0].children[0].data;

const renderedTimestamps = jsx => render(jsx).get(0).children;

// eslint-disable-next-line react/prop-types
const WrappedArticleTimestamp = ({ service, ...props }) => (
  <ServiceContextProvider service={service}>
    <ArticleTimestamp {...props} />
  </ServiceContextProvider>
);

WrappedArticleTimestamp.defaultProps = {
  service: 'news',
};

describe('ArticleTimestamp', () => {
  let originalDate;

  beforeEach(() => {
    originalDate = Date.now;
  });

  afterEach(() => {
    Date.now = originalDate;
  });

  it('should return false when the time difference between firstPublished and lastPublished in minutes is less than the minutes tolerance', () => {
    const firstPublishedTimestamp = originalDate();
    const lastUpdatedTimestamp = timestampGenerator({ minutes: 0.8 });

    const msDifference = firstPublishedTimestamp - lastUpdatedTimestamp;
    const minutesDifference = msDifference / 1000 / 60;

    expect(hasBeenUpdated(minutesDifference, 1)).toEqual(false);
  });

  it('should return true when the time difference between firstPublished and lastPublished in minutes is greater than the minutes tolerance', () => {
    expect(hasBeenUpdated(97732.683333, 1)).toEqual(true);
  });

  it('should render one timestamp - published: date when both the published and updated date is the same and current time is outside of relative window', () => {
    const renderedWrapper = renderedTimestamps(
      <WrappedArticleTimestamp
        firstPublished={1400140005000}
        lastPublished={1400153537000}
      />,
    );

    expect(renderedWrapper.length).toEqual(1);
    expect(firstChild(renderedWrapper)).toMatch(regexDate);
  });
});
