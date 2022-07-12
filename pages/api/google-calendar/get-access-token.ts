import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  access_token: string;
  expires_in: number;
  token_type: string; // Bearer
  scope: string;
  refresh_token: string;
};

interface bodyType {
  client_id: string;
  client_secret: string;
  code: string;
  grant_type: 'authorization_code' | 'refresh_token';
  redirect_uri: string;
  refresh_token: string;
  [key: string]: string; // To avoid type error ts(7053) in params[key]
}

// Exchange a code for an Google access token
// See the official document https://developers.google.com/identity/protocols/oauth2/web-server#exchange-authorization-code
const GetGoogleAccessToken = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const body: bodyType = {
    code: req.body.code,
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
    grant_type: req.body.grant_type,
    redirect_uri:
      `${process.env.NEXT_PUBLIC_ORIGIN}/user-settings?google=true` || '',
    refresh_token: req.body.refresh_token || ''
  };
  const bodyString = Object.keys(body)
    .map((key) => `${key}=${encodeURIComponent(body[key])}`)
    .join('&');
  const url = 'https://oauth2.googleapis.com/token';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: bodyString
  })
    .then((res) => res.json())
    .catch((err) => {
      console.log({ err });
      return err;
    });

  res.status(200).json(response);
};

export default GetGoogleAccessToken;
