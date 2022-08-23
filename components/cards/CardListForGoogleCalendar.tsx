// import React and Next.js related
import { useEffect, useState } from 'react';

// import card components
import NumberOfMeetings from './NumberOfMtgs';
// import TotalTimeOfMeetings from './TotalTimeOfMtgs';

// import configs and contexts
import { NumbersType } from '../../config/firebaseTypes';
import {
  GlobalContextObjectType,
  useGlobalContext
} from '../../context/GlobalContextProvider';

// import services
import GearIconLink from '../common/GearIcon';
import { UpdInsGoogleCalendarNumbers } from '../../services/setDocToFirestore';
import { useNumberOfEvents } from '../../services/googleCalendar.client';
import moment from 'moment';

interface PropTypes {
  googleOAuthAccessToken: string;
  googleRefreshToken: string;
  numbersDoc: NumbersType;
  uid: string;
}

const CardListForGoogleCalendar = ({
  googleOAuthAccessToken,
  googleRefreshToken,
  numbersDoc,
  uid
}: PropTypes) => {
  // Global timestamp button context
  const globalState: GlobalContextObjectType = useGlobalContext();
  const currentTimeframe = globalState.currentTimeframe;

  // Aggregate numbers from Google Calendar
  const [numberOfEvents, setNumberOfEvents] = useState(
    numbersDoc?.googleCalendar?.numberOfEvents?.allPeriods || 0
  );
  const [TotalTimeOfEvents, setTotalTimeOfEvents] = useState(
    numbersDoc?.googleCalendar?.totalTimeOfEvents?.allPeriods || 0
  );
  const [googleAccessToken, setGoogleAccessToken] = useState(
    googleOAuthAccessToken
  );

  // This is a useSWR and an asynchronous function but unnecessary to wait.
  const googleOutput = useNumberOfEvents(
    googleAccessToken,
    currentTimeframe?.timeframe?.since?.toISOString() ||
      moment().subtract(5, 'years').toISOString(),
    currentTimeframe?.timeframe.until.toISOString() || moment().toISOString(),
    googleRefreshToken,
    uid
  );

  // Update numbers in local state
  useEffect(() => {
    setNumberOfEvents(googleOutput.numberOfEvents);
    setTotalTimeOfEvents(googleOutput.totalTimeOfEvents);
    setGoogleAccessToken(googleOutput.googleAccessToken);
  }, [
    googleOutput.googleAccessToken,
    googleOutput.numberOfEvents,
    googleOutput.totalTimeOfEvents
  ]);

  // Update numbers in Firestore
  useEffect(() => {
    UpdInsGoogleCalendarNumbers({
      docId: uid,
      numberOfEventsAllPeriods: numberOfEvents,
      totalTimeOfEventsAllPeriods: TotalTimeOfEvents
    });
  }, [numberOfEvents, TotalTimeOfEvents, uid]);

  return (
    <>
      <div id='google-calendar-cards' className='flex'>
        <h2 className='text-xl mt-4 mb-2'>Communication - Google Calendar</h2>
        <GearIconLink
          mt={5}
          mb={2}
          href='/user-settings'
          alt='Gear icon links to user settings'
        />
      </div>
      <div className='grid gap-3 md:gap-5 grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
        <NumberOfMeetings data={numberOfEvents} />
        {/* <TotalTimeOfMeetings data={TotalTimeOfEvents} /> */}
      </div>
    </>
  );
};

export default CardListForGoogleCalendar;
