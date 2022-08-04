import useSWR from 'swr';
import { handleSubmitGoogleAccessToken } from './setDocToFirestore';

// Request a user's Google identity
// THe official document is here https://developers.google.com/identity/protocols/oauth2/web-server#redirecting
const requestGoogleUserIdentity = () => {
  // See about scope; https://developers.google.com/identity/protocols/oauth2/scopes#calendar
  // Space delimitation for multiple scopes
  const scope = 'https://www.googleapis.com/auth/calendar.events.readonly';
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
    // Supported response_type are here. https://developers.google.com/identity/protocols/oauth2/openid-connect#discovery
    response_type:
      | 'code'
      | 'token'
      | 'id_token'
      | 'code token'
      | 'code id_token'
      | 'token id_token'
      | 'code token id_token'
      | 'none';
    scope: string;
    access_type: 'online' | 'offline'; // Default is 'online'
    state: string;
    include_granted_scopes: boolean; // Optional
    login_hint: string; // Optional
    prompt: 'none' | 'consent' | 'select_account'; // Optional but must be 'consent' otherwise if users revoke their token once, they will not be able to obtain a new refresh token due to the Google policy. See the details here https://stackoverflow.com/questions/10827920/not-receiving-google-oauth-refresh-token
    [key: string]: string | boolean; // To avoid type error ts(7053) in params[key]
  }
  const params: PramsTypes = {
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    redirect_uri:
      `${process.env.NEXT_PUBLIC_ORIGIN}/user-settings?google=true` || '',
    response_type: 'code',
    scope: scope,
    access_type: 'offline',
    state: unguessableRandomString(16),
    include_granted_scopes: true,
    login_hint: '', // gmail address for the user
    prompt: 'consent'
  };
  const queryString = Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
  const url = `https://accounts.google.com/o/oauth2/v2/auth?${queryString}`;
  window.location.href = url;
};

type ResponseData = {
  access_token: string;
  expires_in: number;
  token_type: string; // Bearer
  scope: string;
  refresh_token: string;
};

const refreshAccessToken = async (
  googleRefreshToken: string
): Promise<ResponseData> => {
  const url = '/api/google-calendar/get-access-token';
  const headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Content-Type', 'application/json');
  const body = {
    grant_type: 'refresh_token',
    code: '',
    refresh_token: googleRefreshToken
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body)
  });
  const output = await response.json();
  return output;
};

// This is useSWR's options, the document is here: https://swr.vercel.app/docs/options
const swrOptions = {
  shouldRetryOnError: true, // Default is true. If this is false, it doesn't work because data returns undefined for some reason.
  revalidateIfStale: true, // Default is true
  // revalidateOnMount: false,
  revalidateOnFocus: true, // Default is true
  revalidateOnReconnect: true // Default is true
};

// The reference is here: https://developers.google.com/calendar/api/v3/reference/events/list
const useNumberOfEvents = async (
  googleAccessToken: string,
  timeMin: string,
  timeMax: string,
  googleRefreshToken?: string,
  uid?: string
) => {
  const apiEndPoint = '/api/google-calendar/get-number-of-events';
  let newGoogleAccessToken = '';
  const headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Content-Type', 'application/json');
  const body = {
    googleAccessToken,
    timeMin,
    timeMax
  };
  const fetchOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  };
  const fetcher = async (url: string) => {
    const response = await fetch(url, fetchOptions)
      .then(async (res) => {
        // if res.status is 401, which means Unauthorized, then refresh the access token and try again
        console.log('res.status', res.status);
        if (res.status === 401 && googleRefreshToken && uid) {
          return refreshAccessToken(googleRefreshToken)
            .then(async (res) => {
              newGoogleAccessToken = res.access_token;
              await handleSubmitGoogleAccessToken(
                uid,
                res.access_token,
                googleRefreshToken // Originally no update is required, but if not set, it will disappear due to the setDoc specification.
              );
              body.googleAccessToken = res.access_token;
              fetchOptions.body = JSON.stringify(body);
            })
            .then(async () => {
              const responseRetry = await fetch(url, fetchOptions);
              const json = responseRetry.json();
              return json;
            });
        }
        // if res.status is not 401, then return the response
        return await res.json();
      })
      .catch((err) => console.log({ err }));

    interface OutputTypes {
      googleAccessToken: string;
      numberOfEvents: number;
      totalTimeOfEvents: number; // hours
    }
    const output: OutputTypes = {
      googleAccessToken: newGoogleAccessToken
        ? newGoogleAccessToken
        : googleAccessToken,
      numberOfEvents: response > 0 ? response : 0,
      totalTimeOfEvents: 0
    };
    return output;
  };
  const noResults = {
    googleAccessToken,
    numberOfEvents: 0,
    totalTimeOfEvents: 0
  };

  const { data, error } = useSWR(apiEndPoint, fetcher, swrOptions);
  if (error) {
    return noResults;
  } else if (!data) {
    return noResults;
  } else {
    return data;
  }
};

export { useNumberOfEvents, requestGoogleUserIdentity };
