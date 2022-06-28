import type { NextApiRequest, NextApiResponse } from 'next';

// The official document is here: https://api.slack.com/methods/conversations.history
// Rate limit is Tier 3: 50+ requests per minute.
const GetSlackNumberOfNewSent = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  interface ParamsTypes {
    channel: string;
    cursor: string; // Set to response.response_metadata.next_cursor, which is like 'dGVhbTpDMDJESzg1RVdVQQ==', to get the next page. See the official document for more details.
    include_all_metadata: boolean; // Default is false
    inclusive: boolean; // Default is false
    latest: number; // Unix timestamp, seconds. Default is the current time
    limit: number; // Default is 100. Maximum is 1000. Recommended is no more than 200.
    oldest: number; // Unix timestamp, seconds. Default is 0
    [key: string]: string | boolean | number; // To avoid type error ts(7053) in params[key]
  }
  const params: ParamsTypes = {
    channel: req.body.channelId,
    cursor: '', // Initially set to empty string
    include_all_metadata: false,
    inclusive: true,
    latest: req.body.latest,
    limit: 200,
    oldest: req.body.oldest
  };
  let hasMore = true;
  let result = 0;
  while (hasMore) {
    const queryString = Object.keys(params)
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
    const url = `https://slack.com/api/conversations.history?${queryString}`;
    const data = await fetch(url, {
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
    // @ts-ignore
    const filteredData = data.messages.filter((item) => {
      return item.user === req.body.slackMemberId;
    });
    result += filteredData.length;
    hasMore = data.has_more; // IF there is no next_cursor, it will be false
    if (hasMore) {
      params.cursor = data.response_metadata.next_cursor;
      params.latest = data.messages[data.messages.length - 1].ts;
    }
  }
  res.status(200).json(result);
};

export default GetSlackNumberOfNewSent;
