import { useEffect, useState } from "react";
import { GetGithubData } from "../../services/githubServices.client";
// @ts-ignore
const NumberOfCommits = ({ githubOwnerName, githubRepoName, githubUserId, githubUserName }) => {
  // TODO: It is better to change GetGithubData to useSWR instead of useEffect so that it is easier to understand when to describe.
  const [githubData, setGithubData] = useState({
    author: {},
    total: 0,
    weeks: [],
  });
  useEffect(() => {
    // GetGithubData() returns a promise, so resolve it by connecting it with "then".
    GetGithubData().then((githubData) => setGithubData(githubData));
  }, []);

  // const githubCommitCount = githubData["total"] ? githubData["total"] : 0;
  const githubCommitCount = githubData?.total ? githubData.total : 0;

  return (
    <div className="bg-white shadow rounded-lg p-4 hover:bg-slate-200">
      <div className="flex space-x-4 items-center">
        <div>
          <div className="bg-fuchsia-50 rounded-full w-12 h-12 text-fuchsia-400 flex justify-center items-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.3333 9.33334H28M28 9.33334V20M28 9.33334L17.3333 20L12 14.6667L4 22.6667"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <div>
          <div className="text-gray-400"># of commits</div>
          <div className=" text-2xl font-bold text-gray-900">
            {githubCommitCount} times
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumberOfCommits;
