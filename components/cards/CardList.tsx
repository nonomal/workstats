// import React and Next.js related
import { useEffect, useState } from 'react';

// import card components
import NumberOfCommits from './NumberOfCommits';
import NumberOfCloseTasks from './NumberOfCloseTasks';
import NumberOfMeetings from './NumberOfMtgs';
import NumberOfMentioned from './NumberOfMentioned';
import NumberOfNewSent from './NumberOfNewSent';
import NumberOfOpenTasks from './NumberOfOpenTasks';
import NumberOfPullRequests from './NumberOfPullRequests';
import NumberOfReplies from './NumberOfReplies';
import NumberOfReviews from './NumberOfReview';
import VelocityOfTaskClose from './VelocityOfTaskClose';
// import TotalTimeOfMeetings from './TotalTimeOfMtgs';

// import services
import GearIconLink from '../common/GearIcon';
import {
  useNumberOfCommits,
  useNumberOfPullRequests,
  useNumberOfReviews
} from '../../services/githubServices.client';
import { useNumberOfTasks } from '../../services/asanaServices.client';
import EstimatedDateOfCompletion from './EstimatedDateOfTaskEnd';
import {
  useSlackSearch,
  useSlackChannelList,
  getSlackNumberOfNewSent
} from '../../services/slackServices.client';
import {
  UpdInsAsanaNumbers,
  UpdInsGithubNumbers,
  UpdInsGoogleCalendarNumbers,
  UpdInsSlackNumbers
} from '../../services/setDocToFirestore';
import { NumbersType } from '../../config/firebaseTypes';
import { useNumberOfEvents } from '../../services/googleCalendar.client';

interface PropTypes {
  asanaWorkspaceId: string;
  asanaUserId: string;
  asanaOAuthAccessToken: string;
  asanaRefreshToken: string;
  githubOwnerName: string;
  githubRepoName: string;
  githubUserId: number;
  githubUserName: string;
  githubAccessToken: string;
  googleOAuthAccessToken: string;
  googleRefreshToken: string;
  numbersDoc: NumbersType;
  slackAccessToken: string;
  slackMemberId: string;
  uid: string;
}

const CardList = ({
  asanaWorkspaceId,
  asanaUserId,
  asanaOAuthAccessToken,
  asanaRefreshToken,
  githubOwnerName,
  githubRepoName,
  githubUserId,
  githubUserName,
  githubAccessToken,
  googleOAuthAccessToken,
  googleRefreshToken,
  numbersDoc,
  slackAccessToken,
  slackMemberId,
  uid
}: PropTypes) => {
  const [numberOfCommits, setNumberOfCommits] = useState(
    numbersDoc?.github?.numberOfCommits.allPeriods || 0
  );
  const [numberOfPullRequests, setNumberOfPullRequests] = useState(
    numbersDoc?.github?.numberOfPullRequests.allPeriods || 0
  );
  const [numberOfReviews, setNumberOfReviews] = useState(
    numbersDoc?.github?.numberOfReviews.allPeriods || 0
  );
  const numberOfCommitsCalc = useNumberOfCommits(
    githubOwnerName,
    githubRepoName,
    githubUserId,
    githubAccessToken
  );
  const numberOfPullRequestsCalc = useNumberOfPullRequests({
    owner: githubOwnerName,
    repo: githubRepoName,
    githubUserId,
    accessToken: githubAccessToken
  });
  const numberOfReviewsCalc = useNumberOfReviews(
    githubOwnerName,
    githubRepoName,
    githubUserName,
    githubAccessToken
  );
  useEffect(() => {
    setNumberOfCommits(numberOfCommitsCalc);
    setNumberOfPullRequests(numberOfPullRequestsCalc);
    setNumberOfReviews(numberOfReviewsCalc);
  }, [numberOfCommitsCalc, numberOfPullRequestsCalc, numberOfReviewsCalc]);
  // Store GitHub numbers in Firestore without awaiting
  useEffect(() => {
    UpdInsGithubNumbers({
      docId: uid,
      numberOfCommitsAllPeriods: numberOfCommits,
      numberOfPullRequestsAllPeriods: numberOfPullRequests,
      numberOfReviewsAllPeriods: numberOfReviews
    });
  }, [numberOfCommits, numberOfPullRequests, numberOfReviews, uid]);

  // Aggregate numbers from Asana
  const [numberOfTasks, setNumberOfTasks] = useState(
    numbersDoc?.asana?.numberOfTasks.allPeriods || 0
  );
  const [numberOfTasksClosed, setNumberOfTasksClosed] = useState(
    numbersDoc?.asana?.numberOfTasksClosed.allPeriods || 0
  );
  const [numberOfTasksOpen, setNumberOfTasksOpen] = useState(
    numbersDoc?.asana?.numberOfTasksOpen.allPeriods || 0
  );
  const [velocityPerDay, setVelocityPerDay] = useState(
    numbersDoc?.asana?.velocityPerDay.allPeriods || 0
  );
  const [velocityPerWeek, setVelocityPerWeek] = useState(
    numbersDoc?.asana?.velocityPerWeek.allPeriods || 0
  );
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState(
    numbersDoc?.asana?.estimatedCompletionDate.allPeriods || '--'
  );
  const [asanaAccessToken, setAsanaAccessToken] = useState(
    asanaOAuthAccessToken
  );
  const numberOfTasksCalc = useNumberOfTasks(
    asanaAccessToken,
    asanaWorkspaceId,
    asanaUserId,
    asanaRefreshToken,
    uid
  );
  useEffect(() => {
    setNumberOfTasks(numberOfTasksCalc.numberOfAll);
    setNumberOfTasksClosed(numberOfTasksCalc.numberOfClosed);
    setNumberOfTasksOpen(numberOfTasksCalc.numberOfOpened);
    setVelocityPerDay(numberOfTasksCalc.velocityPerDays);
    setVelocityPerWeek(numberOfTasksCalc.velocityPerWeeks);
    setEstimatedCompletionDate(numberOfTasksCalc.estimatedCompletionDate);
    setAsanaAccessToken(numberOfTasksCalc.asanaAccessToken);
  }, [numberOfTasksCalc]);
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

  // Aggregate numbers from Slack
  const [numberOfMentioned, setNumberOfMentioned] = useState(
    numbersDoc?.slack?.numberOfMentioned.allPeriods || 0
  );
  const [numberOfTotalSent, setNumberOfTotalSent] = useState(
    numbersDoc?.slack?.numberOfTotalSent.allPeriods || 0
  );
  const numberOfTotalSentCalc = useSlackSearch({
    slackMemberId,
    slackAccessToken,
    searchMode: 'sent'
  });
  const numberOfMentionedCalc = useSlackSearch({
    slackMemberId,
    slackAccessToken,
    searchMode: 'mentioned'
  });
  useEffect(() => {
    setNumberOfMentioned(numberOfMentionedCalc);
    setNumberOfTotalSent(numberOfTotalSentCalc);
  }, [numberOfMentionedCalc, numberOfTotalSentCalc]);
  const slackChannelList = useSlackChannelList({ slackAccessToken });
  const [numberOfNewSent, setNumberOfNewSent] = useState(
    numbersDoc?.slack?.numberOfNewSent.allPeriods || 0
  );
  const [numberOfReplies, setNumberOfReplies] = useState(
    numbersDoc?.slack?.numberOfReplies.allPeriods || 0
  );
  useEffect(() => {
    // Since this is an unnamed asynchronous function, it is enclosed in parentheses for immediate execution upon declaration
    (async () => {
      // Throwing the return value of getSlackNumberOfNewSent into an array of numberOfNewSentPromises without intentionally resolving the promise.
      const numberOfNewSentPromises: Promise<number>[] = [];
      const nowDate = new Date();
      const nowUnixtime = nowDate.valueOf() / 1000; // seconds
      for (const i in slackChannelList) {
        numberOfNewSentPromises.push(
          getSlackNumberOfNewSent({
            channelId: slackChannelList[i],
            latest: nowUnixtime,
            oldest: 0,
            slackMemberId,
            slackAccessToken
          })
        );
      }
      // Wait for all the promises in the numberOfNewSentPromises array to be resolved, then add them all together.
      const numberOfNewSentCalc = (
        await Promise.all(numberOfNewSentPromises)
      ).reduce((acc, curr) => {
        return acc + curr;
      }, 0);
      setNumberOfNewSent(numberOfNewSentCalc);
      if (numberOfTotalSentCalc && numberOfNewSentCalc) {
        setNumberOfReplies(numberOfTotalSentCalc - numberOfNewSentCalc);
      }
    })();
  }, [
    slackMemberId,
    slackAccessToken,
    slackChannelList,
    numberOfNewSent,
    numberOfTotalSentCalc
  ]);
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

  // Aggregate numbers from Google Calendar
  const [numberOfEvents, setNumberOfEvents] = useState(
    numbersDoc?.googleCalendar?.numberOfEvents.allPeriods || 0
  );
  const [TotalTimeOfEvents, setTotalTimeOfEvents] = useState(
    numbersDoc?.googleCalendar?.totalTimeOfEvents.allPeriods || 0
  );
  const [googleAccessToken, setGoogleAccessToken] = useState(
    googleOAuthAccessToken
  );
  const today = new Date();
  // Two years ago
  const timeMax = today.toISOString();
  const timeMin = new Date(
    today.setFullYear(today.getFullYear() - 2)
  ).toISOString();
  useNumberOfEvents(
    googleAccessToken,
    timeMin,
    timeMax,
    googleRefreshToken,
    uid
  ).then((output) => {
    setNumberOfEvents(output.numberOfEvents);
    setTotalTimeOfEvents(output.totalTimeOfEvents);
    setGoogleAccessToken(output.googleAccessToken);
  });
  useEffect(() => {
    UpdInsGoogleCalendarNumbers({
      docId: uid,
      numberOfEventsAllPeriods: numberOfEvents,
      totalTimeOfEventsAllPeriods: TotalTimeOfEvents
    });
  }, [numberOfEvents, TotalTimeOfEvents, uid]);

  return (
    <>
      <div className='container max-w-6xl px-5 my-1 md:my-1'>
        <div className='flex'>
          <h2 className='text-xl mt-4 mb-2'>Coding - GitHub</h2>
          <GearIconLink
            mt={5}
            mb={2}
            href='/user-settings'
            alt='Gear icon links to user settings'
          />
        </div>
        <div className='grid gap-3 md:gap-5 grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
          <NumberOfCommits data={numberOfCommits} />
          <NumberOfPullRequests data={numberOfPullRequests} />
          <NumberOfReviews data={numberOfReviews} />
        </div>
        <div className='flex'>
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
        <div className='flex'>
          <h2 className='text-xl mt-4 mb-2'>
            Communication - Slack & Google Calendar
          </h2>
          <GearIconLink
            mt={5}
            mb={2}
            href='/user-settings'
            alt='Gear icon links to user settings'
          />
        </div>
        <div className='grid gap-3 md:gap-5 grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
          <NumberOfMentioned data={numberOfMentioned} />
          <NumberOfReplies data={numberOfReplies} />
          <NumberOfNewSent data={numberOfNewSent} />
          <NumberOfMeetings data={numberOfEvents} />
          {/* <TotalTimeOfMeetings data={TotalTimeOfEvents} /> */}
        </div>
      </div>
    </>
  );
};

export default CardList;
