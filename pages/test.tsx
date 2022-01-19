import { useEffect, useState } from "react";
import Image from "next/image";
// import React from 'react';
// import GetGithubData from '../components/GetGithubData';

// export default function test() {

//     return GetGithubData();
// };

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
      {githubData["author"] && (
        <img alt="test" src={githubData["author"]["avatar_url"]}></img>
      )}
    </div>
  );

  // let data = githubData...;

  // return <Radar data={data} options={options} />;
};

export default GetGithubData;
