// Libraries
import Head from 'next/head';
import { useEffect, useState } from 'react';
import {
  Chart,
  // CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import 'chartjs-adapter-moment';
import { Line } from 'react-chartjs-2';
import moment from 'moment';

// Components and Others
import {
  GlobalContextObjectType,
  useGlobalContext
} from '../../context/GlobalContextProvider';
import { useAuth } from '../../auth';
import { PullRequestsType, UserType } from '../../config/firebaseTypes';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebaseClient';
import { SearchGitHubWithDetails } from '../../services/githubServices.client';
import ButtonList from '../../components/buttons/ButtonList';
import { UpdInsGitHubPullRequests } from '../../services/setDocToFirestore';
import { getPullRequests } from '../../services/getDocFromFirestore';
import {
  LineChartData,
  LineChartOptions
} from '../../services/chartServices.client';

export default function GitHubCharts() {
  // Global timestamp button context
  const globalState: GlobalContextObjectType = useGlobalContext();
  const currentTimeframe = globalState.currentTimeframe;

  // Set time period from global state
  const oldest = '*';
  const latest = moment().format('YYYY-MM-DD');
  const createdSince =
    currentTimeframe?.timeframe.since?.format('YYYY-MM-DD') || '*';
  const createdUntil =
    currentTimeframe?.timeframe.until?.format('YYYY-MM-DD') || '*';
  const createdSinceUnix = currentTimeframe?.timeframe.since?.valueOf(); // milliseconds
  const createdUntilUnix = currentTimeframe?.timeframe.until?.valueOf(); // milliseconds
  const durationUnix =
    createdUntilUnix && createdSinceUnix && createdUntilUnix - createdSinceUnix;

  // Set sub time period for comparison
  const createdSinceForComp =
    createdSince !== '*'
      ? moment(createdSince)?.subtract(durationUnix, 'ms')?.format('YYYY-MM-DD')
      : '*';
  const createdUntilForComp =
    createdUntil !== '*'
      ? moment(createdUntil)?.subtract(durationUnix, 'ms')?.format('YYYY-MM-DD')
      : '*';
  const createdSinceUnixForComp =
    createdSince !== '*'
      ? moment(createdSince)?.subtract(durationUnix, 'ms').valueOf()
      : undefined; // milliseconds
  const createdUntilUnixForComp =
    createdSince !== '*'
      ? moment(createdUntil)?.subtract(durationUnix, 'ms').valueOf()
      : undefined; // milliseconds

  // @ts-ignore
  const { currentUser } = useAuth();
  const uid = currentUser?.uid;
  const [userDoc, setUserDoc] = useState<UserType>({});
  useEffect(() => {
    if (uid) {
      onSnapshot(doc(db, 'users', uid), (docSnap) => {
        const theUserDoc = docSnap.data() as UserType;
        if (theUserDoc) setUserDoc(theUserDoc);
      });
    }
  }, [uid]);

  // Get Pull Requests data from GitHub and store them in Firestore
  const [isUpdatedForPullRequests, setIsUpdatedForPullRequests] =
    useState(false);
  useEffect(() => {
    if (userDoc?.github?.accessToken)
      SearchGitHubWithDetails({
        searchWhere: 'issues',
        searchQuery: `is:pr repo:${userDoc?.github?.repositories?.[0]?.owner}/${userDoc?.github?.repositories?.[0]?.repo} author:${userDoc?.github?.userName} created:${oldest}..${latest}`,
        accessToken: userDoc?.github?.accessToken
      })
        .then((res: PullRequestsType[]) => {
          UpdInsGitHubPullRequests({
            docId: uid,
            pullRequests: res
          });
        })
        .then(() => setIsUpdatedForPullRequests(true));
  }, [uid, userDoc?.github, latest]);

  // Get Pull Requests data from pullRequests collection from Firestore
  const [pullRequests1, setPullRequests1] = useState<
    { x: number; y: number }[]
  >([]);
  useEffect(() => {
    if (uid)
      getPullRequests(uid).then((res) => {
        // Convert data to {x: number, y: number}[] for main chart
        const pullRequests1 = res
          ? res
              ?.filter(
                (pr) =>
                  pr?.createdAt >= createdSince && pr?.createdAt <= createdUntil
              )
              ?.map((pr, index) => {
                if (pr.createdAt)
                  return {
                    x: moment(pr.createdAt).valueOf(), // Unix timestamp in milliseconds
                    y: index + 1 // Accumulated number of pull requests created by user
                  };
              })
          : [];
        // @ts-ignore
        if (pullRequests1) setPullRequests1(pullRequests1);
      });
  }, [uid, createdSince, createdUntil, isUpdatedForPullRequests]);

  // Get Pull Requests data from pullRequests collection from Firestore
  const [pullRequests2, setPullRequests2] = useState<
    { x: number; y: number }[]
  >([]);
  useEffect(() => {
    if (uid)
      getPullRequests(uid).then((res) => {
        // Convert data to {x: number, y: number}[] for sub chart
        const pullRequests2 =
          res && createdSinceForComp != '*'
            ? res
                ?.filter(
                  (pr) =>
                    pr?.createdAt >= createdSinceForComp &&
                    pr?.createdAt <= createdUntilForComp
                )
                ?.map((pr, index) => {
                  if (pr.createdAt)
                    return {
                      x: moment(pr.createdAt).valueOf(),
                      y: index + 1
                    };
                })
            : [];
        // @ts-ignore
        if (pullRequests2) setPullRequests2(pullRequests2);
      });
  }, [uid, createdSinceForComp, createdUntilForComp, isUpdatedForPullRequests]);

  // Aggregate "Lead time since last pull request created" data from pullRequests collection from Firestore
  const [leadTime1, setLeadTime1] = useState<{ x: number; y: number }[]>([]);
  useEffect(() => {
    if (uid)
      getPullRequests(uid).then((res) => {
        // Convert data to {x: number, y: number}[]
        const leadTime1 = res
          ? res
              ?.filter(
                (pr) =>
                  pr?.createdAt >= createdSince && pr?.createdAt <= createdUntil
              )
              ?.map((pr) => {
                if (pr.createdAt && pr.movingAverageLeadTimeSinceLastPR)
                  return {
                    x: moment(pr.createdAt).valueOf(), // Unix timestamp in milliseconds
                    y: Math.round(
                      pr.movingAverageLeadTimeSinceLastPR / 1000 / 3600
                    ) // Moving average lead time in hours
                  };
              })
              .filter((pr) => pr !== undefined)
          : [];
        // @ts-ignore
        if (leadTime1) setLeadTime1(leadTime1);
      });
  }, [uid, createdSince, createdUntil, isUpdatedForPullRequests]);

  const [leadTime2, setLeadTime2] = useState<{ x: number; y: number }[]>([]);
  useEffect(() => {
    if (uid)
      getPullRequests(uid).then((res) => {
        // Convert data to {x: number, y: number}[]
        const leadTime2 =
          res && createdSinceForComp != '*'
            ? res
                ?.filter(
                  (pr) =>
                    pr?.createdAt >= createdSinceForComp &&
                    pr?.createdAt <= createdUntilForComp
                )
                ?.map((pr) => {
                  if (pr.createdAt && pr.movingAverageLeadTimeSinceLastPR)
                    return {
                      x: moment(pr.createdAt).valueOf(), // Unix timestamp in milliseconds
                      y: Math.round(
                        pr.movingAverageLeadTimeSinceLastPR / 1000 / 3600
                      ) // Moving average lead time in hours
                    };
                })
                .filter((pr) => pr !== undefined)
            : [];
        // @ts-ignore
        if (leadTime2) setLeadTime2(leadTime2);
      });
  }, [uid, createdSinceForComp, createdUntilForComp, isUpdatedForPullRequests]);

  const content =
    'Chart GitHub-related numbers. These include the number of commits, pull requests, reviews, lines of code added, lines of code deleted, etc.';

  // Dataset for line chart. https://www.chartjs.org/docs/latest/charts/line.html
  const dataset1_1 = LineChartData({
    label: 'Current period',
    data: pullRequests1,
    xAxisID: 'x1',
    // contrast color of dataset1_2
    backgroundColor: 'rgba(255, 99, 132, 0.2)',
    borderColor: 'rgba(255, 99, 132, 1)',
    pointBorderColor: 'rgba(255, 99, 132, 1)',
    pointHoverBackgroundColor: 'rgba(255, 99, 132, 1)'
  });
  const dataset1_2 = LineChartData({
    label: 'Previous one',
    data: pullRequests2,
    xAxisID: 'x2',
    backgroundColor: 'rgba(192, 75, 75, 0.4)',
    borderColor: 'rgba(192, 75, 75, 1)',
    pointBorderColor: 'rgba(192, 75, 75, 1)',
    pointHoverBackgroundColor: 'rgba(192, 75, 75, 1)',
    borderDash: [5, 5]
  });
  const dataset2_1 = LineChartData({
    label: 'Current period',
    data: leadTime1,
    xAxisID: 'x1',
    backgroundColor: 'rgba(255, 159, 64, 0.4)',
    borderColor: 'rgba(255, 159, 64, 1)',
    pointBorderColor: 'rgba(255, 159, 64, 1)',
    pointHoverBackgroundColor: 'rgba(255, 159, 64, 1)'
  });
  const dataset2_2 = LineChartData({
    label: 'Previous one',
    data: leadTime2,
    xAxisID: 'x2',
    backgroundColor: 'rgba(255, 206, 86, 0.4)',
    borderColor: 'rgba(255, 206, 86, 1)',
    pointBorderColor: 'rgba(255, 206, 86, 1)',
    pointHoverBackgroundColor: 'rgba(255, 206, 86, 1)',
    borderDash: [5, 5]
  });
  const data1 = {
    // labels: [], // Labels for the x-axis
    datasets: createdSince !== oldest ? [dataset1_1, dataset1_2] : [dataset1_1] // Datasets for the y-axis
  };
  const data2 = {
    // labels: [], // Labels for the x-axis
    datasets: createdSince !== oldest ? [dataset2_1, dataset2_2] : [dataset2_1] // Datasets for the y-axis
  };

  // Options for line chart
  const options1 = LineChartOptions({
    chartTitle: 'Pull Requests from GitHub',
    y1Title: 'Total PRs (#)',
    x1SuggestedMin: createdSinceUnix || pullRequests1[0]?.x,
    x1SuggestedMax: createdUntilUnix,
    x2SuggestedMin: createdSinceUnixForComp || pullRequests2[0]?.x,
    x2SuggestedMax: createdUntilUnixForComp
  });
  const options2 = LineChartOptions({
    chartTitle: 'Moving Average of Lead Time',
    y1Title: 'Lead Time (hours)',
    x1SuggestedMin: createdSinceUnix || leadTime1[0]?.x,
    x1SuggestedMax: createdUntilUnix,
    x2SuggestedMin: createdSinceUnixForComp || leadTime2[0]?.x,
    x2SuggestedMax: createdUntilUnixForComp
  });

  // Register the chart plugins
  Chart.register(
    // CategoryScale,
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  return (
    <>
      <Head>
        <title>Charts for GitHub - WorkStats</title>
        <meta name='description' content={content} />
      </Head>
      <main className='flex'>
        <div className='w-5 md:w-10'></div>
        <div>
          <div id='time-periods'>
            <ButtonList />
          </div>
          <h2 className='text-xl mt-2 md:mt-4 md:mb-2 px-5 md:px-0'>
            GitHub charts
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 md:gap-4 place-items-center md:place-items-stretch'>
            <div className='h-92 w-11/12 md:h-108 md:w-auto'>
              {/* @ts-ignore */}
              <Line options={options1} data={data1} />
            </div>
            <div className='h-92 w-11/12 md:h-108 md:w-auto'>
              {/* @ts-ignore */}
              <Line options={options2} data={data2} />
            </div>
          </div>
          <div className='md:grid md:grid-cols-2 md:gap-4'>
            <div className='hidden md:block'></div>
            <div className='px-5'>
              *Moving Average of LT: Moving average over the last 10 pull
              requests of the lead time (hours) between the creation date of a
              pull request and the previous one.
            </div>
          </div>
          <h2 className='text-xl mt-2 md:mt-4 md:mb-2 px-5 md:px-0'>
            How to Read Charts
          </h2>
          <p className='py-1 px-5 md:px-0'>
            To begin with, in reviewing the work of you and your team, it is
            important to look at a balance of both qualitative and quantitative
            aspects. Neither is perfect. But there is no doubt that you can
            evolve your operations more scientifically than ever before if you
            use numbers effectively.
          </p>
          <ol
            className='py-1 px-5 pl-7 md:ml-3 md:pl-1 list-decimal list-inside'
            role='list'
          >
            <li key={1} className='pb-1'>
              For example, if the total # of pull requests is rising steadily
              and the lead time between pull requests is falling steadily, it
              would be great!
            </li>
            <li key={2} className='pt-1'>
              Or, for example, if the lead time between pull requests is less
              than 168 hours, you make one pull request per week. If the lead
              time between pull requests is less than 24 hours, then you make
              one pull request per day. Depends on what the pull request is, but
              it&apos;s fast!
            </li>
          </ol>
          <p className='py-1 px-5 md:px-0'>
            The important thing is that do not try to immediately judge or
            determine something with these numbers. We hope these numbers will
            be helpful and supportive in your discussions.
          </p>
          <div className='h-20'></div>
        </div>
        <div className='w-5 md:w-10'></div>
      </main>
    </>
  );
}

GitHubCharts.requiresAuth = true;
