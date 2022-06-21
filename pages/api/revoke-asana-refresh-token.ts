import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  status: number;
};

interface bodyType {
  client_id: string;
  client_secret: string;
  token: string; // Refresh Token that should be deauthorized. Bearer Tokens will be rejected
  [key: string]: string; // To avoid type error ts(7053) in params[key]
}

// Revoke an Asana refresh token
// See 'Token Deauthorization Endpoint' chapter in https://developers.asana.com/docs/oauth
const RevokeAsanaRefreshToken = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const body: bodyType = {
    client_id: process.env.NEXT_PUBLIC_ASANA_CLIENT_ID || '',
    client_secret: process.env.ASANA_CLIENT_SECRET || '',
    token: req.body.refreshToken
  };
  const bodyString = Object.keys(body)
    .map((key) => `${key}=${encodeURIComponent(body[key])}`)
    .join('&');
  const url = 'https://app.asana.com/-/oauth_revoke';
  const status = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: bodyString
  })
    .then((response) => response.status)
    .catch((err) => {
      console.log({ err });
      return err;
    });

  res.status(200).json({ status });
};

export default RevokeAsanaRefreshToken;
