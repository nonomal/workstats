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
import { requestAsanaUserIdentity } from '../../services/asanaServices.client';
import { UserType } from '../../config/firebaseTypes';

interface SettingsForAsanaProps {
  uid: string;
  userDoc: UserType | null;
  isAsanaAuthenticated: boolean;
}

const SettingsForAsana = ({
  uid,
  userDoc,
  isAsanaAuthenticated
}: SettingsForAsanaProps) => {
  // If a user click 'Connect with xxxxx' button to agree to authenticate WorkStats with xxxxx scopes, a code will be passed to the redirect URL.
  const htmlParams = window.location.search;
  const asanaCode = htmlParams.startsWith('?asana=')
    ? decodeURIComponent(htmlParams.split(/[=&]+/)[3]) // ['asana', 'true', 'code', 'codeValue']
    : undefined;

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

  return (
    <div id='task-control'>
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
        <div className='h-3 md:h-3'></div>
        <div className='flex flex-wrap items-center'>
          <div className='md:ml-6 md:w-28'></div>
          <InputBox
            label={'User ID'}
            name={'asanaUserId'}
            inputType={'number'}
            placeholder={'1200781652740141'}
            value={userDoc?.asana?.userId}
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
          />
          <InputBox
            label={'Workspace Name'}
            name={'asanaWorkspaceName1'}
            placeholder={'Suchica'}
            value={userDoc?.asana?.workspace?.[0]?.workspaceName}
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
    </div>
  );
};

export default SettingsForAsana;
