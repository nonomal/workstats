// Next.js and React related
import Head from 'next/head';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import nookies from 'nookies';

// Config
import { verifyIdToken } from '../firebaseAdmin';
import { NumbersType, UserType } from '../config/firebaseTypes';

// Components
import ProfileList from '../components/common/ProfileList';
import CardList from '../components/cards/CardList';
import Avatar from '../components/common/Avatar';
import ButtonList from '../components/buttons/ButtonList';
// import SpecifyPeriodFromTo from '../components/buttons/SpecifyPeriodFromTo';
import Onboarding from '../components/onboarding/product-tour';
import Steps from '../constants/dashboardTourSteps.json';

// Services
import { getAUserDoc, getANumbersDoc } from '../services/getDocFromFirestore';

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
  googleAccessToken: string;
  googleRefreshToken: string;
  numbersDoc: NumbersType;
  profileList: UserType;
  slackAccessToken: string;
  slackMemberId: string;
  numberOfOnboardingTimes: number;
  uid: string;
}

export default function Dashboard({
  asanaWorkspaceId,
  asanaUserId,
  asanaOAuthAccessToken,
  asanaRefreshToken,
  githubOwnerName,
  githubRepoName,
  githubUserId,
  githubUserName,
  githubAccessToken,
  googleAccessToken,
  googleRefreshToken,
  numbersDoc,
  profileList,
  slackAccessToken,
  slackMemberId,
  numberOfOnboardingTimes,
  uid
}: PropTypes) {
  const contentLong =
    'WorkStats is a dashboard tool for engineers and project managers engaged in system development to visualize their productivity and contributions in numbers. It aggregates various numbers from the platforms used by members and teams, such as GitHub for source control, Asana for task management, and Slack for communication tools.';

  return (
    <>
      <Head>
        <title>Dashboard - WorkStats</title>
        <meta name='description' content={contentLong} />
      </Head>
      {profileList && (
        <main className='md:flex min-h-screen'>
          <div className='md:w-72'>
            <Avatar userId={uid} />
            <div className='hidden md:block md:h-5'></div>
            <ProfileList profileList={profileList} />
          </div>
          <div>
            <ButtonList />
            {/* <SpecifyPeriodFromTo /> */}
            <CardList
              asanaWorkspaceId={asanaWorkspaceId}
              asanaUserId={asanaUserId}
              asanaOAuthAccessToken={asanaOAuthAccessToken}
              asanaRefreshToken={asanaRefreshToken}
              githubOwnerName={githubOwnerName}
              githubRepoName={githubRepoName}
              githubUserId={githubUserId}
              githubUserName={githubUserName}
              githubAccessToken={githubAccessToken}
              googleOAuthAccessToken={googleAccessToken}
              googleRefreshToken={googleRefreshToken}
              numbersDoc={numbersDoc}
              slackAccessToken={slackAccessToken}
              slackMemberId={slackMemberId}
              uid={uid}
            />
            <div className='h-20'></div>
          </div>
          <Onboarding
            docId={uid}
            // @ts-ignore
            steps={Steps}
            productTourName={'dashboard'}
            numberOfOnboardingTimes={numberOfOnboardingTimes}
          />
        </main>
      )}
    </>
  );
}

// This gets called on every request.
// The official document is here: https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props
export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  // interface Cookies {
  //   _ga: string;
  //   token: string; // Firebase ID token. It starts with "eyJhbGciOiJS..."
  //   _ga_45J7T193WF: string;
  // }
  // console.log({ ctx });
  const cookies = nookies.get(ctx);
  // console.log({ cookies });

  // console.log('cookies.token: ', cookies.token);
  // console.log('Boolean(cookies.token): ', Boolean(cookies.token));
  if (cookies.token) {
    try {
      const token = await verifyIdToken(cookies.token);

      // the user is authenticated!
      const { uid } = token;
      const userDoc = (await getAUserDoc(uid)) ? await getAUserDoc(uid) : null;
      const numbersDoc = (await getANumbersDoc(uid))
        ? await getANumbersDoc(uid)
        : null;

      // Profile list to be displayed on the left side
      const profileList = {
        firstName: userDoc?.firstName ? userDoc.firstName : '',
        middleName: userDoc?.middleName ? userDoc.middleName : '',
        lastName: userDoc?.lastName ? userDoc.lastName : '',
        department: userDoc?.department ? userDoc.department : '',
        rank: userDoc?.rank ? userDoc.rank : '',
        supervisor: userDoc?.supervisor ? userDoc.supervisor : '',
        assessor: userDoc?.assessor ? userDoc.assessor : '',
        assignedPj: userDoc?.assignedPj ? userDoc.assignedPj : '',
        role: userDoc?.role ? userDoc.role : '',
        avatarUrl: userDoc?.avatarUrl ? userDoc.avatarUrl : '',
        email: userDoc?.email ? userDoc.email : '',
        company: userDoc?.company ? userDoc.company : '',
        country: userDoc?.country ? userDoc.country : ''
      };

      // Parameters for Asana
      const asanaOAuthAccessToken = userDoc?.asana?.accessToken
        ? userDoc.asana.accessToken
        : null;
      const asanaRefreshToken = userDoc?.asana?.refreshToken
        ? userDoc.asana.refreshToken
        : null;
      const asanaUserId = userDoc?.asana?.userId ? userDoc.asana.userId : null;
      const asanaWorkspaceId = userDoc?.asana?.workspace?.[0]?.workspaceId
        ? userDoc.asana.workspace[0].workspaceId
        : null;

      // Parameters for GitHub
      const githubRepoName = userDoc?.github?.repositories?.[0]?.repo
        ? userDoc.github.repositories[0].repo
        : null;
      const githubOwnerName = userDoc?.github?.repositories?.[0]?.owner
        ? userDoc.github.repositories[0].owner
        : null;
      const githubUserId = userDoc?.github?.userId
        ? userDoc.github.userId
        : null;
      const githubUserName = userDoc?.github?.userName
        ? userDoc.github.userName
        : null;
      const githubAccessToken = userDoc?.github?.accessToken
        ? userDoc.github.accessToken
        : null;

      // Parameters for Slack
      const slackMemberId = userDoc?.slack?.workspace?.[0]?.memberId
        ? userDoc.slack.workspace[0].memberId
        : null;
      const slackAccessToken = `Bearer ${userDoc?.slack?.workspace?.[0]?.accessToken}`;

      // Parameters for Google Calendar
      const googleAccessToken = userDoc?.google?.workspace?.[0]?.accessToken
        ? userDoc.google.workspace[0].accessToken
        : null;
      const googleRefreshToken = userDoc?.google?.workspace?.[0]?.refreshToken
        ? userDoc.google.workspace[0].refreshToken
        : null;

      // Parameters for Product Tour
      const numberOfOnboardingTimes = userDoc?.productTour?.dashboard
        ? userDoc.productTour.dashboard
        : 0;

      // Pass data to the page via props
      return {
        props: {
          asanaUserId,
          asanaWorkspaceId,
          asanaOAuthAccessToken,
          asanaRefreshToken,
          githubRepoName,
          githubOwnerName,
          githubUserId,
          githubUserName,
          githubAccessToken,
          googleAccessToken,
          googleRefreshToken,
          numbersDoc,
          profileList,
          slackAccessToken,
          slackMemberId,
          numberOfOnboardingTimes,
          uid
        }
      };
    } catch (err) {
      // console.log('try catch error', err);
      return { props: {} };
    }
  } else {
    // console.log('cookies.token is falsy');
    return { props: {} as never };
  }
};

Dashboard.requiresAuth = true;
