// import React and Next.js related
import { useEffect, useState } from 'react';

// import components
import NumberOfMentioned from './NumberOfMentioned';
import NumberOfNewSent from './NumberOfNewSent';
import NumberOfReplies from './NumberOfReplies';

// import configs and contexts
import { NumbersType } from '../../config/firebaseTypes';
import {
  GlobalContextObjectType,
  useGlobalContext
} from '../../context/GlobalContextProvider';

// import services
import GearIconLink from '../common/GearIcon';
import { useSlackSearch } from '../../services/slackServices.client';
import { UpdInsSlackNumbers } from '../../services/setDocToFirestore';
import moment from 'moment';

interface PropTypes {
  numbersDoc: NumbersType;
  slackAccessToken: string;
  slackMemberId: string;
  uid: string;
}

const CardListForSlack = ({
  numbersDoc,
  slackAccessToken,
  slackMemberId,
  uid
}: PropTypes) => {
  // Global timestamp button context
  const globalState: GlobalContextObjectType = useGlobalContext();
  const currentTimeframe = globalState.currentTimeframe;

  // Initialize state
  const [numberOfMentioned, setNumberOfMentioned] = useState(
    numbersDoc?.slack?.numberOfMentioned?.allPeriods || 0
  );
  const [numberOfTotalSent, setNumberOfTotalSent] = useState(
    numbersDoc?.slack?.numberOfTotalSent?.allPeriods || 0
  );
  const [numberOfNewSent, setNumberOfNewSent] = useState(
    numbersDoc?.slack?.numberOfNewSent?.allPeriods || 0
  );
  const [numberOfReplies, setNumberOfReplies] = useState(
    numbersDoc?.slack?.numberOfReplies?.allPeriods || 0
  );

  // Set time period from global state
  const since =
    currentTimeframe?.timeframe.since?.format('YYYY-MM-DD') || '2000-01-01';
  const preUntil =
    currentTimeframe?.timeframe.until?.format('YYYY-MM-DD') ||
    moment().format('YYYY-MM-DD');
  // If it is Sunday, this week set a same date to since and until, then it does not work properly in Slack API due to its specification.
  const until =
    preUntil === since
      ? moment(preUntil).add(1, 'days').format('YYYY-MM-DD')
      : preUntil;

  // Aggregate numbers from slack
  const numberOfTotalSentCalc = useSlackSearch({
    slackMemberId,
    slackAccessToken,
    searchMode: 'sent',
    since,
    until
  });
  const numberOfMentionedCalc = useSlackSearch({
    slackMemberId,
    slackAccessToken,
    searchMode: 'mentioned',
    since,
    until
  });
  const numberOfRepliesCalc = useSlackSearch({
    slackMemberId,
    slackAccessToken,
    searchMode: 'replies',
    since,
    until
  });

  // Update numbers in local state
  useEffect(() => {
    setNumberOfMentioned(numberOfMentionedCalc);
    setNumberOfTotalSent(numberOfTotalSentCalc);
    setNumberOfReplies(numberOfRepliesCalc);
    setNumberOfNewSent(numberOfTotalSentCalc - numberOfRepliesCalc);
  }, [numberOfMentionedCalc, numberOfRepliesCalc, numberOfTotalSentCalc]);

  // Update numbers in Firestore
  useEffect(() => {
    UpdInsSlackNumbers({
      docId: uid,
      numberOfMentionedAllPeriods: numberOfMentioned,
      numberOfTotalSentAllPeriods: numberOfTotalSent,
      numberOfNewSentAllPeriods: numberOfNewSent,
      numberOfRepliesAllPeriods: numberOfReplies
    });
  }, [
    numberOfMentioned,
    numberOfTotalSent,
    numberOfNewSent,
    numberOfReplies,
    uid
  ]);

  return (
    <>
      <div id='slack-cards' className='flex'>
        <h2 className='text-xl mt-4 mb-2'>Communication - Slack</h2>
        <GearIconLink
          mt={5}
          mb={2}
          href='/user-settings#slack'
          alt='Gear icon links to user settings'
        />
      </div>
      <div className='grid gap-3 md:gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-4 md:mr-5'>
        <NumberOfMentioned data={numberOfMentioned} />
        <NumberOfReplies data={numberOfReplies} />
        <NumberOfNewSent data={numberOfNewSent} />
      </div>
    </>
  );
};

export default CardListForSlack;
