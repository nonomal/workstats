import useSWR from "swr";

const useSlackSearch = (searchQuery: string) => {
  const token = `Bearer ${process.env.NEXT_PUBLIC_SLACK_API_USER_TOKEN}`;
  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  // This URL itself will be changed to a temporary argument later.
  const slackURL = `https://slack.com/api/search.messages?query=${searchQuery}`;

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
