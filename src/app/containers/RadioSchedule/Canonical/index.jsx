import React, { useContext } from 'react';
import { useData } from 'react-isomorphic-data';
import 'isomorphic-fetch';
import { string } from 'prop-types';
import styled from 'styled-components';
import pathOr from 'ramda/src/pathOr';
import moment from 'moment';
import {
  GEL_GROUP_1_SCREEN_WIDTH_MAX,
  GEL_GROUP_2_SCREEN_WIDTH_MIN,
  GEL_GROUP_3_SCREEN_WIDTH_MIN,
  GEL_GROUP_4_SCREEN_WIDTH_MIN,
} from '@bbc/gel-foundations/breakpoints';
import {
  GEL_SPACING,
  GEL_SPACING_DBL,
  GEL_SPACING_TRPL,
  GEL_SPACING_QUAD,
  GEL_MARGIN_BELOW_400PX,
  GEL_MARGIN_ABOVE_400PX,
} from '@bbc/gel-foundations/spacings';
import { getLongPrimer } from '@bbc/gel-foundations/typography';
import { getSansRegular } from '@bbc/psammead-styles/font-styles';
import RadioSchedule from '@bbc/psammead-radio-schedule';
import SectionLabel from '@bbc/psammead-section-label';
import { C_LUNAR, C_EBON, C_METAL } from '@bbc/psammead-styles/colours';
import { ServiceContext } from '#contexts/ServiceContext';
import { RequestContext } from '#contexts/RequestContext';
import processRadioSchedule from '../utilities/processRadioSchedule';

const RadioScheduleSection = styled.section.attrs(() => ({
  role: 'region',
  'aria-labelledby': 'Radio-Schedule',
}))`
  background-color: ${C_LUNAR};
  padding: 0 ${GEL_MARGIN_ABOVE_400PX};
  @media (max-width: ${GEL_GROUP_1_SCREEN_WIDTH_MAX}) {
    /* To remove GEL Margins */
    margin: ${GEL_SPACING_QUAD} -${GEL_MARGIN_BELOW_400PX} 0;
    padding: 0 ${GEL_MARGIN_BELOW_400PX};
  }
  @media (min-width: ${GEL_GROUP_2_SCREEN_WIDTH_MIN}) {
    margin: ${GEL_SPACING_QUAD} -${GEL_MARGIN_ABOVE_400PX} 0;
  }
  @media (min-width: ${GEL_GROUP_3_SCREEN_WIDTH_MIN}) {
    margin: ${GEL_SPACING_TRPL} -${GEL_MARGIN_ABOVE_400PX} 0;
  }
`;

const RadioScheduleWrapper = styled.div`
  margin: 0 auto;
  width: 100%; /* Needed for IE11 */
  padding-bottom: ${GEL_SPACING_DBL};
  @media (min-width: ${GEL_GROUP_3_SCREEN_WIDTH_MIN}) {
    margin-top: ${GEL_SPACING_TRPL};
  }
  @media (min-width: ${GEL_GROUP_4_SCREEN_WIDTH_MIN}) {
    max-width: ${GEL_GROUP_4_SCREEN_WIDTH_MIN};
    padding-bottom: ${GEL_SPACING_TRPL};
  }
`;

const RadioScheduleSectionLabel = styled(SectionLabel)`
  margin: 0 auto;
  width: 100%; /* Needed for IE11 */
  padding-top: ${GEL_SPACING};
  @media (min-width: ${GEL_GROUP_3_SCREEN_WIDTH_MIN}) {
    padding-top: ${GEL_SPACING_TRPL};
  }
  @media (min-width: ${GEL_GROUP_4_SCREEN_WIDTH_MIN}) {
    max-width: ${GEL_GROUP_4_SCREEN_WIDTH_MIN};
    padding-top: ${GEL_SPACING_QUAD};
  }
`;

const RadioFrequencyLink = styled.a`
  ${({ script }) => script && getLongPrimer(script)};
  ${({ service }) => service && getSansRegular(service)};
  color: ${C_EBON};
  text-decoration: none;

  &:hover,
  &:focus {
    text-decoration: underline;
  }

  &:visited {
    color: ${C_METAL};
  }
`;

const CanonicalRadioSchedule = ({ endpoint }) => {
  const {
    service,
    script,
    dir,
    timezone,
    locale,
    radioSchedule,
    translations,
  } = useContext(ServiceContext);

  const { timeOnServer } = useContext(RequestContext);
  const timeOnClient = parseInt(moment.utc().format('x'), 10);

  const header = pathOr(null, ['header'], radioSchedule);
  const frequenciesPageUrl = pathOr(
    null,
    ['frequenciesPageUrl'],
    radioSchedule,
  );
  const frequenciesPageLabel = pathOr(
    null,
    ['frequenciesPageLabel'],
    radioSchedule,
  );

  const liveLabel = pathOr('LIVE', ['media', 'liveLabel'], translations);
  const nextLabel = pathOr('NEXT', ['media', 'nextLabel'], translations);

  // we would want to wrap this in something that handles logging?
  const { data } = useData(endpoint);

  if (!data) {
    // for client journeys, would build loading/error handling
    return null;
  }

  // maybe we'd still want to do this in a useEffect/otherwise that runs when
  // the value of data changes, to avoid running this function on every render.
  const schedule = processRadioSchedule(
    data,
    service,
    timeOnServer || timeOnClient,
  );

  if (!schedule) {
    return null;
  }

  return (
    <RadioScheduleSection>
      <RadioScheduleSectionLabel
        script={script}
        labelId="Radio-Schedule"
        service={service}
        dir={dir}
        bar={false}
        backgroundColor={C_LUNAR}
      >
        {header}
      </RadioScheduleSectionLabel>
      <RadioScheduleWrapper>
        <RadioSchedule
          schedules={schedule}
          locale={locale}
          timezone={timezone}
          script={script}
          service={service}
          dir={dir}
          liveLabel={liveLabel}
          nextLabel={nextLabel}
        />
        {frequenciesPageUrl && (
          <RadioFrequencyLink
            href={frequenciesPageUrl}
            script={script}
            service={service}
          >
            {frequenciesPageLabel}
          </RadioFrequencyLink>
        )}
      </RadioScheduleWrapper>
    </RadioScheduleSection>
  );
};

CanonicalRadioSchedule.propTypes = {
  endpoint: string.isRequired,
};

export default CanonicalRadioSchedule;
