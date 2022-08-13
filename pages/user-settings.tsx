// Next.js and React related
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import nookies from 'nookies';

// Components and Services
import Avatar from '../components/common/Avatar';
import InputBox from '../components/boxes/InputBox';
import SubmitButton from '../components/buttons/SubmitButton';
import { UserType } from '../config/firebaseTypes';
import { verifyIdToken } from '../firebaseAdmin';
import { getAUserDoc } from '../services/getDocFromFirestore';
import {
  handleSubmitAsanaAccessToken,
  handleSubmitBasicInfo,
  handleSubmitCommunicationActivity,
  handleSubmitGithubAccessToken,
  handleSubmitGoogleAccessToken,
  handleSubmitSlackAccessToken,
  handleSubmitSourceCode,
  handleSubmitTaskTicket
} from '../services/setDocToFirestore';
import QuestionMark from '../components/common/QuestionMark';
import NewTabIcon from '../public/new-tab-svgrepo-com.svg';
import RequestOAuthButton from '../components/buttons/RequestOAuthButton';
import DisconnectWithGithubButton from '../components/buttons/DisconnectWithGithubButton';
import { requestGithubUserIdentity } from '../services/githubServices.client';
import { requestAsanaUserIdentity } from '../services/asanaServices.client';
import DisconnectWithAsanaButton from '../components/buttons/DisconnectWithAsanaButton';
import { requestSlackUserIdentity } from '../services/slackServices.client';
import DisconnectWithSlackButton from '../components/buttons/DisconnectWithSlackButton';
import DisconnectWithGoogleButton from '../components/buttons/DisconnectWithGoogleButton';
import { requestGoogleUserIdentity } from '../services/googleCalendar.client';
import RequestGoogleOAuthButton from '../components/buttons/RequestGoogleOAuthButton';
import Onboarding from '../components/onboarding/product-tour';
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
  // If a user click 'Connect with xxxxx' button to agree to authenticate WorkStats with xxxxx scopes, a code will be passed to the redirect URL.
  const htmlParams = window.location.search;
  // code means githubCode here
  const code = htmlParams.startsWith('?code=')
    ? htmlParams.split(/[=&]+/)[1] // split by '=' or '&'
    : undefined;
  const asanaCode = htmlParams.startsWith('?asana=')
    ? decodeURIComponent(htmlParams.split(/[=&]+/)[3]) // ['asana', 'true', 'code', 'codeValue']
    : undefined;
  const slackCode = htmlParams.startsWith('?slack=')
    ? decodeURIComponent(htmlParams.split(/[=&]+/)[3]) // ['slack', 'true', 'code', 'codeValue']
    : undefined;
  const googleCode = htmlParams.startsWith('?google=')
    ? decodeURIComponent(htmlParams.split(/[=&]+/)[5]) // ['google', 'true', 'state', 'stateValue', 'code', 'codeValue', 'scope', 'scopeValue']
    : undefined;

  // If code is defined and isGithubAuthenticatedState is false, call /api/get-github-access-token to exchange the code for a GitHub access token
  const [isGithubAuthenticatedState, setIsGithubAuthenticatedState] = useState(
    isGithubAuthenticated
  );
  const [githubAccessToken, setGithubAccessToken] = useState('');
  useEffect(() => {
    if (code && !isGithubAuthenticatedState) {
      const url = '/api/get-github-access-token';
      const headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      const body = {
        code: code
      };
      fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      })
        .then((res) => res.json())
        .then((res) => {
          setGithubAccessToken(res.access_token);
        });
    }
  }, [code, isGithubAuthenticatedState]);

  // If githubAccessToken is defined and isGithubAuthenticatedState is false, update/insert the GitHub access token to Firestore
  useEffect(() => {
    if (githubAccessToken && !isGithubAuthenticatedState) {
      handleSubmitGithubAccessToken(uid, githubAccessToken);
      setIsGithubAuthenticatedState(true);
    }
  }, [githubAccessToken, isGithubAuthenticatedState, uid]);

  // If asanaCode is defined and isAsanaAuthenticatedState is false, call /api/get-asana-access-token to exchange the code for a Asana access token
  const [isAsanaAuthenticatedState, setIsAsanaAuthenticatedState] =
    useState(isAsanaAuthenticated);
  const [asanaAccessToken, setAsanaAccessToken] = useState('');
  const [asanaRefreshToken, setAsanaRefreshToken] = useState('');
  const [asanaUserId, setAsanaUserId] = useState('');
  useEffect(() => {
    if (asanaCode && !isAsanaAuthenticatedState) {
      const url = '/api/get-asana-access-token';
      const headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      const body = {
        grant_type: 'authorization_code',
        code: asanaCode,
        refresh_token: '' // No refresh tokens yet as this will be the first exchange here.
      };
      fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      })
        .then((res) => res.json())
        .then((res) => {
          setAsanaAccessToken(res.access_token);
          setAsanaRefreshToken(res.refresh_token);
          res.data?.id ? setAsanaUserId(res.data.id) : undefined;
        });
    }
  }, [asanaCode, isAsanaAuthenticatedState]);

  // If asanaAccessToken is defined and isAsanaAuthenticatedState is false, update/insert the access token to Firestore
  useEffect(() => {
    if (
      asanaAccessToken &&
      asanaRefreshToken &&
      asanaUserId &&
      !isAsanaAuthenticatedState
    ) {
      handleSubmitAsanaAccessToken(
        uid,
        asanaAccessToken,
        asanaUserId,
        asanaRefreshToken
      ).then(() => {
        setIsAsanaAuthenticatedState(true);
        alert('Asana and WorkStats are successfully connected.');
        window.location.replace(window.location.pathname);
      });
    }
  }, [
    asanaAccessToken,
    asanaRefreshToken,
    asanaUserId,
    isAsanaAuthenticatedState,
    uid
  ]);

  // If slackCode is defined and isSlackAuthenticatedState is false, call /api/get-slack-access-token to exchange the code for a Slack access token
  const [isSlackAuthenticatedState, setIsSlackAuthenticatedState] =
    useState(isSlackAuthenticated);
  const [slackAccessToken, setSlackAccessToken] = useState('');
  const [slackUserId, setSlackUserId] = useState('');
  const [slackWorkspaceName, setSlackWorkspaceName] = useState('');
  useEffect(() => {
    if (slackCode && !isSlackAuthenticatedState) {
      const url = '/api/get-slack-access-token';
      const headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      const body = {
        grant_type: 'authorization_code',
        code: slackCode
      };
      fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      })
        .then((res) => res.json())
        .then((res) => {
          setSlackAccessToken(res?.authed_user?.access_token);
          setSlackUserId(res?.authed_user?.id);
          setSlackWorkspaceName(res?.team?.name);
        });
    }
  }, [slackCode, isSlackAuthenticatedState]);

  // If slackAccessToken is defined and isSlackAuthenticatedState is false, update/insert the access token to Firestore
  useEffect(() => {
    if (
      slackAccessToken &&
      slackUserId &&
      slackWorkspaceName &&
      !isSlackAuthenticatedState
    ) {
      handleSubmitSlackAccessToken(
        uid,
        slackAccessToken,
        slackUserId,
        slackWorkspaceName
      ).then(() => {
        setIsSlackAuthenticatedState(true);
        alert('Slack and WorkStats are successfully connected.');
        window.location.replace(window.location.pathname);
      });
    }
  }, [
    slackAccessToken,
    slackUserId,
    isSlackAuthenticatedState,
    uid,
    slackWorkspaceName
  ]);

  // If googleAccessToken is defined and isGoogleAuthenticatedState is false, update/insert the access token to Firestore
  const [isGoogleAuthenticatedState, setIsGoogleAuthenticatedState] = useState(
    isGoogleAuthenticated
  );
  const [googleAccessToken, setGoogleAccessToken] = useState('');
  const [googleRefreshToken, setGoogleRefreshToken] = useState('');
  useEffect(() => {
    if (googleCode && !isGoogleAuthenticatedState) {
      const url = '/api/google-calendar/get-access-token';
      const headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      const body = {
        grant_type: 'authorization_code',
        code: googleCode,
        refresh_token: '' // No refresh tokens yet as this will be the first exchange here.
      };
      fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.access_token && res.refresh_token) {
            setGoogleAccessToken(res.access_token);
            setGoogleRefreshToken(res.refresh_token);
          }
        });
    }
  }, [googleCode, isGoogleAuthenticatedState]);

  useEffect(() => {
    if (
      googleAccessToken &&
      googleRefreshToken &&
      !isGoogleAuthenticatedState
    ) {
      handleSubmitGoogleAccessToken(
        uid,
        googleAccessToken,
        googleRefreshToken
      ).then(() => {
        setIsGoogleAuthenticatedState(true);
        alert('Google and WorkStats are successfully connected.');
        window.location.replace(window.location.pathname);
      });
    }
  }, [googleAccessToken, googleRefreshToken, isGoogleAuthenticatedState, uid]);

  const numberOfOnboardingTimes = userDoc?.productTour?.userSettings || 0;

  return (
    <>
      <Head>
        <title>User Settings - WorkStats</title>
        <meta
          name='description'
          content='This is the user settings page. You can set the users basic information, GitHub aggregation information, Asana aggregation information, Slack aggregation information, etc. You can also unsubscribe from this page.'
        />
      </Head>
      <div className='flex'>
        <div id='avatar' className='grid justify-items-center mt-5'>
          <Avatar userId={uid} />
          <button
            // type="submit"
            className='text-blue-500 hover:underline hover:underline-offset-4'
            onClick={() => {
              console.log('Change icon button was clicked');
            }}
          >
            Change
          </button>
        </div>
        <div id='basic-info' className='w-full'>
          <h2 className='text-xl mt-8 mb-2 ml-6 underline underline-offset-4'>
            Basic Information
          </h2>
          <form
            name='basic-info'
            onSubmit={(e) => handleSubmitBasicInfo(e, uid)}
            method='post'
            target='_self'
            autoComplete='off'
            className='flex flex-wrap'
          >
            <InputBox
              label={'First Name'}
              name={'firstName'}
              placeholder={'Oliver'}
              width={32}
              value={userDoc?.firstName}
            />
            <InputBox
              label={'Middle Name'}
              name={'middleName'}
              placeholder={'Alan'}
              width={36}
              value={userDoc?.middleName}
            />
            <InputBox
              label={'Last Name'}
              name={'lastName'}
              placeholder={'Smith'}
              width={36}
              value={userDoc?.lastName}
            />
            <InputBox
              label={'Company Name'}
              name={'companyName'}
              placeholder={'Suchica, Inc.'}
              width={36}
              value={userDoc?.companyName}
            />
            <InputBox
              label={'Department'}
              name={'department'}
              placeholder={'IT & Development'}
              width={96}
              value={userDoc?.department}
            />
            <InputBox
              label={'Rank'}
              name={'rank'}
              placeholder={'Director'}
              width={36}
              value={userDoc?.rank}
            />
            <InputBox
              label={'Supervisor'}
              name={'supervisor'}
              placeholder={'A name here'}
              width={36}
              value={userDoc?.supervisor}
            />
            <InputBox
              label={'Assessor'}
              name={'assessor'}
              placeholder={'A name here'}
              width={36}
              value={userDoc?.assessor}
            />
            <InputBox
              label={'Assigned Project'}
              name={'assignedPj'}
              placeholder={'New Business Development'}
              width={96}
              value={userDoc?.assignedPj}
            />
            <InputBox
              label={'Role'}
              name={'role'}
              placeholder={'Product Manager'}
              width={36}
              value={userDoc?.role}
            />
            <SubmitButton />
          </form>
        </div>
      </div>
      <div id='source-control'>
        <div className='flex'>
          <h2 className='text-xl mt-8 mb-2 ml-6 underline underline-offset-4'>
            Source Code / GitHub
          </h2>
          <QuestionMark mt={9} mb={1} href='/help/how-to-get-github-info' />
          {isGithubAuthenticatedState ? (
            <DisconnectWithGithubButton
              label='Disconnect with GitHub'
              uid={uid}
            />
          ) : (
            <RequestOAuthButton
              label='Connect with GitHub'
              handleClick={requestGithubUserIdentity}
            />
          )}
        </div>
        <form
          name='source-code'
          onSubmit={(e) => handleSubmitSourceCode(e, uid)}
          method='post'
          target='_self'
          autoComplete='off'
        >
          <div className='flex flex-wrap items-center'>
            <div className='ml-6 w-28'></div>
            <InputBox
              label={'User ID'}
              name={'githubUserId'}
              inputType={'number'}
              placeholder={'4620828'}
              width={36}
              value={userDoc?.github?.userId}
            />
            <InputBox
              label={'User Name'}
              name={'githubUserName'}
              placeholder={'oliversmith'}
              width={36}
              value={userDoc?.github?.userName}
            />
            <InputBox
              label={'Access Token'}
              name={'githubAccessToken'}
              placeholder={'No Access Token is set'}
              width={36}
              value={userDoc?.github?.accessToken}
              disabled={true}
              bgColor={'bg-gray-200'}
            />
          </div>
          <div className='flex flex-wrap items-center'>
            <h3 className='ml-6 w-28'>Repository 1 :</h3>
            <InputBox
              label={'Repo Owner Name'}
              name={'githubRepoOwner1'}
              placeholder={'octocat'}
              width={36}
              value={userDoc?.github?.repositories?.[0]?.owner}
            />
            <InputBox
              label={'Repo Name'}
              name={'githubRepo1'}
              placeholder={'hello-world'}
              width={36}
              value={userDoc?.github?.repositories?.[0]?.repo}
            />
            <InputBox
              label={'Repo Visibility'}
              name={'githubRepoVisibility1'}
              placeholder={'Public or Private'}
              width={36}
              value={userDoc?.github?.repositories?.[0]?.visibility}
            />
          </div>
          <div className='flex flex-wrap items-center'>
            <h3 className='ml-6 w-28'>Repository 2 :</h3>
            <InputBox
              label={'Repo Owner Name'}
              name={'githubRepoOwner2'}
              placeholder={'octocat'}
              width={36}
              value={userDoc?.github?.repositories?.[1]?.owner}
              disabled={true}
              bgColor={'bg-gray-200'}
            />
            <InputBox
              label={'Repo Name'}
              name={'githubRepo2'}
              placeholder={'hello-world'}
              width={36}
              value={userDoc?.github?.repositories?.[1]?.repo}
              disabled={true}
              bgColor={'bg-gray-200'}
            />
            <InputBox
              label={'Repo Visibility'}
              name={'githubRepoVisibility2'}
              placeholder={'Public or Private'}
              width={36}
              value={userDoc?.github?.repositories?.[1]?.visibility}
              disabled={true}
              bgColor={'bg-gray-200'}
            />
            <SubmitButton />
          </div>
        </form>
      </div>
      <div id='task-control'>
        <div className='flex'>
          <h2 className='text-xl mt-8 mb-2 ml-6 underline underline-offset-4'>
            Task Ticket / Asana
          </h2>
          <QuestionMark mt={9} mb={1} href='/help/how-to-get-asana-info' />
          {isAsanaAuthenticatedState ? (
            <DisconnectWithAsanaButton
              label='Disconnect with Asana'
              uid={uid}
              refreshToken={userDoc?.asana?.refreshToken}
            />
          ) : (
            <RequestOAuthButton
              label='Connect with Asana'
              handleClick={requestAsanaUserIdentity}
            />
          )}
        </div>
        <form
          name='task-ticket'
          onSubmit={(e) => handleSubmitTaskTicket(e, uid)}
          method='post'
          target='_self'
          autoComplete='off'
        >
          <div className='flex flex-wrap items-center'>
            <div className='ml-6 w-28'></div>
            <InputBox
              label={'User ID'}
              name={'asanaUserId'}
              inputType={'number'}
              placeholder={'1200781652740141'}
              width={48}
              value={userDoc?.asana?.userId}
            />
            <InputBox
              label={'Access Token'}
              name={'asanaAccessToken'}
              placeholder={'No Access Token is set'}
              width={36}
              value={userDoc?.asana?.accessToken}
              disabled={true}
              bgColor={'bg-gray-200'}
            />
            <InputBox
              label={'Refresh Token'}
              name={'asanaRefreshToken'}
              placeholder={'No Access Token is set'}
              width={36}
              value={userDoc?.asana?.refreshToken}
              disabled={true}
              bgColor={'bg-gray-200'}
            />
          </div>
          <div className='flex flex-wrap items-center'>
            <h3 className='ml-6 w-28'>Workspace 1 :</h3>
            <InputBox
              label={'Workspace ID'}
              name={'asanaWorkspaceId1'}
              inputType={'number'}
              placeholder={'1234567890123456'}
              width={48}
              value={userDoc?.asana?.workspace?.[0]?.workspaceId}
            />
            <InputBox
              label={'Workspace Name'}
              name={'asanaWorkspaceName1'}
              placeholder={'Suchica'}
              width={36}
              value={userDoc?.asana?.workspace?.[0]?.workspaceName}
            />
          </div>
          <div className='flex flex-wrap items-center'>
            <h3 className='ml-6 w-28'>Workspace 2 :</h3>
            <InputBox
              label={'Workspace ID'}
              name={'asanaWorkspaceId2'}
              inputType={'number'}
              placeholder={'1234567890123456'}
              width={48}
              value={userDoc?.asana?.workspace?.[1]?.workspaceId}
              disabled={true}
              bgColor={'bg-gray-200'}
            />
            <InputBox
              label={'Workspace Name'}
              name={'asanaWorkspaceName2'}
              placeholder={'Suchica'}
              width={36}
              value={userDoc?.asana?.workspace?.[1]?.workspaceName}
              disabled={true}
              bgColor={'bg-gray-200'}
            />
            <SubmitButton />
          </div>
        </form>
      </div>
      <div id='communication-activity-slack'>
        <div className='flex'>
          <h2 className='text-xl mt-8 mb-2 ml-6 underline underline-offset-4'>
            Communication Activity / Slack
          </h2>
          <QuestionMark mt={9} mb={1} href='/help/how-to-get-slack-info' />
          {isSlackAuthenticatedState ? (
            <DisconnectWithSlackButton
              label='Disconnect with Slack'
              uid={uid}
              accessToken={userDoc?.slack?.workspace?.[0]?.accessToken}
            />
          ) : (
            <RequestOAuthButton
              label='Connect with Slack'
              handleClick={requestSlackUserIdentity}
            />
          )}
        </div>
        <form
          name='communication-activity'
          onSubmit={(e) => handleSubmitCommunicationActivity(e, uid)}
          method='post'
          target='_self'
          autoComplete='off'
        >
          <div className='flex items-center'>
            <h3 className='ml-6 w-28'>Workspace 1 :</h3>
            <div className='flex flex-wrap'>
              <InputBox
                label={'Workspace Name'}
                name={'slackWorkspaceName1'}
                placeholder={'Suchica'}
                width={36}
                value={userDoc?.slack?.workspace?.[0]?.workspaceName}
                disabled={true}
                bgColor={'bg-gray-200'}
              />
              <InputBox
                label={'Member ID'}
                name={'slackWorkspaceMemberId1'}
                placeholder={'U02DK80DN9H'}
                width={36}
                value={userDoc?.slack?.workspace?.[0]?.memberId}
                disabled={true}
                bgColor={'bg-gray-200'}
              />
              <InputBox
                label={'Access Token'}
                name={'slackAccessToken1'}
                placeholder={'No Access Token is set'}
                width={36}
                value={userDoc?.slack?.workspace?.[0]?.accessToken}
                disabled={true}
                bgColor={'bg-gray-200'}
              />
            </div>
          </div>
          <div className='flex items-center'>
            <h3 className='ml-6 w-28'>Workspace 2 :</h3>
            <div className='flex flex-wrap'>
              <InputBox
                label={'Workspace Name'}
                name={'slackWorkspaceName2'}
                placeholder={'Suchica'}
                width={36}
                value={userDoc?.slack?.workspace?.[1]?.workspaceName}
                disabled={true}
                bgColor={'bg-gray-200'}
              />
              <InputBox
                label={'Member ID'}
                name={'slackWorkspaceMemberId2'}
                placeholder={'U02DK80DN9H'}
                width={36}
                value={userDoc?.slack?.workspace?.[1]?.memberId}
                disabled={true}
                bgColor={'bg-gray-200'}
              />
              <InputBox
                label={'Access Token'}
                name={'slackAccessToken2'}
                placeholder={'No Access Token is set'}
                width={36}
                value={userDoc?.slack?.workspace?.[1]?.accessToken}
                disabled={true}
                bgColor={'bg-gray-200'}
              />
            </div>
          </div>
        </form>
      </div>
      <div id='communication-activity-google'>
        <div className='flex'>
          <h2 className='text-xl mt-8 mb-2 ml-6 underline underline-offset-4'>
            Communication Activity / Google
          </h2>
          <QuestionMark mt={9} mb={1} href='/help/how-to-get-google-info' />
          {isGoogleAuthenticatedState ? (
            <DisconnectWithGoogleButton
              label='Disconnect with Google'
              uid={uid}
              accessToken={userDoc?.google?.workspace?.[0]?.accessToken}
            />
          ) : (
            <RequestGoogleOAuthButton
              label='Connect with Google'
              handleClick={requestGoogleUserIdentity}
            />
          )}
        </div>
        <form
          name='communication-activity-google'
          // onSubmit={}
          method='post'
          target='_self'
          autoComplete='off'
        >
          <div className='flex items-center'>
            <h3 className='ml-6 w-28'>Workspace 1 :</h3>
            <div className='flex flex-wrap'>
              <InputBox
                label={'Gmail'}
                name={'gmail1'}
                placeholder={'nishio.hiroshi@suchica.com'}
                width={36}
                value={userDoc?.google?.workspace?.[0]?.gmail}
                disabled={true}
                bgColor={'bg-gray-200'}
              />
              <InputBox
                label={'User Name'}
                name={'googleUserName1'}
                placeholder={'Hiroshi Nishio'}
                width={36}
                value={userDoc?.google?.workspace?.[0]?.userName}
                disabled={true}
                bgColor={'bg-gray-200'}
              />
              <InputBox
                label={'Access Token'}
                name={'googleAccessToken1'}
                placeholder={'No Access Token is set'}
                width={36}
                value={userDoc?.google?.workspace?.[0]?.accessToken}
                disabled={true}
                bgColor={'bg-gray-200'}
              />
              <InputBox
                label={'Refresh Token'}
                name={'googleRefreshToken1'}
                placeholder={'No Access Token is set'}
                width={36}
                value={userDoc?.google?.workspace?.[0]?.refreshToken}
                disabled={true}
                bgColor={'bg-gray-200'}
              />
            </div>
          </div>
        </form>
      </div>
      <div id='cancel-membership'>
        <div className='flex'>
          <Link href='/cancel-membership'>
            <a
              className='mr-3'
              target='_blank'
              rel='noreferrer noopener' // Must pair with target='_blank'
            >
              <button className='text-xl mt-8 mb-2 ml-6 underline underline-offset-4'>
                Cancel Membership
              </button>
            </a>
          </Link>
          <div className='mt-9 mb-1'>
            <Image
              src={NewTabIcon}
              width={24}
              height={24}
              layout='intrinsic'
              alt='Open a new tab'
              quality={75}
              priority={false}
              placeholder='empty'
            />
          </div>
        </div>
        <p className='py-1 ml-6'>
          If you wish to cancel your membership to this service, please follow
          this link.
        </p>
      </div>
      <div className='h-20'></div>
      <Onboarding
        docId={uid}
        // @ts-ignore
        steps={Steps}
        productTourName={'userSettings'}
        numberOfOnboardingTimes={numberOfOnboardingTimes}
      />
    </>
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
      // console.log('try catch error', e);
      return { props: {} };
    }
  } else {
    // console.log('cookies.token is falsy');
    return { props: {} as never };
  }
};

useUserSettings.requiresAuth = true;
