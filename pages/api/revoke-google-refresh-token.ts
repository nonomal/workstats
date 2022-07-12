import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseType = {
  status: number;
};

interface bodyType {
  token: string; // The token can be an access token or a refresh token. If the token is an access token and it has a corresponding refresh token, the refresh token will also be revoked.
  [key: string]: string; // To avoid type error ts(7053) in params[key]
}

// Revoke a Google access token
// See here https://developers.google.com/identity/protocols/oauth2/web-server#tokenrevoke
const RevokeGoogleRefreshToken = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const body: bodyType = {
    token: req.body.accessToken
  };
  const bodyString = Object.keys(body)
    .map((key) => `${key}=${encodeURIComponent(body[key])}`)
    .join('&');
  const url = `https://oauth2.googleapis.com/revoke?token=${bodyString}`;
  const status = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
    .then((res) => res.status)
    .catch((err) => {
      console.log({ err });
      return err;
    });

  res.status(200).json(status);
};

export default RevokeGoogleRefreshToken;
