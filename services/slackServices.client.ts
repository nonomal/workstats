import moment from 'moment';
import useSWR from 'swr';

// This is useSWR's options, the document is here: https://swr.vercel.app/docs/options
const options = {
  shouldRetryOnError: true, // Default is true. If this is false, it doesn't work because data returns undefined for some reason.
  refreshInterval: 1000, // Default is 0, which means it doesn't refresh. It is set to refresh every 1000 milliseconds, but it does not seem to refresh extra if there is no change in the data.
  revalidateIfStale: true, // Default is true
  revalidateOnMount: true,
  revalidateOnFocus: true, // Default is true
  revalidateOnReconnect: true // Default is true
};

// Request a user's Slack identity
// THe official document is here https://api.slack.com/authentication/oauth-v2
const requestSlackUserIdentity = () => {
  // See about scope; https://api.slack.com/authentication/oauth-v2#asking
  // Scope for bots is "scope", but for users it is "user_scope
  const user_scope = 'channels:history,channels:read,search:read,users:read';
  const unguessableRandomString = (outputLength: number) => {
    const stringPool =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: outputLength }, () =>
      stringPool.charAt(Math.floor(Math.random() * stringPool.length))
    ).join('');
  };
  interface PramsTypes {
    user_scope: string;
    client_id: string;
    redirect_uri: string;
    state: string;
    // team: string;
    [key: string]: string; // To avoid type error ts(7053) in params[key]
  }
  const params: PramsTypes = {
    user_scope: user_scope,
    client_id: process.env.NEXT_PUBLIC_SLACK_CLIENT_ID || '',
    redirect_uri:
      `${process.env.NEXT_PUBLIC_ORIGIN}/user-settings?slack=true` || '',
    state: unguessableRandomString(16)
  };
  const queryString = Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
  const url = `https://slack.com/oauth/v2/authorize?${queryString}`;
  window.location.href = url;
};

// Aggregate how many times a user is posted or a user replied in a workspace
// Slack API must be used in a server-side, so we call this method in a browser first then call Next.js API which wraps Slack API
// https://api.slack.com/methods/search.messages
interface SlackSearchTypes {
  slackMemberId: string;
  slackAccessToken: string;
  searchMode: 'mentioned' | 'sent' | 'replies' | 'new-sent';
  since: string;
  until: string;
  count?: number; // Between 1 and 100
}

const useSlackSearch = ({
  slackMemberId,
  slackAccessToken,
  searchMode,
  since,
  until
}: SlackSearchTypes) => {
  const apiEndPoint = `/api/search-slack-${searchMode}`;
  const headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Content-Type', 'application/json');
  const body = {
    slackMemberId,
    slackAccessToken,
    since,
    until
  };
  const fetchOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  };
  const fetcher = async (url: string) => {
    const response = await fetch(url, fetchOptions);
    const json = await response.json();
    const output: number = json.messages.total;
    return output;
  };
  const { data, error } = useSWR(apiEndPoint, fetcher, options);
  if (error) {
    return 0;
  } else if (!data) {
    return 0;
  } else {
    return data;
  }
};

// Search and get slack messages
const SearchSlackMessages = async ({
  slackMemberId,
  slackAccessToken,
  searchMode,
  since,
  until,
  count
}: SlackSearchTypes) => {
  const apiEndPoint = `/api/search-slack-${searchMode}`;
  const headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Content-Type', 'application/json');
  const body = {
    slackMemberId,
    slackAccessToken,
    since,
    until,
    count: count || 100, // The maximum number of messages that can be obtained at once is 100
    // cursor: '*', // The cursor is used to get the next 100 messages
    page: 1 // The page is used to get the next 100 messages
  };
  const fetchOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  };

  // Loop until all messages are acquired
  const messages = [];
  let hasMore = true;
  let lastTs = 0;
  while (hasMore) {
    const response = await fetch(apiEndPoint, fetchOptions);
    const json = await response.json();
    // Narrow down to data after the lastTs. This is because the same message may be returned multiple times.
    const matches =
      json?.messages?.matches?.filter(
        (match: { ts: string }) => +match.ts > lastTs
      ) || [];
    const matchesLength = matches?.length ? matches.length : 0;

    // If the lastTs time was at the end of the day, when resetting and retrieving from page 1, all 100 cases could be before the lastTs
    if (matchesLength > 0) {
      // @ts-ignore
      const matchMessages = matches.map((match) => {
        return {
          // Commented out some of them to reduce the size of the data
          ts: Math.round(+match.ts) // Timestamp like 1659341178 as a number in seconds
          // date: moment(+match.ts * 1000).format(), // 2022-08-23T07:59:38+09:00
          // postedById: match.user // U02DK80DN9H
          // postName: match.username // nishio.hiroshi.
          // channelId: match.channel.id, // C03PMQR3FSL
          // channelName: match.channel.name // accounting-and-tax
        };
      });
      messages.push(...matchMessages);
    }
    hasMore = body.page < json.messages?.paging?.pages ? true : false;
    if (hasMore && body.page === 100) {
      // Get the last ts in the matchMessages array, which must be YYYY-MM-DD format
      lastTs = +matches[matchesLength - 1].ts;
      const lastTsSince = moment(lastTs * 1000)
        .subtract(1, 'days') // after:A is not A≤, because A<, so subtract 1 day
        .format('YYYY-MM-DD');
      // Set the last ts as the new since
      body.since = lastTsSince;
      // Reset the page
      body.page = 1;
    } else {
      body.page++;
    }
    // Update the request body
    fetchOptions.body = JSON.stringify(body);
  }

  // Append some data to the messages array
  const messagesWithData = messages
    .map((message, index, array) => {
      // Check the elements of the messages array in order, and uniquely count how many kinds of "postName" values were found in the elements up to that index.
      // const uniqueCountOfPostName = new Set(
      //   array.slice(0, index + 1).map((message) => message.postName)
      // ).size;
      // Calculate duration time from the previous timestamp to the current timestamp
      const interval = index === 0 ? 0 : message.ts - array[index - 1].ts;
      return {
        ...message,
        interval
        // uniqueCountOfPostName
      };
    })
    .map((message, index, array) => {
      // Calculate moving average of duration time over the last X messages
      const numberOfMessages = 200; // should be multiple of 7
      const aveIntvl =
        Math.round(
          array
            .slice(Math.max(index + 1 - numberOfMessages, 0), index + 1)
            .reduce((acc, cur) => acc + cur.interval, 0) /
            Math.min(index + 1, numberOfMessages) /
            360
        ) / 10 || 0; // in hours
      return {
        ts: message.ts,
        // postName: message.postName,
        aveIntvl
      };
    });

  return messagesWithData;
};

// Get a Slack channel list in a workspace
// Slack API must be used in a server-side, so we call this method in a browser first then call Next.js API which wraps Slack API
interface SlackChannelListTypes {
  slackAccessToken: string;
}

const useSlackChannelList = ({ slackAccessToken }: SlackChannelListTypes) => {
  const apiEndPoint = '/api/get-slack-channel-list';
  const headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Content-Type', 'application/json');
  const body = {
    slackAccessToken
  };
  const fetchOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  };
  const fetcher = async (url: string) => {
    const response = await fetch(url, fetchOptions);
    const json: string[] = await response.json();
    return json;
  };
  const { data, error } = useSWR(apiEndPoint, fetcher, options);
  if (error) {
    return [];
  } else if (!data) {
    return [];
  } else {
    return data;
  }
};

// Aggregate how many times a user sent new messages in a workspace
// Slack API must be used in a server-side, so we call this method in a browser first then call Next.js API which wraps Slack API
interface SlackNumberOfNewSentTypes {
  channelId: string;
  latest: number; // Unix timestamp, seconds
  oldest: number; // Unix timestamp, seconds
  slackMemberId: string;
  slackAccessToken: string;
}

const getSlackNumberOfNewSent = async ({
  channelId,
  latest,
  oldest,
  slackMemberId,
  slackAccessToken
}: SlackNumberOfNewSentTypes) => {
  const apiEndPoint = '/api/get-slack-number-of-new-sent';
  const headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Content-Type', 'application/json');
  const body = {
    channelId,
    latest,
    oldest,
    slackMemberId,
    slackAccessToken
  };
  const fetchOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  };
  const response = await fetch(apiEndPoint, fetchOptions);
  const json: number = await response.json();
  return json;
};

export {
  getSlackNumberOfNewSent,
  useSlackChannelList,
  useSlackSearch,
  requestSlackUserIdentity,
  SearchSlackMessages
};
