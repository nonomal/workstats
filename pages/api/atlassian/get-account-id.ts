import type { NextApiRequest, NextApiResponse } from 'next';

// Get the 'account_id' for the user
// See the details: https://developer.atlassian.com/cloud/confluence/oauth-2-3lo-apps/#how-do-i-retrieve-the-public-profile-of-the-authenticated-user-
type ResponseData = {
  account_type: string; // 'atlassian'
  account_id: string; // '112233aa-bb11-cc22-33dd-445566abcabc'
  email: string; // 'nishio.hiroshi@suchica.com
  name: string; // 'Hiroshi Nishio'
  picture: string; // 'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/112233aa-bb11-cc22-33dd-445566abcabc/1234abcd-9876-54aa-33aa-1234dfsade9487ds'
  account_status: string; // 'active'
  nickname: string; // 'nishio.hiroshi'
  zoneinfo: string; // 'Asia/Tokyo'
  locale: string; // 'en-US'
  extended_profile: {
    job_title: string; // 'Software Engineer'
    organization: string; // 'mia@example.com'
    department: string; // 'Engineering'
    location: string; // 'Tokyo'
  };
};

const GetAtlassianAccountId = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const url = 'https://api.atlassian.com/me';
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

export default GetAtlassianAccountId;
