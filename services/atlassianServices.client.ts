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

// Refresh access token
type ResponseData = {
  access_token: string;
  refresh_token: string;
  expires_in: number; // expiry time of access_token in second
  scope: string;
  token_type: string; // like 'Bearer'
};

const refreshAccessToken = async (
  refreshToken: string
): Promise<ResponseData> => {
  const url = '/api/atlassian/get-access-token';
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

// Search issues in Jira with JQL
interface ParamsTypes extends Record<string, string | number | boolean> {
  jql: string;
  startAt: number; // Default is 0
  maxResults: number; // Default is 50
  validateQuery: 'strict' | 'warn' | 'none' | 'true' | 'false'; // Default is strict
  fields: string; // Default is all fields
  // expand?: string[]; // Default is empty
  // properties?: string[]; // Default is empty
  // fieldsByKeys?: boolean; // Default is false
}

interface SearchIssuesProps {
  atlassianAccessToken: string;
  atlassianCloudId: string;
  startAt: number;
  maxResults: number;
  jql: string; // https://support.atlassian.com/jira-service-management-cloud/docs/use-advanced-search-with-jira-query-language-jql/
}

const searchIssues = async ({
  atlassianAccessToken,
  atlassianCloudId,
  startAt,
  maxResults,
  jql
}: SearchIssuesProps) => {
  const headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Authorization', 'Bearer ' + atlassianAccessToken);
  const params: ParamsTypes = {
    startAt, // Default is 0
    maxResults, // Default is 50
    validateQuery: 'strict', // Default is strict
    fields: 'summary,status,assignee,creator,reporter,created,updated',
    jql: jql
  };
  const queryString = Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
  const url = `https://api.atlassian.com/ex/jira/${atlassianCloudId}/rest/api/3/search?${queryString}`;

  // Get tasks completed
  const response = await fetch(url, {
    method: 'GET',
    headers: headers
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
  return response;
};

export { searchIssues, requestAtlassianUserIdentity, refreshAccessToken };
