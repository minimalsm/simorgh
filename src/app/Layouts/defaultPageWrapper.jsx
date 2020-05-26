import React, { useContext } from 'react';
import { node } from 'prop-types';
import GlobalStyles from '@bbc/psammead-styles/global-styles';
import HeaderContainer from '../containers/Header';
import FooterContainer from '../containers/Footer';
import ManifestContainer from '../containers/Manifest';
import ServiceWorkerContainer from '../containers/ServiceWorker';
import MPulseBeacon from '../containers/MPulseBeacon';
import WebVitals from '../containers/WebVitals';
import { ServiceContext } from '../contexts/ServiceContext';
import useWebVitals from '#hooks/useWebVitals';

const PageWrapper = ({ children }) => {
  useWebVitals();
  const { fonts: fontFunctions } = useContext(ServiceContext);

  const fonts = fontFunctions.map(getFonts => getFonts());

  return (
    <>
      <GlobalStyles fonts={fonts} />
      <ServiceWorkerContainer />
      <ManifestContainer />
      <MPulseBeacon />
      {/* <WebVitals /> */}
      <HeaderContainer />
      {children}
      <FooterContainer />
    </>
  );
};

PageWrapper.propTypes = {
  children: node.isRequired,
};

export default PageWrapper;
