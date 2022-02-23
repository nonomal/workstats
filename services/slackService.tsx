import useSWR from "swr";

const useSlackSearch = (query: string) => {
  const token = process.env.NEXT_PUBLIC_SLACK_API_TOKEN;
  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Authorization", "Bearer " + token);
  const slackURL = `https://slack.com/api/search.messages?query=${query}`;

  const fetcher = async (url: string) => {
    const response = await fetch(url, {
      headers: myHeaders,
    }).then((res) => res.json());
    return response;
  };

  const { data, error } = useSWR(slackURL, fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  if (error) {
    return console.log(`Failed to load: ${error}`);
  } else if (!data) {
    return console.log("Loading...");
  } else {
    console.log(data);
    return data;
  }
};

export default useSlackSearch;
