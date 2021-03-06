import React from 'react';
import { shouldMatchSnapshot } from '@bbc/psammead-test-helpers';
import { render, getByText, getByRole } from '@testing-library/react';
import { ServiceContextProvider } from '#contexts/ServiceContext';
import OnDemandHeading from '.';

// eslint-disable-next-line react/prop-types
const Component = ({ ariaHidden, idAttr }) => (
  <ServiceContextProvider service="news">
    <OnDemandHeading
      brandTitle="Dunia Pagi Ini"
      releaseDateTimeStamp={1587945600000}
      uuid="uuid"
      idAttr={idAttr}
      ariaHidden={ariaHidden}
    />
  </ServiceContextProvider>
);

describe('AudioPlayer blocks OnDemandHeading', () => {
  shouldMatchSnapshot('should render correctly', <Component />);

  it('should have semantic h1 with child span with role attribute = text so that screen readers read the BrandTitle and Datestamp in one go', () => {
    render(<Component />);

    const outerH1 = document.querySelector('h1');
    const spanWithAriaRoleText = getByRole(outerH1, 'text');
    const brandTitle = getByText(spanWithAriaRoleText, 'Dunia Pagi Ini');

    expect(outerH1).toContainElement(spanWithAriaRoleText);
    expect(spanWithAriaRoleText).toContainElement(brandTitle);
  });

  it('should not emit an h1 when ariaHidden is true', () => {
    render(<Component ariaHidden />);

    expect(document.querySelector('h1')).toBeNull();
  });

  it('should be aria-hidden when ariaHidden is true', () => {
    const { container } = render(<Component ariaHidden />);

    expect(container.querySelector('strong[aria-hidden=true]')).toBeDefined();
  });

  it('should have a tab index of -1 when id is "content"', () => {
    const { container } = render(<Component idAttr="content" />);

    expect(container.querySelector('[tabIndex=-1]')).toBeInTheDocument();
  });

  it('should not have a tab index when id is not "content"', () => {
    const { container } = render(<Component idAttr="foo" />);

    expect(container.querySelector('[tabIndex]')).toBeNull();
  });

  it('should have visually hidden comma so screenreaders pause when reading', () => {
    render(<Component />);

    const visuallyHiddenComma = document.querySelector(
      'span[class^="VisuallyHiddenText"]',
    );

    expect(visuallyHiddenComma).toBeInTheDocument();
    expect(visuallyHiddenComma).toContainHTML(', ');
  });
});
