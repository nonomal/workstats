import type { NextApiRequest, NextApiResponse } from 'next';

// The official document is here: https://api.slack.com/methods/search.messages
// Rate limit is Tier 2: 20+ requests per minute.
const SearchSlack = async (req: NextApiRequest, res: NextApiResponse) => {
  // To know more query, see https://slack.com/help/articles/202528808-Search-in-Slack
  const url = `https://slack.com/api/search.messages?query=from:@${
    req.body.slackMemberId
  }+after:${req.body.since}+before:${req.body.until}&count=${
    req.body.count || 1
  }&sort=timestamp&sort_dir=asc&page=${req.body.page || 1}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + req.body.slackAccessToken,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
    .then((res) => res.json())
    // Narrow down to data that do not include "thread_ts" as a parameter in the permalink.
    .then((data) => {
      data.messages.matches = data.messages.matches.filter(
        (match: { permalink: string }) =>
          !match.permalink.includes('thread_ts=')
      );
      return data;
    })
    .catch((err) => {
      console.log({ err });
      return err;
    });
  res.status(200).json(response);
};

export default SearchSlack;
