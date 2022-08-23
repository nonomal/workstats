// See this for more details: https://docs.github.com/en/rest/reference/pulls#list-pull-requests
interface ListPullRequestArgTypes {
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
  createdSince: number; // milliseconds from ISO 8601 format, e.g. '2019-01-01T00:00:00Z'
  createdUntil: number; // milliseconds from ISO 8601 format, e.g. '2019-01-01T00:00:00Z'
  accessToken?: string;
}

interface ListPullRequestParamTypes {
  state: string;
  sort: string;
  direction: string;
  per_page: number;
  page: number;
  [key: string]: string | number; // To avoid type error ts(7053) in params[key]
}

interface ListPullRequestResponseItemTypes {
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

// See this for more details: https://docs.github.com/en/rest/pulls/pulls#list-pull-requests-files
interface ListPullRequestsFilesPramTypes
  extends Record<string, string | number | undefined> {
  owner: string; // A path parameter. The repository owner.
  repo: string; // A path parameter. The repository name.
  // number: number; // A path parameter. The pull request number will be obtained from other method.
  githubUserId: number; // The GitHub user id.
  createdSince: number; // milliseconds from ISO 8601 format, e.g. '2019-01-01T00:00:00Z'
  createdUntil: number; // milliseconds from ISO 8601 format, e.g. '2019-01-01T00:00:00Z'
  accessToken?: string;
}
interface ListPullRequestsFilesQueryTypes extends Record<string, number> {
  per_page: number; // A query parameter. Default is 30 and max is 100.
  page: number; // A query parameter. Default is 1.
}
interface ListPullRequestsFilesResponseItemTypes
  extends Record<string, string | number | undefined> {
  sha: string; // 'bbcd538c8e72b8c175046e27cc8f907076331401'
  filename: string; // 'package.json'
  status:
    | 'added'
    | 'modified'
    | 'removed'
    | 'renamed'
    | 'copied'
    | 'changed'
    | 'unchanged';
  additions: number; // 9
  deletions: number; // 1
  changes: number; // 9 + 1 = 10
  blob_url: string; // 'https://github.com/octocat/Hello-World/blob/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt'
  raw_url: string; // 'https://github.com/octocat/Hello-World/raw/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt'
  contents_url?: string; // 'https://api.github.com/repos/octocat/Hello-World/contents/file1.txt?ref=6dcb09b5b57875f334f61aebed695e2e4193db5e'
  patch?: string; // '@@ -132,7 +132,7 @@ module Test @@ -1000,7 +1000,7 @@ module Test'
  previous_filename?: string; // 'file1.txt'
}

export type {
  ListPullRequestArgTypes,
  ListPullRequestParamTypes,
  ListPullRequestResponseItemTypes,
  ListPullRequestsFilesPramTypes,
  ListPullRequestsFilesQueryTypes,
  ListPullRequestsFilesResponseItemTypes
};
