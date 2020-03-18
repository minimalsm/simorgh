/* eslint-disable react/no-danger */
import React, { useEffect, useState } from 'react';
import 'isomorphic-fetch';
import { string } from 'prop-types';
import { GridItemConstrainedMedium } from '#lib/styledGrid';
import webLogger from '#lib/logger.web';
import useToggle from '../Toggle/useToggle';

const logger = webLogger();

const IncludeContainer = ({ href }) => {
  let markup;
  const [hasError, setError] = useState(false);
  const { enabled } = useToggle('include');

  let fetchComplete = false;

  const fetchMarkup = async () => {
    try {
      const res = await fetch(href);
      if (res.status !== 200) {
        throw new Error('Failed to fetch');
      } else {
        markup = await res.text();
      }
    } catch (e) {
      setError(true);
      logger.error(`HTTP Error: "${e}"`);
    } finally {
      fetchComplete = true;
    }
  };
  if (enabled) {
    fetchMarkup();
  }

  while (!fetchComplete);

  const shouldNotDisplayInclude = hasError || !markup || !enabled;

  if (shouldNotDisplayInclude) {
    return null;
  }

  return (
    <GridItemConstrainedMedium>
      <div dangerouslySetInnerHTML={{ __html: markup }} />,
    </GridItemConstrainedMedium>
  );
};

IncludeContainer.propTypes = {
  href: string.isRequired,
};

export default IncludeContainer;
