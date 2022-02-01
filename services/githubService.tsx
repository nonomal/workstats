const GetGithubData = async () => {
  // TODO: Change the following strings (owner and repo) to be retrieved from user data instead of being written in plain text.
  const owner = "Suchica";
  const repo = "polygonHR";
  const url = `https://api.github.com/repos/${owner}/${repo}/stats/contributors`;

  const response = await fetch(url);
  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }
  const data = await response.json();
  // console.log(data[0]);
  return data[0];
};

export default GetGithubData;
