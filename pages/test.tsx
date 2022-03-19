// This is the source code I used for my experiments, and I'm keeping it for reference for a while.
import { useEffect, useState } from "react";

const GetGithubData = () => {
  const [githubData, setGithubData] = useState({});
  useEffect(() => {
    // TODO: Change the following strings to be retrieved from user data instead of being written in plain text.
    const owner = "Suchica";
    const repo = "polygonHR";
    const url = `https://api.github.com/repos/${owner}/${repo}/stats/contributors`;

    // TODO: Need to investigate whether async/await should be used or not.
    // TODO: data
    fetch(url)
      .then((res) => res.json())
      .then((data) => setGithubData(data[0]))
      .catch((error) => console.log(error));
  }, []);
  console.log(githubData);
  // setGithubData() sets githubData to the state.
  // whenever the state changes, react renders the state again.
  return (
    <div>
      {/* @ts-ignore */}
      {githubData["author"] && (
        // @ts-ignore
        // eslint-disable-next-line @next/next/no-img-element
        <img alt="test" src={githubData["author"]["avatar_url"]}></img>
      )}
    </div>
  );
};

export default GetGithubData;
