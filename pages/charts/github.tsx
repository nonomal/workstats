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
  const createdSinceUnix = currentTimeframe?.timeframe.since?.valueOf();
  const createdUntilUnix = currentTimeframe?.timeframe.until?.valueOf();

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
  useEffect(() => {
    if (userDoc?.github?.accessToken)
      SearchGitHubWithDetails({
        searchWhere: 'issues',
        searchQuery: `is:pr repo:${userDoc?.github?.repositories?.[0]?.owner}/${userDoc?.github?.repositories?.[0]?.repo} author:${userDoc?.github?.userName} created:${oldest}..${latest}`,
        accessToken: userDoc?.github?.accessToken
      }).then((res: PullRequestsType[]) => {
        UpdInsGitHubPullRequests({
          docId: uid,
          pullRequests: res
        });
      });
  }, [uid, userDoc?.github, latest]);

  // Get Pull Requests data from pullRequests collection from Firestore
  const [pullRequests, setPullRequests] = useState<{ x: string; y: number }[]>(
    []
  );
  useEffect(() => {
    if (uid)
      getPullRequests(uid).then((res) => {
        // Convert data to {x: string, y: number}[]
        const pullRequests = res
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
        if (pullRequests) setPullRequests(pullRequests);
      });
  }, [uid, createdSince, createdUntil]);

  // Aggregate "Lead time since last pull request created" data from pullRequests collection from Firestore
  const [leadTime, setLeadTime] = useState<{ x: string; y: number }[]>([]);
  useEffect(() => {
    if (uid)
      getPullRequests(uid).then((res) => {
        // Convert data to {x: string, y: number}[]
        const leadTime = res
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
        if (leadTime) setLeadTime(leadTime);
      });
  }, [uid, createdSince, createdUntil]);

  const content =
    'Chart GitHub-related numbers. These include the number of commits, pull requests, reviews, lines of code added, lines of code deleted, etc.';

  // Dataset for line chart. https://www.chartjs.org/docs/latest/charts/line.html
  const dataset1 = {
    label: 'Pull Requests',
    fill: false,
    lineTension: 0.3, // The more the value is, the more the curve is.
    // cubicInterpolationMode: 'monotone', // default or monotone
    backgroundColor: 'rgba(75,192,192,0.4)',
    borderColor: 'rgba(75,192,192,1)',
    // borderCapStyle: 'butt',
    // borderDash: [],
    // borderDashOffset: 0.0,
    // borderJoinStyle: 'miter',
    pointBorderColor: 'rgba(75,192,192,1)',
    pointBackgroundColor: '#fff',
    pointBorderWidth: 2, // Pixels.
    pointHoverRadius: 5,
    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
    pointHoverBorderColor: 'rgba(220,220,220,1)',
    pointHoverBorderWidth: 2,
    pointRadius: 5,
    // pointHitRadius: 10,
    data: pullRequests
    // yAxisID: 'y1' // If you want to use a different y-axis, uncomment this line.
  };
  const dataset2 = {
    label: 'Moving Average of LT',
    fill: false,
    lineTension: 0.3, // The more the value is, the more the curve is.
    // cubicInterpolationMode: 'monotone', // default or monotone
    backgroundColor: 'rgba(255, 99, 132, 0.4)',
    borderColor: 'rgba(255, 99, 132, 1)',
    // borderCapStyle: 'butt',
    // borderDash: [],
    // borderDashOffset: 0.0,
    // borderJoinStyle: 'miter',
    pointBorderColor: 'rgba(255, 99, 132, 1)',
    pointBackgroundColor: '#fff',
    pointBorderWidth: 2, // Pixels.
    pointHoverRadius: 5,
    pointHoverBackgroundColor: 'rgba(255, 99, 132, 1)',
    pointHoverBorderColor: 'rgba(220,220,220,1)',
    pointHoverBorderWidth: 2,
    pointRadius: 5,
    // pointHitRadius: 10,
    data: leadTime
    // yAxisID: 'y2' // If you want to use a different y-axis, uncomment this line.
  };
  const data1 = {
    // labels: [], // Labels for the x-axis
    datasets: [dataset1] // Data for the y-axis
  };
  const data2 = {
    // labels: [], // Labels for the x-axis
    datasets: [dataset2] // Data for the y-axis
  };

  // Options for line chart
  const options1 = {
    maintainAspectRatio: false,
    responsive: true, // Make the chart responsive
    plugins: {
      legend: {
        labels: {
          // https://www.chartjs.org/docs/latest/general/fonts.html
          font: {
            size: 18 // Default is 12px.
          }
        },
        position: 'top' as const // 'top', 'bottom', 'left', 'right'
      },
      title: {
        display: false, // true, false
        text: 'GitHub Line Chart' // string
      }
    },
    // https://www.chartjs.org/docs/latest/axes/
    // https://www.chartjs.org/docs/latest/axes/cartesian/time.html#configuration-options
    scales: {
      x: {
        display: true, // true, false
        type: 'time' as const, // 'linear', 'logarithmic', 'time', 'category', 'timeseries'
        time: {
          unit: 'day' as const, // 'millisecond', 'second', 'minute', 'hour', 'day', 'week', 'month', 'quarter', 'year'. https://www.chartjs.org/docs/latest/axes/cartesian/time.html#time-units
          // parser: 'x', // means Unix Timestamp without milliseconds. https://www.chartjs.org/docs/latest/axes/cartesian/time.html#parsing-callbacks
          // round: false, // If it's true, dates will be rounded to the start of this unit.
          // stepSize: 1, // The number of units between grid lines.
          displayFormats: {
            day: 'MMM D, YY' // https://momentjs.com/docs/#/displaying/format/
          },
          tooltipFormat: 'llll' // Tue, Oct 11, 2022 2:52 PM. https://momentjs.com/
        },
        suggestedMin: createdSinceUnix || pullRequests[0]?.x,
        suggestedMax: createdUntilUnix,
        ticks: {
          font: {
            size: 18 // Default is 12px.
          }
        }
      },
      y: {
        display: true, // true, false
        type: 'linear' as const, // 'linear', 'logarithmic', 'time', 'category', 'timeseries'
        position: 'left' as const, // 'left', 'right'
        title: {
          display: true, // true, false
          text: 'Total PRs (#)',
          font: {
            size: 18 // Default is 12px.
          }
        },
        suggestedMin: 0, // Minimum value to display on the y-axis
        ticks: {
          font: {
            size: 18 // Default is 12px.
          }
        }
      }
    }
  };

  const options2 = {
    maintainAspectRatio: false,
    responsive: true, // Make the chart responsive
    plugins: {
      legend: {
        labels: {
          // https://www.chartjs.org/docs/latest/general/fonts.html
          font: {
            size: 18 // Default is 12px.
          }
        },
        position: 'top' as const // 'top', 'bottom', 'left', 'right'
      },
      title: {
        display: false, // true, false
        text: 'GitHub Line Chart' // string
      }
    },
    // https://www.chartjs.org/docs/latest/axes/
    // https://www.chartjs.org/docs/latest/axes/cartesian/time.html#configuration-options
    scales: {
      x: {
        display: true, // true, false
        type: 'time' as const, // 'linear', 'logarithmic', 'time', 'category', 'timeseries'
        time: {
          unit: 'day' as const, // 'millisecond', 'second', 'minute', 'hour', 'day', 'week', 'month', 'quarter', 'year'. https://www.chartjs.org/docs/latest/axes/cartesian/time.html#time-units
          // parser: 'x', // means Unix Timestamp without milliseconds. https://www.chartjs.org/docs/latest/axes/cartesian/time.html#parsing-callbacks
          // round: false, // If it's true, dates will be rounded to the start of this unit.
          // stepSize: 1, // The number of units between grid lines.
          displayFormats: {
            day: 'MMM D, YY' // https://momentjs.com/docs/#/displaying/format/
          },
          tooltipFormat: 'llll' // Tue, Oct 11, 2022 2:52 PM. https://momentjs.com/
        },
        suggestedMin: createdSinceUnix || leadTime[0]?.x,
        suggestedMax: createdUntilUnix,
        ticks: {
          font: {
            size: 18 // Default is 12px.
          }
        }
      },
      y: {
        display: true, // true, false
        type: 'linear' as const, // 'linear', 'logarithmic', 'time', 'category', 'timeseries'
        position: 'left' as const, // 'left', 'right'
        title: {
          display: true, // true, false
          text: 'Lead Time (Hours)',
          font: {
            size: 18 // Default is 12px.
          }
        },
        suggestedMin: 0, // Minimum value to display on the y-axis
        ticks: {
          font: {
            size: 18 // Default is 12px.
          }
        }
        // grid: {
        //   drawOnChartArea: false // false, true
        // }
      }
    }
  };

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
          <div className='md:grid md:grid-cols-2 md:gap-4'>
            <div className='h-80 md:h-104'>
              <Line options={options1} data={data1} />
            </div>
            <div className='h-80 md:h-104'>
              <Line options={options2} data={data2} />
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
