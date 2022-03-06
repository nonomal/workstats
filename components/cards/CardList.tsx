import NumberOfCommit from "./NumberOfCommit";
import NumberOfCloseTasks from "./NumberOfCloseTasks";
import NumberOfOpenTasks from "./NumberOfOpenTasks";
import NumberOfReview from "./NumberOfReview";
import NumberOfMentioned from "./NumberOfMentioned";
import NumberOfReplies from "./NumberOfReply";
import NumberOfNewSent from "./NumberOfNewSent";
import NumberOfMeetings from "./NumberOfMtgs";
import TotalTimeOfMeetings from "./TotalTimeOfMtgs";

const CardList = ({ data }) => {
  return (
    <div className="container max-w-6xl px-5 my-5">
      <h2 className="text-xl mt-4 mb-2">Coding - GitHub</h2>
      <div className="grid gap-6 grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
        <NumberOfCommit />
        <NumberOfReview />
      </div>
      <h2 className="text-xl mt-4 mb-2">Tasks - Asana</h2>
      <div className="grid gap-6 grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
        <NumberOfCloseTasks />
        <NumberOfOpenTasks />
      </div>
      <h2 className="text-xl mt-4 mb-2">Communication - Slack & Gmail</h2>
      <div className="grid gap-6 grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
        <NumberOfMentioned data={data} />
        <NumberOfReplies />
        <NumberOfNewSent />
        <NumberOfMeetings />
        <TotalTimeOfMeetings />
      </div>
    </div>
  );
};

export default CardList;
