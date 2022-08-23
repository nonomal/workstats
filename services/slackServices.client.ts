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

// Aggregate how many times a user is mentioned or a user replied in a workspace
// Slack API must be used in a server-side, so we call this method in a browser first then call Next.js API which wraps Slack API
interface SlackSearchTypes {
  slackMemberId: string;
  slackAccessToken: string;
  searchMode: 'mentioned' | 'sent' | 'replies';
  since: string;
  until: string;
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
  requestSlackUserIdentity
};
