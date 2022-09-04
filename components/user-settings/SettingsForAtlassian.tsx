// Libraries
import { useEffect, useState } from 'react';

// Components
import InputBox from '../../components/boxes/InputBox';
import QuestionMark from '../../components/common/QuestionMark';
import RequestOAuthButton from '../../components/buttons/RequestOAuthButton';
import DisconnectWithAtlassianButton from '../../components/buttons/DisconnectWithAtlassianButton';

// Services and Configs
import { handleSubmitAtlassianAccessToken } from '../../services/setDocToFirestore';
import { requestAtlassianUserIdentity } from '../../services/atlassianServices.client';
import { UserType } from '../../config/firebaseTypes';

interface SettingsForAtlassianProps {
  uid: string;
  userDoc: UserType | null;
  isAtlassianAuthenticated: boolean;
}

const SettingsForAtlassian = ({
  uid,
  userDoc,
  isAtlassianAuthenticated
}: SettingsForAtlassianProps) => {
  // If a user click 'Connect with xxxxx' button to agree to authenticate WorkStats with xxxxx scopes, a code will be passed to the redirect URL.
  const htmlParams = window.location.search;
  const atlassianCode = htmlParams.startsWith('?atlassian=')
    ? decodeURIComponent(htmlParams.split(/[=&]+/)[3]) // ['atlassian', 'true', 'code', 'codeValue']
    : undefined;

  // If atlassianCode is defined and isAtlassianAuthenticatedState is false, call /api/get-atlassian-access-token to exchange the code for an Atlassian access token
  const [isAtlassianAuthenticatedState, setIsAtlassianAuthenticatedState] =
    useState(isAtlassianAuthenticated);
  const [atlassianAccessToken, setAtlassianAccessToken] = useState('');
  const [atlassianRefreshToken, setAtlassianRefreshToken] = useState('');
  const [atlassianAccountId, setAtlassianAccountId] = useState('');
  const [atlassianCloudId, setAtlassianCloudId] = useState(''); // Like '11223344-a1b2-3b33-c444-def123456789'
  const [atlassianCloudName, setAtlassianCloudName] = useState('');

  // Exchange authorization code for access token; https://developer.atlassian.com/cloud/confluence/oauth-2-3lo-apps/#2--exchange-authorization-code-for-access-token
  useEffect(() => {
    if (atlassianCode && !isAtlassianAuthenticatedState) {
      const urlForAccessToken = '/api/atlassian/get-access-token';
      const headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      const bodyForAccessToken = {
        grant_type: 'authorization_code', // Because this is the very first time.
        code: atlassianCode
        // refresh_token: '' // No refresh tokens yet as this will be the first exchange here.
      };
      fetch(urlForAccessToken, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(bodyForAccessToken)
      })
        .then((res) => res.json())
        .then((res) => {
          setAtlassianAccessToken(res.access_token);
          setAtlassianRefreshToken(res.refresh_token);
        });
    }
  }, [atlassianCode, isAtlassianAuthenticatedState]);

  // Get Cloud ID and Cloud Name after exchanging the code for an access token
  // Cloud ID is like Organization ID such as '11223344-a1b2-3b33-c444-def123456789'
  useEffect(() => {
    if (atlassianAccessToken) {
      // Get Cloud ID for the Atlassian site, and Account ID for the user
      const urlForCloudId = '/api/atlassian/get-cloud-id';
      const urlForAccountId = '/api/atlassian/get-account-id';
      const headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      const body = {
        access_token: atlassianAccessToken
      };

      // Get Account ID
      fetch(urlForAccountId, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      })
        .then((res) => res.json())
        .then((res) => {
          setAtlassianAccountId(res.account_id);
        });

      // Get Cloud ID
      fetch(urlForCloudId, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      })
        .then((res) => res.json())
        .then((res) => {
          setAtlassianCloudId(res[0].id);
          setAtlassianCloudName(res[0].name);
        });
    }
  }, [atlassianAccessToken]);

  // If atlassianAccessToken is defined and isAtlassianAuthenticatedState is false, update/insert the access token to Firestore
  useEffect(() => {
    if (
      atlassianAccessToken &&
      atlassianRefreshToken &&
      atlassianAccountId &&
      atlassianCloudId &&
      atlassianCloudName &&
      !isAtlassianAuthenticatedState
    ) {
      handleSubmitAtlassianAccessToken(
        uid,
        atlassianAccessToken,
        atlassianAccountId,
        atlassianCloudId,
        atlassianCloudName,
        atlassianRefreshToken
      ).then(() => {
        setIsAtlassianAuthenticatedState(true);
        alert('Jira (Atlassian) and WorkStats are successfully connected.');
        window.location.replace(window.location.pathname);
      });
    }
  }, [
    atlassianAccessToken,
    atlassianRefreshToken,
    atlassianAccountId,
    atlassianCloudId,
    atlassianCloudName,
    isAtlassianAuthenticatedState,
    uid
  ]);

  return (
    <div id='task-control-atlassian'>
      <div className='h-9 md:h-10'></div>
      <div className='flex flex-wrap'>
        <h2 className='text-xl mb-2 md:mb-0 ml-2 md:ml-3 pl-1 underline underline-offset-4'>
          Task Ticket / Jira (Atlassian)
        </h2>
        <QuestionMark mt={1} mb={1} href='/help/how-to-get-atlassian-info' />
        {isAtlassianAuthenticatedState ? (
          <DisconnectWithAtlassianButton
            label='Disconnect with Atlassian'
            uid={uid}
          />
        ) : (
          <RequestOAuthButton
            label='Connect with Atlassian'
            handleClick={() => requestAtlassianUserIdentity(uid)}
          />
        )}
      </div>
      <div className='h-3 md:h-3'></div>
      <div className='flex flex-wrap items-center'>
        <div className='md:ml-6 md:w-32'></div>
        <InputBox
          label={'Account ID'}
          name={'atlassianAccountId'}
          placeholder={'62bba557118b20bee2bba1ff'}
          value={userDoc?.atlassian?.accountId}
          disabled={true}
          bgColor={'bg-gray-200'}
        />
        <InputBox
          label={'Access Token'}
          name={'atlassianAccessToken'}
          placeholder={'No Access Token is set'}
          value={userDoc?.atlassian?.accessToken}
          disabled={true}
          bgColor={'bg-gray-200'}
        />
        <InputBox
          label={'Refresh Token'}
          name={'atlassianRefreshToken'}
          placeholder={'No Access Token is set'}
          value={userDoc?.atlassian?.refreshToken}
          disabled={true}
          bgColor={'bg-gray-200'}
        />
      </div>
      <div className='h-3 md:h-0'></div>
      <h3 className='md:hidden text-lg ml-2 pl-1 w-36 underline underline-offset-1'>
        Organization 1 :
      </h3>
      <div className='h-3 md:h-0'></div>
      <div className='flex flex-wrap items-center'>
        <h3 className='hidden md:block md:ml-6 md:w-32'>Organization 1 :</h3>
        <InputBox
          label={'Organization ID'}
          name={'atlassianOrganizationId1'}
          placeholder={'2j71d062-0k11-119j-j0a8-d2d4d8dd3cc4'}
          value={userDoc?.atlassian?.organization?.[0]?.organizationId}
          disabled={true}
          bgColor={'bg-gray-200'}
        />
        <InputBox
          label={'Organization Name'}
          name={'atlassianOrganizationName1'}
          placeholder={'suchica'}
          value={userDoc?.atlassian?.organization?.[0]?.organizationName}
          disabled={true}
          bgColor={'bg-gray-200'}
        />
      </div>
      <div className='h-3 md:h-0'></div>
      <h3 className='md:hidden text-lg ml-2 pl-1 w-36 underline underline-offset-1'>
        Organization 2 :
      </h3>
      <div className='h-3 md:h-0'></div>
      <div className='flex flex-wrap items-center'>
        <h3 className='hidden md:block md:ml-6 md:w-32'>Organization 2 :</h3>
        <InputBox
          label={'Organization ID'}
          name={'atlassianOrganizationId2'}
          placeholder={'2j71d062-0k11-119j-j0a8-d2d4d8dd3cc4'}
          value={userDoc?.atlassian?.organization?.[1]?.organizationId}
          disabled={true}
          bgColor={'bg-gray-200'}
        />
        <InputBox
          label={'Organization Name'}
          name={'atlassianOrganizationName2'}
          placeholder={'suchica'}
          value={userDoc?.atlassian?.organization?.[1]?.organizationName}
          disabled={true}
          bgColor={'bg-gray-200'}
        />
        <div className='ml-2 md:ml-1 pl-1 md:pl-3'></div>
      </div>
    </div>
  );
};

export default SettingsForAtlassian;
