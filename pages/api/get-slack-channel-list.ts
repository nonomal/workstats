import type { NextApiRequest, NextApiResponse } from 'next';

// The official document is here: https://api.slack.com/methods/conversations.list
// Rate limit is Tier 2: 20+ requests per minute.
const GetSlackChannelList = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  interface ParamsTypes {
    // cursor: string;
    exclude_archived: boolean;
    limit: number;
    // team_id: string;
    types: 'public_channel' | 'private_channel' | 'mpim' | 'im';
    [key: string]: string | boolean | number; // To avoid type error ts(7053) in params[key]
  }
  const params: ParamsTypes = {
    // cursor: '', // Set to response.response_metadata.next_cursor, which is like 'dGVhbTpDMDJESzg1RVdVQQ==', to get the next page. See the official document for more details.
    exclude_archived: false, // Default is false
    limit: 1000, // Default is 100 and must be between 1 and 1000
    types: 'public_channel' // Default is public_channel
  };
  const queryString = Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
  const url = `https://slack.com/api/conversations.list?${queryString}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: req.body.slackAccessToken,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
    .then((res) => res.json())
    .catch((err) => {
      console.log({ err });
      return err;
    });
  if (response.channels === undefined || response.channels.length === 0) {
    return [];
  }
  // @ts-ignore
  const result: string[] = response.channels.map((item) => item.id);
  res.status(200).json(result);
};

export default GetSlackChannelList;
