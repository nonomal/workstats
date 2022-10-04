// import libraries
import { useEffect, useState } from 'react';
import moment from 'moment';

// import components
import NumberOfCommits from './NumberOfCommits';
import NumberOfLinesAdded from './NumberOfLinesAdded';
import NumberOfLinesDeleted from './NumberOfLinesDeleted';
import NumberOfPullRequests from './NumberOfPullRequests';
import NumberOfReviews from './NumberOfReview';

// import configs and contexts
import { NumbersType } from '../../config/firebaseTypes';
import {
  GlobalContextObjectType,
  useGlobalContext
} from '../../context/GlobalContextProvider';

// import services
import GearIconLink from '../common/GearIcon';
import {
  GetNumberOfLinesOfCode,
  useGitHubSearch
} from '../../services/githubServices.client';
import { UpdInsGithubNumbers } from '../../services/setDocToFirestore';

interface PropTypes {
  githubOwnerName: string;
  githubRepoName: string;
  githubUserId: number;
  githubUserName: string;
  githubAccessToken: string;
  numbersDoc: NumbersType;
  uid: string;
}

const CardListForGithub = ({
  githubOwnerName,
  githubRepoName,
  githubUserId,
  githubUserName,
  githubAccessToken,
  numbersDoc,
  uid
}: PropTypes) => {
  // Global timestamp button context
  const globalState: GlobalContextObjectType = useGlobalContext();
  const currentTimeframe = globalState.currentTimeframe;

  // Initialize GitHub numbers
  const [numberOfCommits, setNumberOfCommits] = useState(
    numbersDoc?.github?.numberOfCommits?.allPeriods || 0
  );
  const [numberOfPullRequests, setNumberOfPullRequests] = useState(
    numbersDoc?.github?.numberOfPullRequests?.allPeriods || 0
  );
  const [numberOfReviews, setNumberOfReviews] = useState(
    numbersDoc?.github?.numberOfReviews?.allPeriods || 0
  );
  const [numberOfLinesAdded, setNumberOfLinesAdded] = useState(
    numbersDoc?.github?.numberOfLinesAdded?.allPeriods || 0
  );
  const [numberOfLinesDeleted, setNumberOfLinesDeleted] = useState(
    numbersDoc?.github?.numberOfLinesDeleted?.allPeriods || 0
  );

  // Set time period from global state
  const createdSince =
    currentTimeframe?.timeframe.since?.format('YYYY-MM-DD') || '*';
  const createdUntil =
    currentTimeframe?.timeframe.until?.format('YYYY-MM-DD') || '*';
  const createdSinceTimestamp = currentTimeframe?.timeframe.since?.toISOString()
    ? Date.parse(currentTimeframe?.timeframe.since?.toISOString())
    : 0; // milliseconds from ISO 8601
  const createdUntilTimestamp = currentTimeframe?.timeframe.until?.toISOString()
    ? Date.parse(currentTimeframe?.timeframe.until?.toISOString())
    : Date.parse(moment().toISOString()); // milliseconds from ISO 8601

  // Aggregate GitHub numbers
  // searchQuery comes from https://docs.github.com/en/search-github/searching-on-github/searching-commits#search-within-commit-messages
  const numberOfCommitsCalc = useGitHubSearch({
    searchWhere: 'commits',
    searchQuery: `repo:${githubOwnerName}/${githubRepoName} author:${githubUserName} author-date:${createdSince}..${createdUntil}`,
    accessToken: githubAccessToken
  });

  // searchQuery comes from https://docs.github.com/en/search-github/searching-on-github/searching-issues-and-pull-requests
  const numberOfPullRequestsCalc = useGitHubSearch({
    searchWhere: 'issues',
    searchQuery: `is:pr repo:${githubOwnerName}/${githubRepoName} author:${githubUserName} created:${createdSince}..${createdUntil}`,
    accessToken: githubAccessToken
  });

  // searchQuery comes from https://docs.github.com/en/search-github/searching-on-github/searching-issues-and-pull-requests
  const numberOfReviewsCalc = useGitHubSearch({
    searchWhere: 'issues',
    searchQuery: `is:pr repo:${githubOwnerName}/${githubRepoName} reviewed-by:${githubUserName} created:${createdSince}..${createdUntil}`,
    accessToken: githubAccessToken
  });

  useEffect(() => {
    (async () => {
      const { numberOfLinesAddedCalc, numberOfLinesDeletedCalc } =
        await GetNumberOfLinesOfCode({
          owner: githubOwnerName,
          repo: githubRepoName,
          githubUserId,
          createdSince: createdSinceTimestamp,
          createdUntil: createdUntilTimestamp,
          accessToken: githubAccessToken
        });
      setNumberOfLinesAdded(numberOfLinesAddedCalc);
      setNumberOfLinesDeleted(numberOfLinesDeletedCalc);
    })();
  }, [
    githubOwnerName,
    githubRepoName,
    githubUserId,
    githubAccessToken,
    createdSinceTimestamp,
    createdUntilTimestamp
  ]);

  // Update numbers in local state
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
      numberOfReviewsAllPeriods: numberOfReviews,
      numberOfLinesAddedAllPeriods: numberOfLinesAdded,
      numberOfLinesDeletedAllPeriods: numberOfLinesDeleted
    });
  }, [
    numberOfCommits,
    numberOfLinesAdded,
    numberOfLinesDeleted,
    numberOfPullRequests,
    numberOfReviews,
    uid
  ]);

  return (
    <>
      <div id='github-cards' className='flex'>
        <h2 className='text-xl mt-4 mb-2'>Coding - GitHub</h2>
        <GearIconLink
          mt={5}
          mb={2}
          href='/user-settings#github'
          alt='Gear icon links to user settings'
          id='gear-icon'
        />
      </div>
      <div className='grid gap-3 md:gap-5 grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
        <NumberOfCommits data={numberOfCommits} />
        <NumberOfPullRequests data={numberOfPullRequests} />
        <NumberOfReviews data={numberOfReviews} />
        <NumberOfLinesAdded data={numberOfLinesAdded} />
        <NumberOfLinesDeleted data={numberOfLinesDeleted} />
      </div>
    </>
  );
};

export default CardListForGithub;
