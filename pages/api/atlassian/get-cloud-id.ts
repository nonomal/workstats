import type { NextApiRequest, NextApiResponse } from 'next';

// Get the 'cloudid' for your site
// See the details: https://developer.atlassian.com/cloud/confluence/oauth-2-3lo-apps/#3-1-get-the-cloudid-for-your-site
type ResponseData = Array<{
  id: string; // Like '11223344-a1b2-3b33-c444-def123456789'
  name: string; // Like 'suchica'
  url: string; // Like 'https://suchica.atlassian.net'
  scopes: Array<string>;
  avatarUrl: string;
}>;

const GetAtlassianCloudId = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const url = 'https://api.atlassian.com/oauth/token/accessible-resources';
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${req.body.access_token}`,
      Accept: 'application/json'
    }
  })
    .then((res) => res.json())
    .catch((err) => err);

  res.status(200).json(response);
};

export default GetAtlassianCloudId;
