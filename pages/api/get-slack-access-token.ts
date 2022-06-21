import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  ok: boolean;
  access_token?: string; // for bots
  token_type?: string;
  scope?: string;
  bot_user_id?: string;
  app_id?: string;
  expires_in?: number;
  refresh_token?: string;
  team: {
    name?: string;
    id: string;
  };
  enterprise: null | {
    name: string;
    id: string;
  };
  is_enterprise_install?: boolean;
  authed_user: {
    id: string;
    scope: string;
    access_token: string;
    expires_in?: number;
    refresh_token?: string;
    token_type: string;
  };
};

interface bodyType {
  client_id: string;
  client_secret: string;
  code: string;
  grant_type: 'authorization_code' | 'refresh_token';
  redirect_uri: string;
  // refresh_token: string;
  [key: string]: string; // To avoid type error ts(7053) in params[key]
}

// Exchange a code for an Slack access token
// See https://api.slack.com/methods/oauth.v2.access
const GetSlackAccessToken = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const body: bodyType = {
    client_id: process.env.NEXT_PUBLIC_SLACK_CLIENT_ID || '',
    client_secret: process.env.SLACK_CLIENT_SECRET || '',
    code: req.body.code,
    grant_type: req.body.grant_type,
    redirect_uri:
      `${process.env.NEXT_PUBLIC_ORIGIN}/user-settings?slack=true` || ''
    // refresh_token: req.body.refresh_token || ''
  };
  const bodyString = Object.keys(body)
    .map((key) => `${key}=${encodeURIComponent(body[key])}`)
    .join('&');
  const url = 'https://slack.com/api/oauth.v2.access';
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

export default GetSlackAccessToken;
