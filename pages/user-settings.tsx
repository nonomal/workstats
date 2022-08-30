// Libraries
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import nookies from 'nookies';

// Components
import SettingsForAvatar from '../components/user-settings/SettingsForAvatar';
import SettingsForBasicInfo from '../components/user-settings/SettingsForBasicInfo';
import SettingsForGitHub from '../components/user-settings/SettingsForGitHub';
import SettingsForAsana from '../components/user-settings/SettingsForAsana';
import SettingsForSlack from '../components/user-settings/SettingsForSlack';
import SettingsForGoogle from '../components/user-settings/SettingsForGoogle';
import JumpToCancelMembership from '../components/user-settings/JumpToCancelMembership';
import Onboarding from '../components/onboarding/product-tour';

// Services and Others
import { getAUserDoc } from '../services/getDocFromFirestore';
import { verifyIdToken } from '../firebaseAdmin';
import { UserType } from '../config/firebaseTypes';
import Steps from '../constants/userSettingsTourSteps.json';

interface UserSettingsProps {
  uid: string;
  userDoc: UserType | null;
  isAsanaAuthenticated: boolean;
  isGithubAuthenticated: boolean;
  isGoogleAuthenticated: boolean;
  isSlackAuthenticated: boolean;
}

const useUserSettings = ({
  uid,
  userDoc,
  isAsanaAuthenticated,
  isGithubAuthenticated,
  isGoogleAuthenticated,
  isSlackAuthenticated
}: UserSettingsProps) => {
  const numberOfOnboardingTimes = userDoc?.productTour?.userSettings || 0;

  return (
    <div className='px-4 md:px-5'>
      <Head>
        <title>User Settings - WorkStats</title>
        <meta
          name='description'
          content='This is the user settings page. You can set the users basic information, GitHub aggregation information, Asana aggregation information, Slack aggregation information, etc. You can also unsubscribe from this page.'
        />
      </Head>
      <div className='flex'>
        <SettingsForAvatar uid={uid} />
        <SettingsForBasicInfo uid={uid} userDoc={userDoc} />
      </div>
      <SettingsForGitHub
        uid={uid}
        userDoc={userDoc}
        isGithubAuthenticated={isGithubAuthenticated}
      />
      <SettingsForAsana
        uid={uid}
        userDoc={userDoc}
        isAsanaAuthenticated={isAsanaAuthenticated}
      />
      <SettingsForSlack
        uid={uid}
        userDoc={userDoc}
        isSlackAuthenticated={isSlackAuthenticated}
      />
      <SettingsForGoogle
        uid={uid}
        userDoc={userDoc}
        isGoogleAuthenticated={isGoogleAuthenticated}
      />
      <JumpToCancelMembership />
      <div className='h-20'></div>
      <Onboarding
        docId={uid}
        // @ts-ignore
        steps={Steps}
        productTourName={'userSettings'}
        numberOfOnboardingTimes={numberOfOnboardingTimes}
      />
    </div>
  );
};

export default useUserSettings;

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const cookies = nookies.get(ctx);
  if (cookies.token) {
    try {
      const token = await verifyIdToken(cookies.token);
      const { uid } = token;
      const userDoc = (await getAUserDoc(uid)) ? await getAUserDoc(uid) : null;
      const isGithubAuthenticated =
        userDoc?.github?.accessToken && userDoc?.github?.accessToken !== ''
          ? true
          : false;
      const isAsanaAuthenticated =
        userDoc?.asana?.accessToken && userDoc?.asana?.accessToken !== ''
          ? true
          : false;
      const isSlackAuthenticated =
        userDoc?.slack?.workspace?.[0]?.accessToken &&
        userDoc?.slack?.workspace?.[0]?.accessToken !== ''
          ? true
          : false;
      const isGoogleAuthenticated =
        userDoc?.google?.workspace?.[0]?.accessToken &&
        userDoc?.google?.workspace?.[0]?.accessToken !== ''
          ? true
          : false;

      return {
        props: {
          uid,
          userDoc,
          isAsanaAuthenticated,
          isGithubAuthenticated,
          isGoogleAuthenticated,
          isSlackAuthenticated
        }
      };
    } catch (e) {
      return { props: {} };
    }
  } else {
    return { props: {} as never };
  }
};

useUserSettings.requiresAuth = true;
