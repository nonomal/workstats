import type { NextApiRequest, NextApiResponse } from 'next';

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

interface bodyType {
  grant_type: 'authorization_code' | 'refresh_token';
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  code: string;
  refresh_token: string;
  // code_verifier?: string;
  [key: string]: string; // To avoid type error ts(7053) in params[key]
}

// Exchange a code for an Asana access token
// See chapter 'Token Exchange Endpoint' in https://developers.asana.com/docs/oauth
const GetAsanaAccessToken = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const body: bodyType = {
    grant_type: req.body.grant_type,
    client_id: process.env.NEXT_PUBLIC_ASANA_CLIENT_ID || '',
    client_secret: process.env.ASANA_CLIENT_SECRET || '',
    redirect_uri:
      `${process.env.NEXT_PUBLIC_ORIGIN}/user-settings?asana=true` || '',
    code: req.body.code,
    refresh_token: req.body.refresh_token || ''
  };
  const bodyString = Object.keys(body)
    .map((key) => `${key}=${encodeURIComponent(body[key])}`)
    .join('&');
  const url = 'https://app.asana.com/-/oauth_token';
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

export default GetAsanaAccessToken;
