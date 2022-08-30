// Libraries
import { useEffect, useState } from 'react';

// Components
import InputBox from '../../components/boxes/InputBox';
import SubmitButton from '../../components/buttons/SubmitButton';
import QuestionMark from '../../components/common/QuestionMark';
import RequestOAuthButton from '../../components/buttons/RequestOAuthButton';
import DisconnectWithGithubButton from '../../components/buttons/DisconnectWithGithubButton';

// Services and Configs
import {
  handleSubmitGithubAccessToken,
  handleSubmitSourceCode
} from '../../services/setDocToFirestore';
import { requestGithubUserIdentity } from '../../services/githubServices.client';
import { UserType } from '../../config/firebaseTypes';

interface SettingsForGitHubProps {
  uid: string;
  userDoc: UserType | null;
  isGithubAuthenticated: boolean;
}

const SettingsForGitHub = ({
  uid,
  userDoc,
  isGithubAuthenticated
}: SettingsForGitHubProps) => {
  // If a user click 'Connect with xxxxx' button to agree to authenticate WorkStats with xxxxx scopes, a code will be passed to the redirect URL.
  const htmlParams = window.location.search;
  const code = htmlParams.startsWith('?code=')
    ? htmlParams.split(/[=&]+/)[1] // split by '=' or '&'
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

  return (
    <div id='source-control'>
      <div className='h-9 md:h-10'></div>
      <div className='flex flex-wrap'>
        <h2 className='text-xl mb-2 md:mb-0 ml-2 md:ml-3 pl-1 underline underline-offset-4'>
          Source Code / GitHub
        </h2>
        <QuestionMark mt={1} mb={1} href='/help/how-to-get-github-info' />
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
        <div className='h-3 md:h-3'></div>
        <div className='flex flex-wrap items-center'>
          <div className='md:ml-6 md:w-28'></div>
          <InputBox
            label={'User ID'}
            name={'githubUserId'}
            inputType={'number'}
            placeholder={'4620828'}
            value={userDoc?.github?.userId}
          />
          <InputBox
            label={'User Name'}
            name={'githubUserName'}
            placeholder={'oliversmith'}
            value={userDoc?.github?.userName}
          />
          <InputBox
            label={'Access Token'}
            name={'githubAccessToken'}
            placeholder={'No Access Token is set'}
            value={userDoc?.github?.accessToken}
            disabled={true}
            bgColor={'bg-gray-200'}
          />
        </div>
        <div className='h-3 md:h-0'></div>
        <h3 className='md:hidden text-lg ml-2 pl-1 w-32 underline underline-offset-1'>
          Repository 1 :
        </h3>
        <div className='h-3 md:h-0'></div>
        <div className='flex flex-wrap items-center'>
          <h3 className='hidden md:block md:ml-6 md:w-28'>Repository 1 :</h3>
          <InputBox
            label={'Repo Owner Name'}
            name={'githubRepoOwner1'}
            placeholder={'octocat'}
            value={userDoc?.github?.repositories?.[0]?.owner}
          />
          <InputBox
            label={'Repo Name'}
            name={'githubRepo1'}
            placeholder={'hello-world'}
            value={userDoc?.github?.repositories?.[0]?.repo}
          />
          <InputBox
            label={'Repo Visibility'}
            name={'githubRepoVisibility1'}
            placeholder={'Public or Private'}
            value={userDoc?.github?.repositories?.[0]?.visibility}
          />
        </div>
        <div className='h-3 md:h-0'></div>
        <h3 className='md:hidden text-lg ml-2 pl-1 w-32 underline underline-offset-1'>
          Repository 2 :
        </h3>
        <div className='h-3 md:h-0'></div>
        <div className='flex flex-wrap items-center'>
          <h3 className='hidden md:block md:ml-6 md:w-28'>Repository 2 :</h3>
          <InputBox
            label={'Repo Owner Name'}
            name={'githubRepoOwner2'}
            placeholder={'octocat'}
            value={userDoc?.github?.repositories?.[1]?.owner}
            disabled={true}
            bgColor={'bg-gray-200'}
          />
          <InputBox
            label={'Repo Name'}
            name={'githubRepo2'}
            placeholder={'hello-world'}
            value={userDoc?.github?.repositories?.[1]?.repo}
            disabled={true}
            bgColor={'bg-gray-200'}
          />
          <InputBox
            label={'Repo Visibility'}
            name={'githubRepoVisibility2'}
            placeholder={'Public or Private'}
            value={userDoc?.github?.repositories?.[1]?.visibility}
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

export default SettingsForGitHub;
