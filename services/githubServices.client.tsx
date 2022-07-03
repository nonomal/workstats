import useSWR from 'swr';

// HTTP endpoint v3 (REST API)
const baseURL = 'https://api.github.com';
const options = {
  shouldRetryOnError: false, // Default is true. Set to false due to small rate limit
  revalidateIfStale: false, // Default is true
  // revalidateOnMount: false,
  revalidateOnFocus: false, // Default is true
  revalidateOnReconnect: false // Default is true
};

// Request a user's GitHub identity
// THe official document is here https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps#1-request-a-users-github-identity
const requestGithubUserIdentity = () => {
  const scopes = 'repo read:org user read:discussion';
  const unguessableRandomString = (outputLength: number) => {
    const stringPool =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: outputLength }, () =>
      stringPool.charAt(Math.floor(Math.random() * stringPool.length))
    ).join('');
  };
  interface PramsTypes {
    client_id: string;
    // redirect_uri: string;
    scope: string;
    state: string;
    allow_signup: string;
    [key: string]: string; // To avoid type error ts(7053) in params[key]
  }
  const params: PramsTypes = {
    client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || '',
    // redirect_uri: 'https://auth.workstats.dev/__/auth/handler',
    scope: scopes,
    state: unguessableRandomString(16),
    allow_signup: 'false'
  };
  const queryString = Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
  const url = `https://github.com/login/oauth/authorize?${queryString}`;
  window.location.href = url;
};

// Get a number of commits for a specific user
// The official document is here https://docs.github.com/en/rest/metrics/statistics#get-all-contributor-commit-activity
const useNumberOfCommits = (
  owner: string,
  repo: string,
  githubUserId: number,
  accessToken?: string // Unnecessary for public repositories and necessarily for private repositories
) => {
  const url = `${baseURL}/repos/${owner}/${repo}/stats/contributors`;
  const headers = new Headers();
  headers.append('Accept', 'application/vnd.github.v3+json');
  accessToken && accessToken !== ''
    ? headers.append('Authorization', `token ${accessToken}`)
    : null;
  const fetcher = async (url: string) => {
    const response = await fetch(url, {
      headers: headers
    }).then((res) => res.json());

    interface ItemTypes {
      author: {
        login: string;
        id: number;
        type: string;
        site_admin: boolean;
      };
      total: number;
      weeks: Array<{
        w: number; // Start of the week, given as a Unix timestamp seconds
        a: number; // number of additions
        d: number; // number of deletions
        c: number; // number of commits
      }>;
    }
    const filteredResponse = response.filter((item: ItemTypes) => {
      return item.author.id === githubUserId;
    });
    const output: number = filteredResponse[0].total;
    return output;
  };
  const { data, error } = useSWR(url, fetcher, options);

  if (error) {
    return 0;
  } else if (!data) {
    return 0;
  } else {
    return data;
  }
};

// List pull requests
// The official document is here https://docs.github.com/en/rest/reference/pulls#list-pull-requests
interface NumberOfPullRequestsTypes {
  owner: string;
  repo: string;
  githubUserId: number;
  state?: 'open' | 'closed' | 'all'; // Default is 'open'
  // head?: string;
  // base?: string;
  sort?: 'created' | 'updated' | 'popularity' | 'long-running'; // Default is 'created'
  direction?: 'asc' | 'desc'; // Default is 'desc'
  per_page?: number; // Default is 30, max is 100
  page?: number; // Default is 1
  accessToken?: string;
}
const useNumberOfPullRequests = ({
  owner,
  repo,
  githubUserId,
  state = 'closed', // Default is 'open'
  sort = 'created', // Default is 'created'
  direction = 'desc', // Default is 'desc'
  per_page = 100, // Default is 30, max is 100
  page = 1,
  accessToken
}: NumberOfPullRequestsTypes) => {
  interface PramsTypes {
    state: string;
    sort: string;
    direction: string;
    per_page: number;
    page: number;
    [key: string]: string | number; // To avoid type error ts(7053) in params[key]
  }
  const params: PramsTypes = {
    state,
    sort,
    direction,
    per_page,
    page
  };
  let query = Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
  const url = `${baseURL}/repos/${owner}/${repo}/pulls?${query}`;

  // use useSWR function in Next.js
  // The official document is here: https://swr.vercel.app/docs/data-fetching
  const headers = new Headers();
  headers.append('Accept', 'application/vnd.github.v3+json');
  accessToken && accessToken !== ''
    ? headers.append('Authorization', `token ${accessToken}`)
    : null;
  const fetcher = async (url: string) => {
    let count = 0;
    let totalCount = 0;
    let pageCount = 1;
    do {
      const response = await fetch(url, {
        headers: headers
      }).then((res) => res.json());
      interface ItemTypes {
        id: number;
        number: number;
        state: string;
        user: {
          login: string;
          id: number;
          type: string;
          site_admin: boolean;
        };
        created_at: string;
        updated_at: string;
        closed_at: string;
        merged_at: string;
      }
      const filteredResponse = response.filter((item: ItemTypes) => {
        return item.user.id === githubUserId;
      });
      count = filteredResponse.length;
      totalCount += count;
      pageCount++;
      params.page = pageCount;
      query = Object.keys(params)
        .map((key) => `${key}=${encodeURIComponent(params[key])}`)
        .join('&');
      url = `${baseURL}/repos/${owner}/${repo}/pulls?${query}`;
    } while (count > 0);
    return totalCount;
  };

  const { data, error } = useSWR(url, fetcher, options);

  if (error) {
    return 0;
  } else if (!data) {
    return 0;
  } else {
    return data;
  }
};

// Search for pull request data with reviewer
// The official document is here https://docs.github.com/en/rest/reference/search#search-issues-and-pull-requests
const useNumberOfReviews = (
  owner: string,
  repo: string,
  githubUserName: string,
  accessToken?: string
): number => {
  const params = {
    q: `is:pr repo:${owner}/${repo} reviewed-by:${githubUserName}`,
    per_page: '10', // max = 100
    page: '1'
  };
  const query = new URLSearchParams(params);
  const url = `${baseURL}/search/issues?${query}`;
  // console.log(url);

  const headers = new Headers();
  headers.append('Accept', 'application/vnd.github.v3+json');
  accessToken && accessToken !== ''
    ? headers.append('Authorization', `token ${accessToken}`)
    : null;
  const fetcher = async (url: string) => {
    const response = await fetch(url, {
      headers: headers
    }).then((res) => res.json());
    return response.total_count;
  };

  const { data, error } = useSWR(url, fetcher, options);

  if (error) {
    // console.log(`Failed to load number of reviews: ${error}`);
    return 0;
  } else if (!data) {
    // console.log('Loading number of reviews...');
    return 0;
  } else {
    return data;
  }
};

export {
  useNumberOfCommits,
  useNumberOfPullRequests,
  useNumberOfReviews,
  requestGithubUserIdentity
};
