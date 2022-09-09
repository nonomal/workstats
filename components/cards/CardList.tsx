// import card components
import CardListForGithub from './CardListForGithub';
import CardListForJira from './CardListForJira';
import CardListForAsana from './CardListForAsana';
import CardListForSlack from './CardListForSlack';
import CardListForGoogleCalendar from './CardListForGoogleCalendar';

// import configs
import { NumbersType } from '../../config/firebaseTypes';

interface PropTypes {
  asanaWorkspaceId: string;
  asanaUserId: string;
  asanaOAuthAccessToken: string;
  asanaRefreshToken: string;
  atlassianAccessToken: string;
  atlassianRefreshToken: string;
  atlassianOrganizationId: string;
  githubOwnerName: string;
  githubRepoName: string;
  githubUserId: number;
  githubUserName: string;
  githubAccessToken: string;
  googleOAuthAccessToken: string;
  googleRefreshToken: string;
  numbersDoc: NumbersType;
  slackAccessToken: string;
  slackMemberId: string;
  uid: string;
}

const CardList = ({
  asanaWorkspaceId,
  asanaUserId,
  asanaOAuthAccessToken,
  asanaRefreshToken,
  atlassianAccessToken,
  atlassianRefreshToken,
  atlassianOrganizationId,
  githubOwnerName,
  githubRepoName,
  githubUserId,
  githubUserName,
  githubAccessToken,
  googleOAuthAccessToken,
  googleRefreshToken,
  numbersDoc,
  slackAccessToken,
  slackMemberId,
  uid
}: PropTypes) => {
  return (
    <div id='card-list' className='container max-w-6xl px-5 my-1 md:my-1'>
      <CardListForGithub
        githubOwnerName={githubOwnerName}
        githubRepoName={githubRepoName}
        githubUserId={githubUserId}
        githubUserName={githubUserName}
        githubAccessToken={githubAccessToken}
        numbersDoc={numbersDoc}
        uid={uid}
      />
      <CardListForJira
        organizationId={atlassianOrganizationId}
        accessToken={atlassianAccessToken}
        refreshToken={atlassianRefreshToken}
        numbersDoc={numbersDoc}
        uid={uid}
      />
      <CardListForAsana
        asanaWorkspaceId={asanaWorkspaceId}
        asanaUserId={asanaUserId}
        asanaOAuthAccessToken={asanaOAuthAccessToken}
        asanaRefreshToken={asanaRefreshToken}
        numbersDoc={numbersDoc}
        uid={uid}
      />
      <CardListForSlack
        slackAccessToken={slackAccessToken}
        slackMemberId={slackMemberId}
        numbersDoc={numbersDoc}
        uid={uid}
      />
      <CardListForGoogleCalendar
        googleOAuthAccessToken={googleOAuthAccessToken}
        googleRefreshToken={googleRefreshToken}
        numbersDoc={numbersDoc}
        uid={uid}
      />
    </div>
  );
};

export default CardList;
