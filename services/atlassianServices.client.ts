// Request a user's Atlassian identity
// THe official document is here; https://developer.atlassian.com/cloud/confluence/oauth-2-3lo-apps/#1--direct-the-user-to-the-authorization-url-to-get-an-authorization-code
const requestAtlassianUserIdentity = (uid: string) => {
  // Scopes are here; https://developer.atlassian.com/cloud/jira/platform/scopes-for-oauth-2-3LO-and-forge-apps/
  // offline_access is required to get a refresh token
  const scope =
    'offline_access read:jira-user read:jira-work read:me read:account';
  // const scope =
  //   'offline_access read:jira-user read:jira-work read:confluence-space.summary read:confluence-props read:confluence-content.all read:confluence-content.summary search:confluence read:confluence-user read:confluence-groups';

  interface PramsTypes {
    audience: 'api.atlassian.com';
    client_id: string;
    scope: string; // space-delimited list of scopes
    redirect_uri: string;
    state: string; // Unguessable random string. It is used to protect against cross-site request forgery attacks. Can be uid.
    response_type: 'code';
    prompt: 'consent';
    [key: string]: string; // To avoid type error ts(7053) in params[key]
  }
  const params: PramsTypes = {
    audience: 'api.atlassian.com',
    client_id: process.env.NEXT_PUBLIC_ATLASSIAN_CLIENT_ID || '',
    scope: scope,
    redirect_uri:
      `${process.env.NEXT_PUBLIC_ORIGIN}/user-settings?atlassian=true` || '',
    state: uid,
    response_type: 'code',
    prompt: 'consent'
  };
  const queryString = Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
  const url = `https://auth.atlassian.com/authorize?${queryString}`;
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
  const url = '/api/get-atlassian-access-token';
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

export { requestAtlassianUserIdentity, refreshAccessToken };
