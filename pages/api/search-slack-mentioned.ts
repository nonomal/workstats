import type { NextApiRequest, NextApiResponse } from 'next';

// The official document is here: https://api.slack.com/methods/search.messages
// Rate limit is Tier 2: 20+ requests per minute.
const SearchSlack = async (req: NextApiRequest, res: NextApiResponse) => {
  // Destructure the request body
  const memberId = req.body.slackMemberId;
  const since = req.body.since;
  const until = req.body.until;
  const count = req.body.count;
  const page = req.body.page;

  // To know more query, see https://slack.com/help/articles/202528808-Search-in-Slack
  const url = `https://slack.com/api/search.messages?
    query=${memberId}+after:${since}+before:${until}&
    count=${count || 1}&
    sort=timestamp&
    sort_dir=asc&
    page=${page || 1}`;

  // Retry fetching up to 3 times if the response status code is 429 (Too Many Requests) after waiting seconds specified in the Retry-After header.
  // See https://api.slack.com/docs/rate-limits
  do {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + req.body.slackAccessToken,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then((res) => res.json())
      .catch((err) => {
        console.log({ err });
        return err;
      });

    // https://api.slack.com/methods/search.messages#errors
    if (response.ok) {
      res.status(200).json(response);
      break;
    } else if (response.error === 'ratelimited') {
      await new Promise((resolve) =>
        setTimeout(resolve, response.headers['Retry-After'] * 1000)
      );
    } else {
      res.status(500).json(response);
      break;
    }
  } while (true);
};

export default SearchSlack;
