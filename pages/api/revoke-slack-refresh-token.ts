import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseType = {
  status: number;
};

interface OriginalResponseType {
  ok: boolean;
  error?: string;
  revoked: boolean;
}

interface bodyType {
  token: string; // Slack access token
  // test: boolean;
  [key: string]: string; // To avoid type error ts(7053) in params[key]
}

// Revoke an Slack access token
// See here https://api.slack.com/methods/auth.revoke
const RevokeSlackRefreshToken = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const body: bodyType = {
    token: req.body.accessToken
  };
  const bodyString = Object.keys(body)
    .map((key) => `${key}=${encodeURIComponent(body[key])}`)
    .join('&');
  const url = 'https://slack.com/api/auth.revoke';
  const response: OriginalResponseType = await fetch(url, {
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

  res.status(200).json({ status: response.revoked ? 200 : 400 });
};

export default RevokeSlackRefreshToken;
