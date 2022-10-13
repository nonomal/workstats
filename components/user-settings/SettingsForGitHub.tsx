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
import {
  GetTheAuthenticatedUser,
  ListRepositoriesForTheAuthenticatedUser,
  requestGithubUserIdentity
} from '../../services/githubServices.client';
import { UserType } from '../../config/firebaseTypes';
import { FieldValue } from 'firebase/firestore';

interface SettingsForGitHubProps {
  uid: string;
  userDocState: UserType;
  isGithubAuthenticated: boolean;
}

const SettingsForGitHub = ({
  uid,
  userDocState,
  isGithubAuthenticated
}: SettingsForGitHubProps) => {
  // If a user click 'Connect with xxxxx' button to agree to authenticate WorkStats with xxxxx scopes, a code will be passed to the redirect URL.
  const htmlParams = window.location.search;
  const code = htmlParams.startsWith('?code=')
    ? htmlParams.split(/[=&]+/)[1] // split by '=' or '&'
    : undefined;

  // Initialize states
  const [userDoc, setUserDoc] = useState<UserType>(userDocState);
  const [createdAt, setCreatedAt] = useState<FieldValue | undefined>(undefined);
  const [isGithubAuthenticatedState, setIsGithubAuthenticatedState] = useState(
    isGithubAuthenticated
  );
  useEffect(() => {
    if (userDocState) setUserDoc(userDocState);
    if (userDocState?.github?.createdAt)
      setCreatedAt(userDocState.github.createdAt);
    setIsGithubAuthenticatedState(isGithubAuthenticated);
  }, [isGithubAuthenticated, userDocState]);
  const [githubAccessToken, setGithubAccessToken] = useState('');
  const [owner1, setOwner1] = useState<string[]>([]);
  const [repo1, setRepo1] = useState<string[]>([]);

  // If code is defined and isGithubAuthenticatedState is false, call /api/get-github-access-token to exchange the code for a GitHub access token
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

          // Remove the code from the URL without reloading the page
          window.history.replaceState(
            {}, // state object
            document.title, // 'User Settings - WorkStats' in this case
            window.location.pathname // '/user-settings' in this case
          );
        });
    }
  }, [code, isGithubAuthenticatedState]);

  // If githubAccessToken is defined and isGithubAuthenticatedState is false, update/insert the GitHub access token to Firestore
  useEffect(() => {
    if (githubAccessToken && !isGithubAuthenticatedState) {
      GetTheAuthenticatedUser(githubAccessToken).then((res) => {
        handleSubmitGithubAccessToken(
          uid,
          githubAccessToken,
          res.id,
          res.login,
          createdAt
        );
      });
    }
  }, [createdAt, githubAccessToken, isGithubAuthenticatedState, uid]);

  // If githubAccessToken is defined, get a unique list of repositories that the user has access to
  useEffect(() => {
    if (userDoc?.github?.accessToken) {
      ListRepositoriesForTheAuthenticatedUser(userDoc.github.accessToken).then(
        (res) => {
          const ownerList: string[] = [];
          const repoList: string[] = [];
          if (res?.message?.includes('API rate limit exceeded')) return;
          // @ts-ignore
          res.map((repo) => {
            if (!ownerList.includes(repo.owner.login)) {
              ownerList.push(repo.owner.login);
            }
            if (!repoList.includes(repo.name)) {
              repoList.push(repo.name);
            }
          });
          setOwner1(ownerList);
          setRepo1(repoList);
        }
      );
    }
  }, [userDoc?.github?.accessToken]);

  return (
    <div id='github'>
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
            setState={setGithubAccessToken}
          />
        ) : (
          <RequestOAuthButton
            label='Connect with GitHub'
            handleClick={requestGithubUserIdentity}
          />
        )}
      </div>
      <p className='py-1 ml-3 pl-1'>
        Follow the steps below to tally your numbers.
      </p>
      <ol className='py-1 ml-3 pl-1 list-decimal list-inside' role='list'>
        <li key={1}>Press the &quot;Connect with GitHub&quot; button.</li>
        <li key={2}>
          According to the dialog, login to GitHub, check the scopes and
          authenticate them.
          <ul className='ml-3 pl-1 list-disc list-inside' role='list'>
            <li key={3}>
              Due to scopes that GitHub provides, we request to read/write
              access to the repository, but never actually write anything.
            </li>
            <li>We also never read the code itself.</li>
          </ul>
        </li>
        <li key={3}>Register a repository you want to aggregate below.</li>
      </ol>
      <form
        name='source-code'
        onSubmit={(e) => handleSubmitSourceCode(e, uid)}
        method='post'
        target='_self'
        autoComplete='off'
      >
        <div className='flex flex-wrap items-center'>
          <div className='md:ml-6 md:w-28'></div>
          <InputBox
            label={'User ID'}
            name={'githubUserId'}
            placeholder={'4620828'}
            value={userDoc?.github?.userId}
            disabled={true}
            bgColor={'bg-gray-200'}
          />
          <InputBox
            label={'User Name'}
            name={'githubUserName'}
            placeholder={'oliversmith'}
            value={userDoc?.github?.userName}
            disabled={true}
            bgColor={'bg-gray-200'}
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
            listValues={owner1}
          />
          <InputBox
            label={'Repo Name'}
            name={'githubRepo1'}
            placeholder={'hello-world'}
            value={userDoc?.github?.repositories?.[0]?.repo}
            listValues={repo1}
          />
          <InputBox
            label={'Repo Visibility'}
            name={'githubRepoVisibility1'}
            placeholder={'Public or Private'}
            value={userDoc?.github?.repositories?.[0]?.visibility}
            disabled={true}
            bgColor={'bg-gray-200'}
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
      <p className='py-1 ml-3 pl-1'>
        Press &quot;Disconnect with GitHub&quot; to disconnect at any time. If
        you have any concerns or requests, please feel free to ask us through
        the &quot;Contact Us&quot; link in the side menu.
      </p>
    </div>
  );
};

export default SettingsForGitHub;
