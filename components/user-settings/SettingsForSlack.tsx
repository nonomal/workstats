// Libraries
import { useEffect, useState } from 'react';

// Components
import InputBox from '../../components/boxes/InputBox';
import QuestionMark from '../../components/common/QuestionMark';
import RequestOAuthButton from '../../components/buttons/RequestOAuthButton';
import DisconnectWithSlackButton from '../../components/buttons/DisconnectWithSlackButton';

// Services and Configs
import {
  handleSubmitCommunicationActivity,
  handleSubmitSlackAccessToken
} from '../../services/setDocToFirestore';
import { requestSlackUserIdentity } from '../../services/slackServices.client';
import { UserType } from '../../config/firebaseTypes';

interface SettingsForSlackProps {
  uid: string;
  userDoc: UserType | null;
  isSlackAuthenticated: boolean;
}

const SettingsForSlack = ({
  uid,
  userDoc,
  isSlackAuthenticated
}: SettingsForSlackProps) => {
  // If a user click 'Connect with xxxxx' button to agree to authenticate WorkStats with xxxxx scopes, a code will be passed to the redirect URL.
  const htmlParams = window.location.search;
  const slackCode = htmlParams.startsWith('?slack=')
    ? decodeURIComponent(htmlParams.split(/[=&]+/)[3]) // ['slack', 'true', 'code', 'codeValue']
    : undefined;

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

  return (
    <div id='communication-activity-slack'>
      <div className='h-9 md:h-10'></div>
      <div className='flex flex-wrap'>
        <h2 className='text-xl mb-2 md:mb-0 ml-2 md:ml-3 pl-1 underline underline-offset-4'>
          Communication Activity / Slack
        </h2>
        <QuestionMark mt={1} mb={1} href='/help/how-to-get-slack-info' />
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
        <div className='h-3 md:h-3'></div>
        <h3 className='md:hidden text-lg ml-2 pl-1 w-32 underline underline-offset-1'>
          Workspace 1 :
        </h3>
        <div className='h-3 md:h-0'></div>
        <div className='flex flex-wrap items-center'>
          <h3 className='hidden md:block md:ml-6 md:w-28'>Workspace 1 :</h3>
          <div className='flex flex-wrap'>
            <InputBox
              label={'Workspace Name'}
              name={'slackWorkspaceName1'}
              placeholder={'Suchica'}
              value={userDoc?.slack?.workspace?.[0]?.workspaceName}
              disabled={true}
              bgColor={'bg-gray-200'}
            />
            <InputBox
              label={'Member ID'}
              name={'slackWorkspaceMemberId1'}
              placeholder={'U02DK80DN9H'}
              value={userDoc?.slack?.workspace?.[0]?.memberId}
              disabled={true}
              bgColor={'bg-gray-200'}
            />
            <InputBox
              label={'Access Token'}
              name={'slackAccessToken1'}
              placeholder={'No Access Token is set'}
              value={userDoc?.slack?.workspace?.[0]?.accessToken}
              disabled={true}
              bgColor={'bg-gray-200'}
            />
          </div>
        </div>
        <div className='h-3 md:h-0'></div>
        <h3 className='md:hidden text-lg ml-2 pl-1 w-32 underline underline-offset-1'>
          Workspace 2 :
        </h3>
        <div className='h-3 md:h-0'></div>
        <div className='flex flex-wrap items-center'>
          <h3 className='hidden md:block md:ml-6 md:w-28'>Workspace 2 :</h3>
          <div className='flex flex-wrap'>
            <InputBox
              label={'Workspace Name'}
              name={'slackWorkspaceName2'}
              placeholder={'Suchica'}
              value={userDoc?.slack?.workspace?.[1]?.workspaceName}
              disabled={true}
              bgColor={'bg-gray-200'}
            />
            <InputBox
              label={'Member ID'}
              name={'slackWorkspaceMemberId2'}
              placeholder={'U02DK80DN9H'}
              value={userDoc?.slack?.workspace?.[1]?.memberId}
              disabled={true}
              bgColor={'bg-gray-200'}
            />
            <InputBox
              label={'Access Token'}
              name={'slackAccessToken2'}
              placeholder={'No Access Token is set'}
              value={userDoc?.slack?.workspace?.[1]?.accessToken}
              disabled={true}
              bgColor={'bg-gray-200'}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default SettingsForSlack;
