import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  access_token: string;
  refresh_token: string;
  expires_in: number; // expiry time of access_token in second
  scope: string;
  token_type: string; // like 'Bearer'
};

interface bodyType {
  grant_type: 'authorization_code' | 'refresh_token';
  client_id: string;
  client_secret: string;
  code: string;
  redirect_uri: string;
  // refresh_token: string; // Set if the access token has expired
  [key: string]: string; // To avoid type error ts(7053) in params[key]
}

// Exchange a code for an Atlassian access token
// See the details here; https://developer.atlassian.com/cloud/confluence/oauth-2-3lo-apps/#2--exchange-authorization-code-for-access-token
const GetAtlassianAccessToken = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const body: bodyType = {
    grant_type: req.body.grant_type,
    client_id: process.env.NEXT_PUBLIC_ATLASSIAN_CLIENT_ID || '',
    client_secret: process.env.ATLASSIAN_CLIENT_SECRET || '',
    code: req.body.code,
    redirect_uri:
      `${process.env.NEXT_PUBLIC_ORIGIN}/user-settings?atlassian=true` || ''
    // refresh_token: req.body.refresh_token || ''
  };
  const url = 'https://auth.atlassian.com/oauth/token';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then((res) => res.json())
    .catch((err) => err);

  res.status(200).json(response);
};

export default GetAtlassianAccessToken;
