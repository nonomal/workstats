import NumberOfCommits from "./NumberOfCommits";
import NumberOfCloseTasks from "./NumberOfCloseTasks";
import NumberOfMeetings from "./NumberOfMtgs";
import NumberOfMentioned from "./NumberOfMentioned";
import NumberOfNewSent from "./NumberOfNewSent";
import NumberOfOpenTasks from "./NumberOfOpenTasks";
import NumberOfPullRequests from "./NumberOfPullRequests";
import NumberOfReplies from "./NumberOfReply";
import NumberOfReviews from "./NumberOfReview";
import TotalTimeOfMeetings from "./TotalTimeOfMtgs";

const CardList = ({
  numberOfMentioned,
  numberOfNewSent,
  asanaWorkspaceId,
  asanaUserId,
  asanaPersonalAccessToken,
  githubOwnerName,
  githubRepoName,
  githubUserId,
  githubUserName,
}) => {
  return (
    <div className="container max-w-6xl px-5 my-5">
      <h2 className="text-xl mt-4 mb-2">Coding - GitHub</h2>
      <div className="grid gap-6 grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
        <NumberOfCommits
          githubOwnerName={githubOwnerName}
          githubRepoName={githubRepoName}
          githubUserId={githubUserId}
          githubUserName={githubUserName}
        />
        <NumberOfPullRequests
          githubOwnerName={githubOwnerName}
          githubRepoName={githubRepoName}
          githubUserId={githubUserId}
          githubUserName={githubUserName}
        />
        <NumberOfReviews
          githubOwnerName={githubOwnerName}
          githubRepoName={githubRepoName}
          githubUserId={githubUserId}
          githubUserName={githubUserName}
        />
      </div>
      <h2 className="text-xl mt-4 mb-2">Tasks - Asana</h2>
      <div className="grid gap-6 grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
        <NumberOfCloseTasks
          asanaPersonalAccessToken={asanaPersonalAccessToken}
          asanaWorkspaceId={asanaWorkspaceId}
          asanaUserId={asanaUserId}
        />
        <NumberOfOpenTasks
          asanaPersonalAccessToken={asanaPersonalAccessToken}
          asanaWorkspaceId={asanaWorkspaceId}
          asanaUserId={asanaUserId}
        />
      </div>
      <h2 className="text-xl mt-4 mb-2">Communication - Slack & Gmail</h2>
      <div className="grid gap-6 grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
        <NumberOfMentioned data={numberOfMentioned} />
        <NumberOfReplies />
        <NumberOfNewSent data={numberOfNewSent} />
        <NumberOfMeetings />
        <TotalTimeOfMeetings />
      </div>
    </div>
  );
};

export default CardList;
