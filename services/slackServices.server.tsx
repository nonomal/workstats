const slackSearchFromServer = async (searchQuery: string) => {
  // const useSlackSearchFromServer = async () => {

  // searchQuery must be retrieved from an argument in this function
  // const searchQuery = "U02DK80DN9H";
  const token = `Bearer ${process.env.NEXT_PUBLIC_SLACK_API_USER_TOKEN}`;
  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  // This URL itself will be changed to a temporary argument later.
  const slackURL = `https://slack.com/api/search.messages?query=${searchQuery}`;
  const res = await fetch(slackURL, {
    headers: myHeaders,
  });
  const data = await res.json();
  return data;
};

export { slackSearchFromServer };
