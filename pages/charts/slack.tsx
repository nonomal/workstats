// Libraries
import Head from 'next/head';
import { useEffect, useState } from 'react';
import {
  Chart,
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
import { UserType } from '../../config/firebaseTypes';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebaseClient';
import ButtonList from '../../components/buttons/ButtonList';
import {
  UpdInsSlackMentionedMessages,
  UpdInsSlackNewSentMessages,
  UpdInsSlackRepliesMessages
} from '../../services/setDocToFirestore';
import {
  getMentionedMessages,
  getNewSentMessages,
  getRepliesMessages
} from '../../services/getDocFromFirestore';
import {
  LineChartData,
  LineChartOptions
} from '../../services/chartServices.client';
import { SearchSlackMessages } from '../../services/slackServices.client';
import ProgressCircle from '../../components/charts/ProgressCircle';

export default function SlackCharts() {
  // Global timestamp button context
  const globalState: GlobalContextObjectType = useGlobalContext();
  const currentTimeframe = globalState.currentTimeframe;

  // Set time period from global state
  // Slack search query "before" means "less than" so add 1 day and "after" means "greater than" so subtract 1 day
  const oldest = moment().subtract(10, 'years').format('YYYY-MM-DD'); // 10 years for now.
  const latest = moment().add(1, 'days').format('YYYY-MM-DD');
  const since =
    currentTimeframe?.timeframe.since?.format('YYYY-MM-DD') || oldest;
  const until = currentTimeframe?.timeframe.until?.format('YYYY-MM-DD');
  const createdSince = since
    ? moment(since).subtract(1, 'days').format('YYYY-MM-DD')
    : oldest;
  const createdUntil = until
    ? moment(until).add(1, 'days').format('YYYY-MM-DD')
    : latest;
  const sinceUnix = moment(since).unix(); // Unix timestamp in seconds
  const untilUnix = moment(until).unix(); // Unix timestamp in seconds
  // const createdSinceUnix = moment(createdSince).unix(); // Unix timestamp in seconds
  const createdUntilUnix = moment(createdUntil).unix(); // Unix timestamp in seconds
  const durationUnix = untilUnix && sinceUnix && untilUnix - sinceUnix; // Unix timestamp in seconds

  // Set sub time period for comparison
  const createdUntilForComp = since;
  const untilForComp = createdSince;
  const sinceForComp = moment(untilForComp)
    ?.subtract(durationUnix, 'seconds')
    .format('YYYY-MM-DD');
  // const createdSinceForComp = moment(createdUntilForComp)
  //   ?.subtract(durationUnix, 'seconds')
  //   ?.format('YYYY-MM-DD');
  const sinceUnixForComp =
    createdSince !== oldest ? moment(sinceForComp).unix() : undefined; // Seconds
  const untilUnixForComp =
    createdSince !== oldest ? moment(untilForComp).unix() : undefined; // Seconds
  // const createdSinceUnixForComp =
  //   createdSince !== oldest ? moment(createdSinceForComp).unix() : undefined; // Seconds
  const createdUntilUnixForComp =
    createdSince !== oldest ? moment(createdUntilForComp).unix() : undefined; // Seconds

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

  // Search and get data from Slack and store them in Firestore
  const [isUpdatedForMentioned, setIsUpdatedForMentioned] = useState(false);
  const [isUpdatedForReplies, setIsUpdatedForReplies] = useState(false);
  const [isUpdatedForNewSent, setIsUpdatedForNewSent] = useState(false);
  const [progressForMentioned, setProgressForMentioned] = useState(0);
  const [progressForReplies, setProgressForReplies] = useState(0);
  const [progressForNewSent, setProgressForNewSent] = useState(0);
  useEffect(() => {
    const slackMemberId = userDoc?.slack?.workspace?.[0]?.memberId;
    const slackAccessToken = userDoc?.slack?.workspace?.[0]?.accessToken;
    if (uid && slackMemberId && slackAccessToken) {
      // Search and get data when the user was mentioned in Slack and store them in Firestore
      SearchSlackMessages({
        slackMemberId,
        slackAccessToken,
        searchMode: 'mentioned',
        since: oldest,
        until: latest,
        setProgress: setProgressForMentioned
      })
        .then((res) => {
          if (res)
            UpdInsSlackMentionedMessages({
              docId: uid,
              messages: res
            });
        })
        .then(() => setIsUpdatedForMentioned(true));

      // Search and get data when the user replied in Slack and store them in Firestore
      SearchSlackMessages({
        slackMemberId,
        slackAccessToken,
        searchMode: 'replies',
        since: oldest,
        until: latest,
        setProgress: setProgressForReplies
      })
        .then((res) => {
          if (res)
            UpdInsSlackRepliesMessages({
              docId: uid,
              messages: res
            });
        })
        .then(() => setIsUpdatedForReplies(true));

      // Search and get data when the user sent new messages in Slack and store them in Firestore
      SearchSlackMessages({
        slackMemberId,
        slackAccessToken,
        searchMode: 'new-sent',
        since: oldest,
        until: latest,
        setProgress: setProgressForNewSent
      })
        .then((res) => {
          if (res)
            UpdInsSlackNewSentMessages({
              docId: uid,
              messages: res
            });
        })
        .then(() => setIsUpdatedForNewSent(true));
    }
  }, [latest, oldest, uid, userDoc?.slack?.workspace]);

  // Get main & sub number of mentioned data from slack-mentioned-messages collection from Firestore
  const [mentioned1, setMentioned1] = useState<{ x: number; y: number }[]>([]);
  const [mentioned2, setMentioned2] = useState<{ x: number; y: number }[]>([]);
  useEffect(() => {
    if (uid) {
      getMentionedMessages(uid).then((res) => {
        // Filter and convert data to {x: number, y: number}[] for main chart
        const messagesForMain = res
          ? res
              ?.filter(
                (message) => message.ts >= sinceUnix && message.ts <= untilUnix
              )
              ?.map((message, index) => ({
                x: message.ts * 1000, // Convert to milliseconds
                y: index + 1 // Count number of mentioned messages
              }))
          : [];
        if (messagesForMain) setMentioned1(messagesForMain);

        const messagesForComp =
          res && sinceUnixForComp && untilUnixForComp
            ? res
                ?.filter(
                  (message) =>
                    message.ts >= sinceUnixForComp &&
                    message.ts <= untilUnixForComp
                )
                ?.map((message, index) => ({
                  x: message.ts * 1000, // Convert to milliseconds
                  y: index + 1 // Count number of mentioned messages
                }))
            : [];
        if (messagesForComp) setMentioned2(messagesForComp);
      });
    }
  }, [
    uid,
    isUpdatedForMentioned,
    sinceUnixForComp,
    untilUnixForComp,
    sinceUnix,
    untilUnix
  ]);

  // Moving average of the interval from the last mentioned to the current mentioned over the past 20 mentioned.
  const [intervalsForMentioned1, setIntervalsForMentioned1] = useState<
    { x: number; y: number }[]
  >([]);
  const [intervalsForMentioned2, setIntervalsForMentioned2] = useState<
    { x: number; y: number }[]
  >([]);
  useEffect(() => {
    if (uid) {
      getMentionedMessages(uid).then((res) => {
        // Filter and convert data to {x: number, y: number}[] for main chart
        const intervalsForMentioned1 = res
          ? res
              ?.filter(
                (message) => message.ts >= sinceUnix && message.ts <= untilUnix
              )
              ?.map((message) => ({
                x: message.ts * 1000, // Convert to milliseconds
                y: message.aveIntvl // Convert to hours
              }))
          : [];

        // Filter and convert data to {x: number, y: number}[] for comparison chart
        const intervalsForMentioned2 =
          res && sinceUnixForComp && untilUnixForComp
            ? res
                ?.filter(
                  (message) =>
                    message.ts >= sinceUnixForComp &&
                    message.ts <= untilUnixForComp
                )
                ?.map((message) => ({
                  x: message.ts * 1000, // Convert to milliseconds
                  y: message.aveIntvl // Convert to hours
                }))
            : [];

        // Set data
        if (intervalsForMentioned1)
          setIntervalsForMentioned1(intervalsForMentioned1);
        if (intervalsForMentioned2)
          setIntervalsForMentioned2(intervalsForMentioned2);
      });
    }
  }, [
    uid,
    isUpdatedForMentioned,
    sinceUnixForComp,
    untilUnixForComp,
    sinceUnix,
    untilUnix
  ]);

  // Get main & sub number of replies data from slack-replies-messages collection from Firestore
  const [replies1, setReplies1] = useState<{ x: number; y: number }[]>([]);
  const [replies2, setReplies2] = useState<{ x: number; y: number }[]>([]);
  useEffect(() => {
    if (uid) {
      getRepliesMessages(uid).then((res) => {
        // Filter and convert data to {x: number, y: number}[] for main chart
        const messagesForMain = res
          ? res
              ?.filter(
                (message) => message.ts >= sinceUnix && message.ts <= untilUnix
              )
              ?.map((message, index) => ({
                x: message.ts * 1000, // Convert to milliseconds
                y: index + 1 // Count number of replies messages
              }))
          : [];
        if (messagesForMain) setReplies1(messagesForMain);

        const messagesForComp =
          res && sinceUnixForComp && untilUnixForComp
            ? res
                ?.filter(
                  (message) =>
                    message.ts >= sinceUnixForComp &&
                    message.ts <= untilUnixForComp
                )
                ?.map((message, index) => ({
                  x: message.ts * 1000, // Convert to milliseconds
                  y: index + 1 // Count number of replies messages
                }))
            : [];
        if (messagesForComp) setReplies2(messagesForComp);
      });
    }
  }, [
    uid,
    isUpdatedForReplies,
    sinceUnixForComp,
    untilUnixForComp,
    sinceUnix,
    untilUnix
  ]);

  // Moving average of the interval from the last replies to the current replies over the past 20 replies.
  const [intervalsForReplies1, setIntervalsForReplies1] = useState<
    { x: number; y: number }[]
  >([]);
  const [intervalsForReplies2, setIntervalsForReplies2] = useState<
    { x: number; y: number }[]
  >([]);
  useEffect(() => {
    if (uid) {
      getRepliesMessages(uid).then((res) => {
        // Filter and convert data to {x: number, y: number}[] for main chart
        const intervalsForReplies1 = res
          ? res
              ?.filter(
                (message) => message.ts >= sinceUnix && message.ts <= untilUnix
              )
              ?.map((message) => ({
                x: message.ts * 1000, // Convert to milliseconds
                y: message.aveIntvl // in hours
              }))
          : [];

        // Filter and convert data to {x: number, y: number}[] for comparison chart
        const intervalsForReplies2 =
          res && sinceUnixForComp && untilUnixForComp
            ? res
                ?.filter(
                  (message) =>
                    message.ts >= sinceUnixForComp &&
                    message.ts <= untilUnixForComp
                )
                ?.map((message) => ({
                  x: message.ts * 1000, // Convert to milliseconds
                  y: message.aveIntvl // in hours
                }))
            : [];

        // Set data
        if (intervalsForReplies1) setIntervalsForReplies1(intervalsForReplies1);
        if (intervalsForReplies2) setIntervalsForReplies2(intervalsForReplies2);
      });
    }
  }, [
    uid,
    isUpdatedForReplies,
    sinceUnixForComp,
    untilUnixForComp,
    sinceUnix,
    untilUnix
  ]);

  // Get main & sub number of new sent data from slack-new-sent-messages collection from Firestore
  const [newSent1, setNewSent1] = useState<{ x: number; y: number }[]>([]);
  const [newSent2, setNewSent2] = useState<{ x: number; y: number }[]>([]);
  useEffect(() => {
    if (uid) {
      getNewSentMessages(uid).then((res) => {
        // Filter and convert data to {x: number, y: number}[] for main chart
        const messagesForMain = res
          ? res
              ?.filter(
                (message) => message.ts >= sinceUnix && message.ts <= untilUnix
              )
              ?.map((message, index) => ({
                x: message.ts * 1000, // Convert to milliseconds
                y: index + 1 // Count number of replies messages
              }))
          : [];
        if (messagesForMain) setNewSent1(messagesForMain);

        const messagesForComp =
          res && sinceUnixForComp && untilUnixForComp
            ? res
                ?.filter(
                  (message) =>
                    message.ts >= sinceUnixForComp &&
                    message.ts <= untilUnixForComp
                )
                ?.map((message, index) => ({
                  x: message.ts * 1000, // Convert to milliseconds
                  y: index + 1 // Count number of replies messages
                }))
            : [];
        if (messagesForComp) setNewSent2(messagesForComp);
      });
    }
  }, [
    uid,
    isUpdatedForNewSent,
    sinceUnixForComp,
    untilUnixForComp,
    sinceUnix,
    untilUnix
  ]);

  // Moving average of the interval from the last new sent to the current new sent over the past 20 new sent.
  const [intervalsForNewSent1, setIntervalsForNewSent1] = useState<
    { x: number; y: number }[]
  >([]);
  const [intervalsForNewSent2, setIntervalsForNewSent2] = useState<
    { x: number; y: number }[]
  >([]);
  useEffect(() => {
    if (uid) {
      getNewSentMessages(uid).then((res) => {
        // Filter and convert data to {x: number, y: number}[] for main chart
        const intervalsForNewSent1 = res
          ? res
              ?.filter(
                (message) => message.ts >= sinceUnix && message.ts <= untilUnix
              )
              ?.map((message) => ({
                x: message.ts * 1000, // Convert to milliseconds
                y: message.aveIntvl // in hours
              }))
          : [];

        // Filter and convert data to {x: number, y: number}[] for comparison chart
        const intervalsForNewSent2 =
          res && sinceUnixForComp && untilUnixForComp
            ? res
                ?.filter(
                  (message) =>
                    message.ts >= sinceUnixForComp &&
                    message.ts <= untilUnixForComp
                )
                ?.map((message) => ({
                  x: message.ts * 1000, // Convert to milliseconds
                  y: message.aveIntvl // in hours
                }))
            : [];

        // Set data
        if (intervalsForNewSent1) setIntervalsForNewSent1(intervalsForNewSent1);
        if (intervalsForNewSent2) setIntervalsForNewSent2(intervalsForNewSent2);
      });
    }
  }, [
    uid,
    isUpdatedForNewSent,
    sinceUnixForComp,
    untilUnixForComp,
    sinceUnix,
    untilUnix
  ]);

  const content =
    'Chart Slack-related numbers. These include the number of mentioned, number of replies, number of new sent, etc.';

  // Dataset for line chart for number of mentioned. https://www.chartjs.org/docs/latest/charts/line.html
  const dataset1_1 = LineChartData({
    label: 'Current period',
    data: mentioned1,
    xAxisID: 'x1',
    subColor: 'rgba(255, 99, 132, 0.2)',
    mainColor: 'rgba(255, 99, 132, 1)'
  });
  const dataset1_2 = LineChartData({
    label: 'Previous One',
    data: mentioned2,
    xAxisID: 'x2',
    subColor: '#f1f5f9',
    mainColor: '#94a3b8',
    borderDash: [5, 5]
  });
  const dataset2_1 = LineChartData({
    label: 'Current period',
    data: intervalsForMentioned1,
    xAxisID: 'x1',
    subColor: 'rgba(255, 159, 64, 0.4)',
    mainColor: 'rgba(255, 159, 64, 1)'
  });
  const dataset2_2 = LineChartData({
    label: 'Previous One',
    data: intervalsForMentioned2,
    xAxisID: 'x2',
    subColor: '#f1f5f9',
    mainColor: '#94a3b8',
    borderDash: [5, 5]
  });
  const data1 = {
    datasets: since !== oldest ? [dataset1_1, dataset1_2] : [dataset1_1] // Datasets for the y-axis
  };
  const data2 = {
    datasets: since !== oldest ? [dataset2_1, dataset2_2] : [dataset2_1] // Datasets for the y-axis
  };

  // Options for line chart for number of mentioned
  const options1 = LineChartOptions({
    chartTitle: '# of times you have been mentioned',
    y1Title: '# of times',
    x1SuggestedMin: since !== oldest ? sinceUnix * 1000 : undefined,
    x1SuggestedMax: createdUntilUnix * 1000,
    x2SuggestedMin: sinceUnixForComp ? sinceUnixForComp * 1000 : undefined,
    x2SuggestedMax: createdUntilUnixForComp
      ? createdUntilUnixForComp * 1000
      : undefined
  });
  const options2 = LineChartOptions({
    chartTitle: 'Intervals you have been mentioned*',
    y1Title: 'Hours',
    x1SuggestedMin: since !== oldest ? sinceUnix * 1000 : undefined,
    x1SuggestedMax: createdUntilUnix * 1000,
    x2SuggestedMin: sinceUnixForComp ? sinceUnixForComp * 1000 : undefined,
    x2SuggestedMax: createdUntilUnixForComp
      ? createdUntilUnixForComp * 1000
      : undefined
  });

  // Dataset for line chart for number of replies. https://www.chartjs.org/docs/latest/charts/line.html
  const dataset3_1 = LineChartData({
    label: 'Current period',
    data: replies1,
    xAxisID: 'x1',
    subColor: '#dcfce7',
    mainColor: '#22c55e'
  });
  const dataset3_2 = LineChartData({
    label: 'Previous One',
    data: replies2,
    xAxisID: 'x2',
    subColor: '#f1f5f9',
    mainColor: '#94a3b8',
    borderDash: [5, 5]
  });
  const dataset4_1 = LineChartData({
    label: 'Current period',
    data: intervalsForReplies1,
    xAxisID: 'x1',
    subColor: '#ccfbf1',
    mainColor: '#14b8a6'
  });
  const dataset4_2 = LineChartData({
    label: 'Previous One',
    data: intervalsForReplies2,
    xAxisID: 'x2',
    subColor: '#f1f5f9',
    mainColor: '#94a3b8',
    borderDash: [5, 5]
  });
  const data3 = {
    datasets: since !== oldest ? [dataset3_1, dataset3_2] : [dataset3_1] // Datasets for the y-axis
  };
  const data4 = {
    datasets: since !== oldest ? [dataset4_1, dataset4_2] : [dataset4_1] // Datasets for the y-axis
  };

  // Options for line chart for number of replies
  const options3 = LineChartOptions({
    chartTitle: '# of times you have replied',
    y1Title: '# of times',
    x1SuggestedMin: since !== oldest ? sinceUnix * 1000 : undefined,
    x1SuggestedMax: createdUntilUnix * 1000,
    x2SuggestedMin: sinceUnixForComp ? sinceUnixForComp * 1000 : undefined,
    x2SuggestedMax: createdUntilUnixForComp
      ? createdUntilUnixForComp * 1000
      : undefined
  });
  const options4 = LineChartOptions({
    chartTitle: 'Intervals you have replied*',
    y1Title: 'Hours',
    x1SuggestedMin: since !== oldest ? sinceUnix * 1000 : undefined,
    x1SuggestedMax: createdUntilUnix * 1000,
    x2SuggestedMin: sinceUnixForComp ? sinceUnixForComp * 1000 : undefined,
    x2SuggestedMax: createdUntilUnixForComp
      ? createdUntilUnixForComp * 1000
      : undefined
  });

  // Dataset for line chart for number of new sent. https://www.chartjs.org/docs/latest/charts/line.html
  const dataset5_1 = LineChartData({
    label: 'Current period',
    data: newSent1,
    xAxisID: 'x1',
    subColor: '#dbeafe',
    mainColor: '#1d4ed8'
  });
  const dataset5_2 = LineChartData({
    label: 'Previous One',
    data: newSent2,
    xAxisID: 'x2',
    subColor: '#f1f5f9',
    mainColor: '#94a3b8',
    borderDash: [5, 5]
  });
  const dataset6_1 = LineChartData({
    label: 'Current period',
    data: intervalsForNewSent1,
    xAxisID: 'x1',
    subColor: '#cffafe',
    mainColor: '#06b6d4'
  });
  const dataset6_2 = LineChartData({
    label: 'Previous One',
    data: intervalsForNewSent2,
    xAxisID: 'x2',
    subColor: '#f1f5f9',
    mainColor: '#94a3b8',
    borderDash: [5, 5]
  });
  const data5 = {
    datasets: since !== oldest ? [dataset5_1, dataset5_2] : [dataset5_1] // Datasets for the y-axis
  };
  const data6 = {
    datasets: since !== oldest ? [dataset6_1, dataset6_2] : [dataset6_1] // Datasets for the y-axis
  };

  // Options for line chart for number of replies
  const options5 = LineChartOptions({
    chartTitle: '# of times you have sent new messages',
    y1Title: '# of times',
    x1SuggestedMin: since !== oldest ? sinceUnix * 1000 : undefined,
    x1SuggestedMax: createdUntilUnix * 1000,
    x2SuggestedMin: sinceUnixForComp ? sinceUnixForComp * 1000 : undefined,
    x2SuggestedMax: createdUntilUnixForComp
      ? createdUntilUnixForComp * 1000
      : undefined
  });
  const options6 = LineChartOptions({
    chartTitle: 'Intervals you have sent new messages*',
    y1Title: 'Hours',
    x1SuggestedMin: since !== oldest ? sinceUnix * 1000 : undefined,
    x1SuggestedMax: createdUntilUnix * 1000,
    x2SuggestedMin: sinceUnixForComp ? sinceUnixForComp * 1000 : undefined,
    x2SuggestedMax: createdUntilUnixForComp
      ? createdUntilUnixForComp * 1000
      : undefined
  });

  // Register the chart plugins
  Chart.register(
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
        <title>Charts for Slack - WorkStats</title>
        <meta name='description' content={content} />
      </Head>
      <main className='flex'>
        <div className='w-5 md:w-10'></div>
        <div>
          <div id='time-periods'>
            <ButtonList />
          </div>
          <h2 className='text-xl mt-2 md:mt-4 md:mb-2 px-5 md:px-0'>
            Slack charts
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 md:gap-4 place-items-center md:place-items-stretch'>
            <div
              className={`relative h-92 w-11/12 md:h-108 md:w-auto flex justify-center items-center ${
                data1.datasets[0].data.length > 0 ? '' : 'animate-pulse'
              }`}
            >
              {/* @ts-ignore */}
              <Line options={options1} data={data1} />
              {data1.datasets[0].data.length === 0 ? (
                <ProgressCircle
                  // id='progress-circle-1'
                  progress={progressForMentioned}
                  size={100}
                  strokeWidth={10}
                  color='#1f2937' // Same as the sidebar bg color
                />
              ) : null}
            </div>
            <div
              className={`relative h-92 w-11/12 md:h-108 md:w-auto flex justify-center items-center ${
                data2.datasets[0].data.length > 0 ? '' : 'animate-pulse'
              }`}
            >
              {/* @ts-ignore */}
              <Line options={options2} data={data2} />
              {data2.datasets[0].data.length === 0 ? (
                <ProgressCircle
                  // id='progress-circle-2'
                  progress={progressForMentioned}
                  size={100}
                  strokeWidth={10}
                  color='#1f2937' // Same as the sidebar bg color
                />
              ) : null}
            </div>
          </div>
          <div className='md:grid md:grid-cols-2 md:gap-4'>
            <div className='hidden md:block'></div>
            <div className='px-5'>
              *Moving average of interval over the last 20 intervals between the
              current time and the previous one.
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 md:gap-4 place-items-center md:place-items-stretch'>
            <div
              className={`relative h-92 w-11/12 md:h-108 md:w-auto flex justify-center items-center ${
                data3.datasets[0].data.length > 0 ? '' : 'animate-pulse'
              }`}
            >
              {/* @ts-ignore */}
              <Line options={options3} data={data3} />
              {data3.datasets[0].data.length === 0 ? (
                <ProgressCircle
                  // id='progress-circle-3'
                  progress={progressForReplies}
                  size={100}
                  strokeWidth={10}
                  color='#1f2937' // Same as the sidebar bg color
                />
              ) : null}
            </div>
            <div
              className={`relative h-92 w-11/12 md:h-108 md:w-auto flex justify-center items-center ${
                data4.datasets[0].data.length > 0 ? '' : 'animate-pulse'
              }`}
            >
              {/* @ts-ignore */}
              <Line options={options4} data={data4} />
              {data4.datasets[0].data.length === 0 ? (
                <ProgressCircle
                  // id='progress-circle-4'
                  progress={progressForReplies}
                  size={100}
                  strokeWidth={10}
                  color='#1f2937' // Same as the sidebar bg color
                />
              ) : null}
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 md:gap-4 place-items-center md:place-items-stretch'>
            <div
              className={`relative h-92 w-11/12 md:h-108 md:w-auto flex justify-center items-center ${
                data5.datasets[0].data.length > 0 ? '' : 'animate-pulse'
              }`}
            >
              {/* @ts-ignore */}
              <Line options={options5} data={data5} />
              {data5.datasets[0].data.length === 0 ? (
                <ProgressCircle
                  // id='progress-circle-5'
                  progress={progressForNewSent}
                  size={100}
                  strokeWidth={10}
                  color='#1f2937' // Same as the sidebar bg color
                />
              ) : null}
            </div>
            <div
              className={`relative h-92 w-11/12 md:h-108 md:w-auto flex justify-center items-center ${
                data6.datasets[0].data.length > 0 ? '' : 'animate-pulse'
              }`}
            >
              {/* @ts-ignore */}
              <Line options={options6} data={data6} />
              {data6.datasets[0].data.length === 0 ? (
                <ProgressCircle
                  // id='progress-circle-6'
                  progress={progressForNewSent}
                  size={100}
                  strokeWidth={10}
                  color='#1f2937' // Same as the sidebar bg color
                />
              ) : null}
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
          {/* <ol
            className='py-1 px-5 pl-7 md:ml-3 md:pl-1 list-decimal list-inside'
            role='list'
          >
            <li key={1} className='pb-1'>
              For example, if the total # of pull requests is rising steadily
              and the intervals between pull requests is falling steadily, it
              would be great!
            </li>
            <li key={2} className='pt-1'>
              Or, for example, if the intervals between pull requests is less
              than 168 hours, you make one pull request per week. If the lead
              time between pull requests is less than 24 hours, then you make
              one pull request per day. Depends on what the pull request is, but
              it&apos;s fast!
            </li>
          </ol> */}
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

SlackCharts.requiresAuth = true;
