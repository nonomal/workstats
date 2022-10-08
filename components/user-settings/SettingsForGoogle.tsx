// Libraries
import { useEffect, useState } from 'react';

// Components
import InputBox from '../../components/boxes/InputBox';
import QuestionMark from '../../components/common/QuestionMark';
import DisconnectWithGoogleButton from '../../components/buttons/DisconnectWithGoogleButton';
import RequestGoogleOAuthButton from '../../components/buttons/RequestGoogleOAuthButton';

// Services and Configs
import { handleSubmitGoogleAccessToken } from '../../services/setDocToFirestore';
import { requestGoogleUserIdentity } from '../../services/googleCalendar.client';
import { UserType } from '../../config/firebaseTypes';

interface SettingsForGoogleProps {
  uid: string;
  userDocState: UserType;
  isGoogleAuthenticated: boolean;
}

const SettingsForGoogle = ({
  uid,
  userDocState,
  isGoogleAuthenticated
}: SettingsForGoogleProps) => {
  // If a user click 'Connect with xxxxx' button to agree to authenticate WorkStats with xxxxx scopes, a code will be passed to the redirect URL.
  const htmlParams = window.location.search;
  const googleCode = htmlParams.startsWith('?google=')
    ? decodeURIComponent(htmlParams.split(/[=&]+/)[5]) // ['google', 'true', 'state', 'stateValue', 'code', 'codeValue', 'scope', 'scopeValue']
    : undefined;

  // If googleAccessToken is defined and isGoogleAuthenticatedState is false, update/insert the access token to Firestore
  const [userDoc, setUserDoc] = useState<UserType>(userDocState);
  const [isGoogleAuthenticatedState, setIsGoogleAuthenticatedState] = useState(
    isGoogleAuthenticated
  );
  useEffect(() => {
    if (userDocState) setUserDoc(userDocState);
    setIsGoogleAuthenticatedState(isGoogleAuthenticated);
  }, [isGoogleAuthenticated, userDocState]);
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

        // Remove the code from the URL without reloading the page
        window.history.replaceState(
          {}, // state object
          document.title, // 'User Settings - WorkStats' in this case
          window.location.pathname // '/user-settings' in this case
        );
      });
    }
  }, [googleAccessToken, googleRefreshToken, isGoogleAuthenticatedState, uid]);

  return (
    <div id='google'>
      <div className='h-9 md:h-10'></div>
      <div className='flex flex-wrap'>
        <h2 className='text-xl mb-2 md:mb-0 ml-2 md:ml-3 pl-1 underline underline-offset-4'>
          Communication Activity / Google
        </h2>
        <QuestionMark mt={1} mb={1} href='/help/how-to-get-google-info' />
        {isGoogleAuthenticatedState ? (
          <DisconnectWithGoogleButton
            label='Disconnect with Google'
            uid={uid}
            accessToken={userDoc?.google?.workspace?.[0]?.accessToken}
            setState={setGoogleAccessToken}
          />
        ) : (
          <RequestGoogleOAuthButton
            label='Connect with Google'
            handleClick={requestGoogleUserIdentity}
          />
        )}
      </div>
      <p className='py-1 ml-3 pl-1'>
        Follow the steps below to tally your numbers.
      </p>
      <ol className='py-1 ml-3 pl-1 list-decimal list-inside' role='list'>
        <li key={1}>Press the &quot;Connect with Google&quot; button.</li>
        <li key={2}>
          According to the dialog, login to Google, check the scopes and
          authenticate them.
        </li>
        <li key={3}>
          You may have logged into this WorkStats with Google in the first
          place, but the login and aggregation are managed separately.
          Therefore, it is possible to aggregate with a different Google account
          than the one used for login.
        </li>
      </ol>
      <form
        name='communication-activity-google'
        // onSubmit={}
        method='post'
        target='_self'
        autoComplete='off'
      >
        <h3 className='md:hidden text-lg ml-2 pl-1 w-32 underline underline-offset-1'>
          Workspace 1 :
        </h3>
        <div className='h-3 md:h-0'></div>
        <div className='flex items-center'>
          <h3 className='hidden md:block md:ml-6 md:w-28'>Workspace 1 :</h3>
          <div className='flex flex-wrap'>
            {/* <InputBox
              label={'Gmail'}
              name={'gmail1'}
              placeholder={'nishio.hiroshi@suchica.com'}
              value={userDoc?.google?.workspace?.[0]?.gmail}
              disabled={true}
              bgColor={'bg-gray-200'}
            />
            <InputBox
              label={'User Name'}
              name={'googleUserName1'}
              placeholder={'Hiroshi Nishio'}
              value={userDoc?.google?.workspace?.[0]?.userName}
              disabled={true}
              bgColor={'bg-gray-200'}
            /> */}
            <InputBox
              label={'Access Token'}
              name={'googleAccessToken1'}
              placeholder={'No Access Token is set'}
              value={userDoc?.google?.workspace?.[0]?.accessToken}
              disabled={true}
              bgColor={'bg-gray-200'}
            />
            <InputBox
              label={'Refresh Token'}
              name={'googleRefreshToken1'}
              placeholder={'No Access Token is set'}
              value={userDoc?.google?.workspace?.[0]?.refreshToken}
              disabled={true}
              bgColor={'bg-gray-200'}
            />
          </div>
        </div>
      </form>
      <p className='py-1 ml-3 pl-1'>
        Press &quot;Disconnect with Google&quot; to disconnect at any time. If
        you have any concerns or requests, please feel free to ask us through
        the &quot;Contact Us&quot; link in the side menu.
      </p>
    </div>
  );
};

export default SettingsForGoogle;
