// Libraries
import { useEffect, useState } from 'react';

// Components
import InputBox from '../../components/boxes/InputBox';
import SubmitButton from '../../components/buttons/SubmitButton';
import QuestionMark from '../../components/common/QuestionMark';
import RequestOAuthButton from '../../components/buttons/RequestOAuthButton';
import DisconnectWithAsanaButton from '../../components/buttons/DisconnectWithAsanaButton';

// Services and Configs
import {
  handleSubmitAsanaAccessToken,
  handleSubmitTaskTicket
} from '../../services/setDocToFirestore';
import {
  getWorkspaces,
  requestAsanaUserIdentity
} from '../../services/asanaServices.client';
import { UserType } from '../../config/firebaseTypes';

interface SettingsForAsanaProps {
  uid: string;
  userDocState: UserType;
  isAsanaAuthenticated: boolean;
}

const SettingsForAsana = ({
  uid,
  userDocState,
  isAsanaAuthenticated
}: SettingsForAsanaProps) => {
  // If a user click 'Connect with xxxxx' button to agree to authenticate WorkStats with xxxxx scopes, a code will be passed to the redirect URL.
  const htmlParams = window.location.search;
  const asanaCode = htmlParams.startsWith('?asana=')
    ? decodeURIComponent(htmlParams.split(/[=&]+/)[3]) // ['asana', 'true', 'code', 'codeValue']
    : undefined;

  // If asanaCode is defined and isAsanaAuthenticatedState is false, call /api/get-asana-access-token to exchange the code for a Asana access token
  const [userDoc, setUserDoc] = useState<UserType>(userDocState);
  const [isAsanaAuthenticatedState, setIsAsanaAuthenticatedState] =
    useState(isAsanaAuthenticated);
  useEffect(() => {
    if (userDocState) setUserDoc(userDocState);
    setIsAsanaAuthenticatedState(isAsanaAuthenticated);
  }, [isAsanaAuthenticated, userDocState]);
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

        // Remove the code from the URL without reloading the page
        window.history.replaceState(
          {}, // state object
          document.title, // 'User Settings - WorkStats' in this case
          window.location.pathname // '/user-settings' in this case
        );
      });
    }
  }, [
    asanaAccessToken,
    asanaRefreshToken,
    asanaUserId,
    isAsanaAuthenticatedState,
    uid
  ]);

  // List Asana Workspaces for the user to choose
  const [asanaWorkspaces, setAsanaWorkspaces] = useState<string[]>([]);
  useEffect(() => {
    if (uid && userDoc?.asana?.accessToken && userDoc?.asana?.refreshToken) {
      getWorkspaces(
        uid,
        userDoc?.asana?.accessToken,
        userDoc?.asana?.refreshToken
      )
        .then((res) => {
          const workspaces = res.data.map((workspace) => workspace.name);
          return workspaces;
        })
        .then((workspaces) => {
          setAsanaWorkspaces(workspaces);
        });
    }
  }, [uid, userDoc?.asana?.accessToken, userDoc?.asana?.refreshToken]);

  return (
    <div id='asana'>
      <div className='h-9 md:h-10'></div>
      <div className='flex flex-wrap'>
        <h2 className='text-xl mb-2 md:mb-0 ml-2 md:ml-3 pl-1 underline underline-offset-4'>
          Task Ticket / Asana
        </h2>
        <QuestionMark mt={1} mb={1} href='/help/how-to-get-asana-info' />
        {isAsanaAuthenticatedState ? (
          <DisconnectWithAsanaButton
            label='Disconnect with Asana'
            uid={uid}
            refreshToken={userDoc?.asana?.refreshToken}
            setState={setAsanaAccessToken}
          />
        ) : (
          <RequestOAuthButton
            label='Connect with Asana'
            handleClick={requestAsanaUserIdentity}
          />
        )}
      </div>
      <p className='py-1 ml-3 pl-1'>
        Follow the steps below to tally your numbers.
      </p>
      <ol className='py-1 ml-3 pl-1 list-decimal list-inside' role='list'>
        <li key={1}>Press the &quot;Connect with Asana&quot; button.</li>
        <li key={2}>
          According to the dialog, login to Asana, check the scopes and
          authenticate them.
        </li>
        <li key={3}>Register a workspace you want to aggregate below.</li>
      </ol>
      <form
        name='task-ticket'
        onSubmit={(e) => handleSubmitTaskTicket(e, uid)}
        method='post'
        target='_self'
        autoComplete='off'
      >
        <div className='flex flex-wrap items-center'>
          <div className='md:ml-6 md:w-28'></div>
          <InputBox
            label={'User ID'}
            name={'asanaUserId'}
            inputType={'number'}
            placeholder={'1200781652740141'}
            value={userDoc?.asana?.userId}
            disabled={true}
            bgColor={'bg-gray-200'}
          />
          <InputBox
            label={'Access Token'}
            name={'asanaAccessToken'}
            placeholder={'No Access Token is set'}
            value={userDoc?.asana?.accessToken}
            disabled={true}
            bgColor={'bg-gray-200'}
          />
          <InputBox
            label={'Refresh Token'}
            name={'asanaRefreshToken'}
            placeholder={'No Access Token is set'}
            value={userDoc?.asana?.refreshToken}
            disabled={true}
            bgColor={'bg-gray-200'}
          />
        </div>
        <div className='h-3 md:h-0'></div>
        <h3 className='md:hidden text-lg ml-2 pl-1 w-32 underline underline-offset-1'>
          Workspace 1 :
        </h3>
        <div className='h-3 md:h-0'></div>
        <div className='flex flex-wrap items-center'>
          <h3 className='hidden md:block md:ml-6 md:w-28'>Workspace 1 :</h3>
          <InputBox
            label={'Workspace ID'}
            name={'asanaWorkspaceId1'}
            inputType={'number'}
            placeholder={'1234567890123456'}
            value={userDoc?.asana?.workspace?.[0]?.workspaceId}
            disabled={true}
            bgColor={'bg-gray-200'}
          />
          <InputBox
            label={'Workspace Name'}
            name={'asanaWorkspaceName1'}
            placeholder={'Suchica'}
            value={userDoc?.asana?.workspace?.[0]?.workspaceName}
            listValues={asanaWorkspaces}
          />
        </div>
        <div className='h-3 md:h-0'></div>
        <h3 className='md:hidden text-lg ml-2 pl-1 w-32 underline underline-offset-1'>
          Workspace 2 :
        </h3>
        <div className='h-3 md:h-0'></div>
        <div className='flex flex-wrap items-center'>
          <h3 className='hidden md:block md:ml-6 md:w-28'>Workspace 2 :</h3>
          <InputBox
            label={'Workspace ID'}
            name={'asanaWorkspaceId2'}
            inputType={'number'}
            placeholder={'1234567890123456'}
            value={userDoc?.asana?.workspace?.[1]?.workspaceId}
            disabled={true}
            bgColor={'bg-gray-200'}
          />
          <InputBox
            label={'Workspace Name'}
            name={'asanaWorkspaceName2'}
            placeholder={'Suchica'}
            value={userDoc?.asana?.workspace?.[1]?.workspaceName}
            disabled={true}
            bgColor={'bg-gray-200'}
          />
          <div className='ml-2 md:ml-1 pl-1 md:pl-3'></div>
          <SubmitButton />
        </div>
      </form>
      <p className='py-1 ml-3 pl-1'>
        Press &quot;Disconnect with Asana&quot; to disconnect at any time. If
        you have any concerns or requests, please feel free to ask us through
        the &quot;Contact Us&quot; link in the side menu.
      </p>
    </div>
  );
};

export default SettingsForAsana;
