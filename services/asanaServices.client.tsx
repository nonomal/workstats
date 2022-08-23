import useSWR from 'swr';
import moment from 'moment';
import { handleSubmitAsanaAccessToken } from './setDocToFirestore';

// Record<Keys,Type> is a Utility type in typescript. It is a much cleaner alternative for key-value pairs where property-names are not known. It's worth noting that Record<Keys,Type> is a named alias to {[k: Keys]: Type} where Keys and Type are generics.
interface Params extends Record<string, string> {
  workspace: string;
  assignee: string;
}

const params: Params = {
  workspace: '',
  assignee: ''
};

// Request a user's Asana identity
// THe official document is here 'User Authorization Endpoint' in https://developers.asana.com/docs/oauth
const requestAsanaUserIdentity = () => {
  const scope = 'default';
  const unguessableRandomString = (outputLength: number) => {
    const stringPool =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: outputLength }, () =>
      stringPool.charAt(Math.floor(Math.random() * stringPool.length))
    ).join('');
  };
  interface PramsTypes {
    client_id: string;
    redirect_uri: string;
    response_type: 'code' | 'id_token' | 'code id_token';
    state: string;
    // code_challenge_method?: 'S256';
    // code_challenge?: string;
    scope: 'default' | 'openid' | 'email' | 'profile';
    [key: string]: string; // To avoid type error ts(7053) in params[key]
  }
  const params: PramsTypes = {
    client_id: process.env.NEXT_PUBLIC_ASANA_CLIENT_ID || '',
    redirect_uri:
      `${process.env.NEXT_PUBLIC_ORIGIN}/user-settings?asana=true` || '',
    response_type: 'code',
    state: unguessableRandomString(16),
    // code_challenge_method: 'S256',
    // code_challenge: unguessableRandomString(16), // This needs to be different from state
    scope: scope
  };
  const queryString = Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
  const url = `https://app.asana.com/-/oauth_authorize?${queryString}`;
  window.location.href = url;
};

type ResponseData = {
  access_token: string;
  expires_in: number;
  token_type: string;
  refresh_token: string;
  data: {
    id: number;
    gid: string;
    name: string;
    email: string;
  };
};

const refreshAccessToken = async (
  refreshToken: string
): Promise<ResponseData> => {
  const url = '/api/get-asana-access-token';
  const headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Content-Type', 'application/json');
  const body = {
    grant_type: 'refresh_token',
    code: '',
    refresh_token: refreshToken
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body)
  });
  const output = await response.json();
  return output;
};

interface NumberOfTasksTypes {
  asanaAccessToken: string;
  asanaWorkspaceId: string;
  asanaUserId: string;
  since: string; // ISO 8601 format, e.g. '2019-01-01T00:00:00Z'
  until: string; // ISO 8601 format, e.g. '2019-01-01T00:00:00Z'
  asanaRefreshToken?: string;
  uid?: string;
}

const useNumberOfTasks = ({
  asanaAccessToken,
  asanaWorkspaceId,
  asanaUserId,
  since, // ISO 8601 format, e.g. '2019-01-01T00:00:00Z'
  until, // ISO 8601 format, e.g. '2019-01-01T00:00:00Z'
  asanaRefreshToken,
  uid
}: NumberOfTasksTypes) => {
  const token = asanaAccessToken;
  let newAsanaAccessToken = '';
  const myHeaders = new Headers();
  myHeaders.append('Accept', 'application/json');
  myHeaders.append('Authorization', 'Bearer ' + token);

  // Query parameters are passed in the URL.
  params.workspace = asanaWorkspaceId;
  params.assignee = asanaUserId;
  params.opt_fields = 'completed,completed_at,created_at';
  params.completed_since = since;

  interface item {
    completed: boolean;
    completed_at: string;
    created_at: string;
  }
  const query = new URLSearchParams(params);
  // The official document is here: https://developers.asana.com/docs/get-multiple-tasks
  const asanaUrl = `https://app.asana.com/api/1.0/tasks?${query}`;

  // The official document is here: https://swr.vercel.app/docs/data-fetching
  const fetcher = async (url: string) => {
    const response = await fetch(url, {
      headers: myHeaders
    })
      .then(async (res) => {
        // if res.status is 401, which means Unauthorized, then refresh the access token and try again
        if (res.status === 401 && asanaRefreshToken && uid) {
          return refreshAccessToken(asanaRefreshToken)
            .then(async (res) => {
              newAsanaAccessToken = res.access_token;
              await handleSubmitAsanaAccessToken(uid, res.access_token);
              myHeaders.set('Authorization', 'Bearer ' + res.access_token);
            })
            .then(async () => {
              return await fetch(url, {
                headers: myHeaders
              }).then((res) => res.json());
            });
        }
        return res.json();
      })
      .catch((err) => console.log({ err }));

    // Aggregate the number of tasks
    const numberOfAll: number = response.data?.length
      ? response.data.length
      : 0;
    const numberOfClosed: number =
      response.data?.filter((item: item) => {
        return item.completed === true && item.completed_at <= until;
      })?.length || 0;
    const numberOfOpened: number =
      response.data?.filter((item: item) => {
        return item.completed === false;
      })?.length || 0;

    // Calculate velocity and estimated completion date
    const now = moment().toISOString();
    const earliestCreatedAt: string = response.data?.reduce(
      (earliest: string, item: item) => {
        if (item.created_at < earliest) return item.created_at;
        return earliest;
      },
      now // Initial value
    );
    // Basically, "since" is used, but if the period is "Full", "since" is not used.
    const startDate = earliestCreatedAt <= since ? since : earliestCreatedAt;
    const durationDays = moment(until).diff(startDate, 'days', true);
    const velocityPerDays = Math.round(numberOfClosed / durationDays)
      ? Math.round((numberOfClosed / durationDays) * 10) / 10
      : 0; // Daily basis including Saturdays and Sundays
    const remainingDays = Math.round(numberOfOpened / velocityPerDays)
      ? Math.round(numberOfOpened / velocityPerDays)
      : 0;
    // I'm adding the number of remaining days given at a rate that includes weekends, so you don't have to take weekdays or weekends into account.
    const estimatedCompletionDate = moment()
      .add(remainingDays, 'days')
      .format('ll');

    const output = {
      asanaAccessToken: newAsanaAccessToken
        ? newAsanaAccessToken
        : asanaAccessToken,
      numberOfAll: numberOfAll,
      numberOfClosed: numberOfClosed ? numberOfClosed : 0,
      numberOfOpened: numberOfOpened ? numberOfOpened : 0,
      durationDays: durationDays ? durationDays : 0,
      velocityPerDays: Math.round((numberOfClosed / durationDays) * 7)
        ? Math.round(((numberOfClosed / durationDays) * 70) / 5) / 10
        : 0, // weekday basis
      velocityPerWeeks: Math.round((numberOfClosed / durationDays) * 7)
        ? Math.round((numberOfClosed / durationDays) * 70) / 10
        : 0,
      estimatedCompletionDate: estimatedCompletionDate
    };
    return output;
  };

  const { data, error } = useSWR(asanaUrl, fetcher, {
    shouldRetryOnError: true, // Default is true
    revalidateIfStale: true, // Default is true
    // revalidateOnMount: false,
    revalidateOnFocus: true, // Don't revalidate on focus because a new user has not set up their asana profile yet
    revalidateOnReconnect: true
  });

  const noResults = {
    asanaAccessToken,
    numberOfAll: 0,
    numberOfClosed: 0,
    numberOfOpened: 0,
    velocityPerDays: 0,
    velocityPerWeeks: 0,
    estimatedCompletionDate: '--'
  };

  if (error) {
    return noResults;
  } else if (!data) {
    return noResults;
  } else {
    return data;
  }
};

export { requestAsanaUserIdentity, useNumberOfTasks };
