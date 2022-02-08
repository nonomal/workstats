import NumberOfCommit from "./NumberOfCommit";
import NumberOfCloseTasks from "./NumberOfCloseTasks";
import NumberOfOpenTasks from "./NumberOfOpenTasks";
import NumberOfReview from "./NumberOfReview";

const CardList = () => {
  return (
    <div className="container max-w-6xl px-5 my-5">
      <h2 className=" text-xl m-4">Coding - GitHub</h2>
      <div className="grid gap-7 grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
        <NumberOfCommit />
        <NumberOfReview />
      </div>
      <h2 className=" text-xl m-4">Tasks - Asana</h2>
      <div className="grid gap-7 grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
        <NumberOfCloseTasks />
        <NumberOfOpenTasks />
      </div>
      <h2 className=" text-xl m-4">Communication - Slack & Gmail</h2>
      <div className="grid gap-7 grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
        <NumberOfCommit />
        <NumberOfReview />
        <NumberOfCloseTasks />
        <NumberOfOpenTasks />
        <NumberOfOpenTasks />
      </div>
    </div>
  );
};

export default CardList;
