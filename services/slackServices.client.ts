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
    redirect_uri: process.env.NEXT_PUBLIC_SLACK_REDIRECT_URI || '',
    state: unguessableRandomString(16)
  };
  const queryString = Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
  const url = `https://slack.com/oauth/v2/authorize?${queryString}`;
  window.location.href = url;
};

export { requestSlackUserIdentity };
