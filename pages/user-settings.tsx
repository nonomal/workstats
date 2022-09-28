// Libraries
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebaseClient';

// Components
import SettingsForAvatar from '../components/user-settings/SettingsForAvatar';
import SettingsForBasicInfo from '../components/user-settings/SettingsForBasicInfo';
import SettingsForGitHub from '../components/user-settings/SettingsForGitHub';
import SettingsForAtlassian from '../components/user-settings/SettingsForAtlassian';
import SettingsForAsana from '../components/user-settings/SettingsForAsana';
import SettingsForSlack from '../components/user-settings/SettingsForSlack';
import SettingsForGoogle from '../components/user-settings/SettingsForGoogle';
import JumpToCancelMembership from '../components/user-settings/JumpToCancelMembership';
import Onboarding from '../components/onboarding/product-tour';

// Services and Others
import { useAuth } from '../auth';
import { UserType } from '../config/firebaseTypes';
import Steps from '../constants/userSettingsTourSteps.json';

// Page Component
const useUserSettings = () => {
  // @ts-ignore
  const { currentUser } = useAuth();
  const uid = currentUser?.uid;
  const [userDoc, setUserDoc] = useState<UserType>({});
  const [numberOfOnboardingTimes, setNumberOfOnboardingTimes] = useState(1);
  const [isGithubAuthenticated, setIsGithubAuthenticated] = useState(false);
  const [isAtlassianAuthenticated, setIsAtlassianAuthenticated] =
    useState(false);
  const [isAsanaAuthenticated, setIsAsanaAuthenticated] = useState(false);
  const [isSlackAuthenticated, setIsSlackAuthenticated] = useState(false);
  const [isGoogleAuthenticated, setIsGoogleAuthenticated] = useState(false);

  // Get a user document from Firestore after the component is mounted
  useEffect(() => {
    if (uid) {
      onSnapshot(doc(db, 'users', uid), (docSnap) => {
        const theUserDoc = docSnap.data() as UserType;
        if (theUserDoc) {
          setUserDoc(theUserDoc);
          setNumberOfOnboardingTimes(
            theUserDoc?.productTour?.userSettings || 0
          );
          setIsGithubAuthenticated(
            theUserDoc?.github?.accessToken ? true : false
          );
          setIsAtlassianAuthenticated(
            theUserDoc?.atlassian?.accessToken ? true : false
          );
          setIsAsanaAuthenticated(
            theUserDoc?.asana?.accessToken ? true : false
          );
          setIsSlackAuthenticated(
            theUserDoc?.slack?.workspace?.[0]?.accessToken ? true : false
          );
          setIsGoogleAuthenticated(
            theUserDoc?.google?.workspace?.[0]?.accessToken ? true : false
          );
        }
      });
    }
  }, [uid, isGithubAuthenticated]);

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
        userDocState={userDoc}
        isGithubAuthenticated={isGithubAuthenticated}
      />
      <SettingsForAtlassian
        uid={uid}
        userDoc={userDoc}
        isAtlassianAuthenticated={isAtlassianAuthenticated}
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

useUserSettings.requiresAuth = true;
