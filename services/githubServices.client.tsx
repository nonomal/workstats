import useSWR from "swr";

// HTTP endpoint
const base = "https://api.github.com";
// Change the following strings (owner, repo and githubUserId) to be retrieved from user collection in firestore instead of being written here directly.
const owner: string = "Suchica";
const repo: string = "polygonHR";
// Since a text type is not an exact match, set a numeric type, but it is unclear whether the value does not start with 0 in the first place.
const githubUserId: number = 4620828;

const GetGithubData = async () => {
  const url = `${base}/repos/${owner}/${repo}/stats/contributors`;

  const response = await fetch(url);
  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }
  const data = await response.json();
  // console.log(data[0]);
  return data[0];
};

// List pull requests
// The official document is here https://docs.github.com/en/rest/reference/pulls#list-pull-requests
const useNumberOfPullRequests = () => {
  const params = {
    state: "closed", // or "open", "all"
    per_page: "10", // max = 100
    page: "1",
  };
  let query = new URLSearchParams(params);
  let url = `${base}/repos/${owner}/${repo}/pulls?${query}`;
  // console.log(url);

  // use useSWR function in Next.js
  // The official document is here: https://swr.vercel.app/docs/data-fetching
  const headers = new Headers();
  headers.append("Accept", "application/vnd.github.v3+json");
  const fetcher = async (url: string) => {
    let count = 0;
    let totalCount = 0;
    let pageCount = 1;
    do {
      const response = await fetch(url, {
        headers: headers,
      }).then((res) => res.json());
      const filteredResponse = response.filter((item) => {
        return item.user.id === githubUserId;
      });
      count = filteredResponse.length;
      totalCount += count;
      pageCount++;
      params.page = pageCount.toString();
      query = new URLSearchParams(params);
      url = `${base}/repos/${owner}/${repo}/pulls?${query}`;
      // console.log(`count is: ${count}`);
      // console.log(`totalCount is: ${totalCount}`);
      // console.log(`pageCount is: ${pageCount}`);
      // console.log(`params.page is: ${params.page}`);
      // console.log(`url is: ${url}`)
    } while ((count > 0));
    return totalCount;
  };

  const { data, error } = useSWR(url, fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  if (error) {
    return console.log(`Failed to load: ${error}`);
  } else if (!data) {
    return console.log("Loading...");
  } else {
    // console.log(data);
    return data;
  }
};

export { GetGithubData, useNumberOfPullRequests };
