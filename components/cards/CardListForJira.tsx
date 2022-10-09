// import libraries
import { useEffect, useState } from 'react';
import moment from 'moment';

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
import {
  refreshAccessToken,
  searchIssues
} from '../../services/atlassianServices.client';
import {
  updateAtlassianTokens,
  UpdInsJiraNumbers
} from '../../services/setDocToFirestore';

// Main component
interface PropTypes {
  organizationId: string;
  // accountId: string;
  accessToken: string;
  refreshToken: string;
  numbersDoc: NumbersType;
  uid: string;
}

const CardListForJira = ({
  organizationId,
  // accountId,
  accessToken,
  refreshToken,
  numbersDoc,
  uid
}: PropTypes) => {
  // Global timestamp button context
  const globalState: GlobalContextObjectType = useGlobalContext();
  const currentTimeframe = globalState.currentTimeframe;

  // Initialize GitHub numbers
  const [numberOfIssues, setNumberOfIssues] = useState(
    numbersDoc?.jira?.numberOfIssues?.allPeriods || 0
  );
  const [numberOfIssuesClosed, setNumberOfIssuesClosed] = useState(
    numbersDoc?.jira?.numberOfIssuesClosed?.allPeriods || 0
  );
  const [numberOfIssuesOpen, setNumberOfIssuesOpen] = useState(
    numbersDoc?.jira?.numberOfIssuesOpen?.allPeriods || 0
  );
  const [velocityPerBizDay, setVelocityPerBizDay] = useState(
    numbersDoc?.jira?.velocityPerBizDay?.allPeriods || 0
  );
  const [velocityPerWeek, setVelocityPerWeek] = useState(
    numbersDoc?.jira?.velocityPerWeek?.allPeriods || 0
  );
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState(
    numbersDoc?.jira?.estimatedCompletionDate?.allPeriods || '--'
  );
  const [atlassianAccessToken, setAtlassianAccessToken] = useState(accessToken);
  const [atlassianRefreshToken, setAtlassianRefreshToken] =
    useState(refreshToken);

  // Set time period from global state
  const since =
    currentTimeframe?.timeframe.since?.format('YYYY-MM-DD') ||
    moment().subtract(5, 'years').format('YYYY-MM-DD');
  const until =
    currentTimeframe?.timeframe.until?.format('YYYY-MM-DD') ||
    moment().add(1, 'days').format('YYYY-MM-DD');

  // Aggregate Atlassian numbers and update numbers in local state
  useEffect(() => {
    // Aggregate number of issues
    const jqlForNumberOfIssues = 'assignee = currentUser()';
    searchIssues({
      atlassianAccessToken,
      atlassianCloudId: organizationId,
      startAt: 0,
      maxResults: 1,
      jql: jqlForNumberOfIssues
    }).then(async (res) => {
      // If res.code is 401, the access token is expired, so refresh it
      if (res?.code === 401) {
        // Refresh the access token
        const newToken = await refreshAccessToken(atlassianRefreshToken);
        const newAccessToken = newToken.access_token;
        const newRefreshToken = newToken.refresh_token;

        // Update the access token and refresh token in the database and cache.
        // This is done in the background, so it doesn't need to be awaited.
        if (uid && newAccessToken && newRefreshToken) {
          updateAtlassianTokens(uid, newAccessToken, newRefreshToken);
          setAtlassianAccessToken(newAccessToken);
          setAtlassianRefreshToken(newRefreshToken);
        }
      }

      // Otherwise, update the number of issues
      if (res?.total >= 0) setNumberOfIssues(res.total);
    });

    // Aggregate number of issues closed
    const jqlForNumberOfIssuesClosed = `assignee = currentUser() AND status CHANGED TO 10006 DURING (${since}, ${until}) AND status was 10006 ON ${until}`; // 10006 is the ID of the "Done" status in Jira. Done was not available in this query, so I used its ID.
    searchIssues({
      atlassianAccessToken,
      atlassianCloudId: organizationId,
      startAt: 0,
      maxResults: 1,
      jql: jqlForNumberOfIssuesClosed
    }).then((res) => {
      if (res?.total >= 0) setNumberOfIssuesClosed(res.total);
    });

    // Aggregate number of issues open as of now
    const jqlForNumberOfIssuesOpen =
      'assignee = currentUser() AND status != DONE AND resolution = Unresolved';
    searchIssues({
      atlassianAccessToken,
      atlassianCloudId: organizationId,
      startAt: 0,
      maxResults: 1,
      jql: jqlForNumberOfIssuesOpen
    }).then((res) => {
      if (res?.total >= 0) setNumberOfIssuesOpen(res.total);
    });
  }, [
    atlassianAccessToken,
    atlassianRefreshToken,
    organizationId,
    since,
    until,
    uid
  ]);

  // Aggregate velocity of issues closed
  useEffect(() => {
    // Get the earliest created date of issues from all issues
    const jqlForEarliestCreatedDate =
      'assignee = currentUser() ORDER BY created ASC';
    searchIssues({
      atlassianAccessToken,
      atlassianCloudId: organizationId,
      startAt: 0,
      maxResults: 1,
      jql: jqlForEarliestCreatedDate
    }).then((res) => {
      // Specify the earliest created date and aggregate the duration of the period
      const earliestCreatedDate = res?.issues?.[0]?.fields.created; // YYYY-MM-DDTHH:mm:ss.SSSZ
      const earliestCreatedDateFormatted =
        moment(earliestCreatedDate).format('YYYY-MM-DD');
      const startDate =
        earliestCreatedDateFormatted < since
          ? since
          : earliestCreatedDateFormatted;
      const durationDays =
        moment(until).diff(startDate, 'days', true) > 0
          ? moment(until).diff(startDate, 'days', true)
          : 0; // true: floating point

      // Aggregate velocity of issues closed per business day
      const velocityPerDay =
        Math.round((numberOfIssuesClosed / durationDays) * 10) / 10
          ? Math.round((numberOfIssuesClosed / durationDays) * 10) / 10
          : 0;
      const velocityPerBizDay =
        Math.round((numberOfIssuesClosed / durationDays / (5 / 7)) * 10) / 10
          ? Math.round((numberOfIssuesClosed / durationDays / (5 / 7)) * 10) /
            10
          : 0;
      const velocityPerWeek =
        Math.round((numberOfIssuesClosed / durationDays) * 7 * 10) / 10
          ? Math.round((numberOfIssuesClosed / durationDays) * 7 * 10) / 10
          : 0;

      // Aggregate estimated completion date
      const remainingDays = Math.round(numberOfIssuesOpen / velocityPerDay)
        ? Math.round(numberOfIssuesOpen / velocityPerDay)
        : 0;
      const estimatedCompletionDate =
        moment().add(remainingDays, 'days').format('ll') ===
        'undefined NaN, -0NaN'
          ? '---'
          : moment().add(remainingDays, 'days').format('ll');
      if (velocityPerBizDay !== Infinity)
        setVelocityPerBizDay(velocityPerBizDay);
      if (velocityPerWeek !== Infinity) setVelocityPerWeek(velocityPerWeek);
      setEstimatedCompletionDate(estimatedCompletionDate);
    });
  }, [
    atlassianAccessToken,
    organizationId,
    since,
    until,
    numberOfIssuesClosed,
    numberOfIssuesOpen
  ]);

  // Store Atlassian numbers in Firestore without awaiting
  useEffect(() => {
    UpdInsJiraNumbers({
      docId: uid,
      numberOfIssuesAllPeriods: numberOfIssues,
      numberOfIssuesClosedAllPeriods: numberOfIssuesClosed,
      numberOfIssuesOpenAllPeriods: numberOfIssuesOpen,
      velocityPerBizDayAllPeriods: velocityPerBizDay,
      velocityPerWeekAllPeriods: velocityPerWeek,
      estimatedCompletionDateAllPeriods: estimatedCompletionDate
    });
  }, [
    numberOfIssues,
    numberOfIssuesClosed,
    numberOfIssuesOpen,
    velocityPerBizDay,
    velocityPerWeek,
    estimatedCompletionDate,
    uid
  ]);

  return (
    <>
      <div id='atlassian-cards' className='flex'>
        <h2 className='text-xl mt-4 mb-2'>Issues - Jira</h2>
        <GearIconLink
          mt={5}
          mb={2}
          href='/user-settings#jira'
          alt='Gear icon links to user settings'
        />
      </div>
      <div className='grid gap-3 md:gap-5 grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
        <NumberOfCloseTasks
          label='# of closed issues'
          unit='issues'
          number={numberOfIssuesClosed}
        />
        <NumberOfOpenTasks
          label='# of open issues'
          unit='issues'
          number={numberOfIssuesOpen}
        />
        <VelocityOfTaskClose
          unit='issues/wk'
          number={velocityPerWeek.toFixed(1)} // If the first decimal place is 0, it is converted to a string to keep the 0
        />
        <EstimatedDateOfCompletion date={estimatedCompletionDate} />
      </div>
    </>
  );
};

export default CardListForJira;
