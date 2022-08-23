// import libraries
import { useEffect, useState } from 'react';

// import components
import EstimatedDateOfCompletion from './EstimatedDateOfTaskEnd';
import NumberOfCloseTasks from './NumberOfCloseTasks';
import NumberOfOpenTasks from './NumberOfOpenTasks';
import VelocityOfTaskClose from './VelocityOfTaskClose';

// import configs and contexts
import { NumbersType } from '../../config/firebaseTypes';
import {
  GlobalContextObjectType,
  useGlobalContext
} from '../../context/GlobalContextProvider';

// import services
import GearIconLink from '../common/GearIcon';
import { useNumberOfTasks } from '../../services/asanaServices.client';
import { UpdInsAsanaNumbers } from '../../services/setDocToFirestore';
import moment from 'moment';

interface PropTypes {
  asanaWorkspaceId: string;
  asanaUserId: string;
  asanaOAuthAccessToken: string;
  asanaRefreshToken: string;
  numbersDoc: NumbersType;
  uid: string;
}

const CardListForAsana = ({
  asanaWorkspaceId,
  asanaUserId,
  asanaOAuthAccessToken,
  asanaRefreshToken,
  numbersDoc,
  uid
}: PropTypes) => {
  // Global timestamp button context
  const globalState: GlobalContextObjectType = useGlobalContext();
  const currentTimeframe = globalState.currentTimeframe;

  // Initialize GitHub numbers
  const [numberOfTasks, setNumberOfTasks] = useState(
    numbersDoc?.asana?.numberOfTasks?.allPeriods || 0
  );
  const [numberOfTasksClosed, setNumberOfTasksClosed] = useState(
    numbersDoc?.asana?.numberOfTasksClosed?.allPeriods || 0
  );
  const [numberOfTasksOpen, setNumberOfTasksOpen] = useState(
    numbersDoc?.asana?.numberOfTasksOpen?.allPeriods || 0
  );
  const [velocityPerDay, setVelocityPerDay] = useState(
    numbersDoc?.asana?.velocityPerDay?.allPeriods || 0
  );
  const [velocityPerWeek, setVelocityPerWeek] = useState(
    numbersDoc?.asana?.velocityPerWeek?.allPeriods || 0
  );
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState(
    numbersDoc?.asana?.estimatedCompletionDate?.allPeriods || '--'
  );
  const [asanaAccessToken, setAsanaAccessToken] = useState(
    asanaOAuthAccessToken
  );

  // Set time period from global state
  const completedSinceISO =
    currentTimeframe?.timeframe.since?.toISOString() || '2000-01-01T00:00:00Z'; // ISO 8601
  const completedUntilISO =
    currentTimeframe?.timeframe.until?.toISOString() || moment().toISOString(); // ISO 8601

  // Aggregate Asana numbers
  const numberOfTasksCalc = useNumberOfTasks({
    asanaAccessToken,
    asanaWorkspaceId,
    asanaUserId,
    since: completedSinceISO,
    until: completedUntilISO,
    asanaRefreshToken,
    uid
  });

  // Update numbers in local state
  useEffect(() => {
    setNumberOfTasks(numberOfTasksCalc.numberOfAll);
    setNumberOfTasksClosed(numberOfTasksCalc.numberOfClosed);
    setNumberOfTasksOpen(numberOfTasksCalc.numberOfOpened);
    setVelocityPerDay(numberOfTasksCalc.velocityPerDays);
    setVelocityPerWeek(numberOfTasksCalc.velocityPerWeeks);
    setEstimatedCompletionDate(numberOfTasksCalc.estimatedCompletionDate);
    setAsanaAccessToken(numberOfTasksCalc.asanaAccessToken);
  }, [numberOfTasksCalc]);

  // Store Asana numbers in Firestore without awaiting
  useEffect(() => {
    UpdInsAsanaNumbers({
      docId: uid,
      numberOfTasksAllPeriods: numberOfTasks,
      numberOfTasksClosedAllPeriods: numberOfTasksClosed,
      numberOfTasksOpenAllPeriods: numberOfTasksOpen,
      velocityPerDayAllPeriods: velocityPerDay,
      velocityPerWeekAllPeriods: velocityPerWeek,
      estimatedCompletionDateAllPeriods: estimatedCompletionDate
    });
  }, [
    numberOfTasks,
    numberOfTasksClosed,
    numberOfTasksOpen,
    velocityPerDay,
    velocityPerWeek,
    estimatedCompletionDate,
    uid
  ]);

  return (
    <>
      <div id='asana-cards' className='flex'>
        <h2 className='text-xl mt-4 mb-2'>Tasks - Asana</h2>
        <GearIconLink
          mt={5}
          mb={2}
          href='/user-settings'
          alt='Gear icon links to user settings'
        />
      </div>
      <div className='grid gap-3 md:gap-5 grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
        <NumberOfCloseTasks number={numberOfTasksClosed} />
        <NumberOfOpenTasks number={numberOfTasksOpen} />
        <VelocityOfTaskClose
          number={velocityPerWeek.toFixed(1)} // If the first decimal place is 0, it is converted to a string to keep the 0
        />
        <EstimatedDateOfCompletion date={estimatedCompletionDate} />
      </div>
    </>
  );
};

export default CardListForAsana;
