import { FieldValue } from 'firebase/firestore';

interface UserType extends Record<string, unknown> {
  asana?: {
    userId?: string;
    accessToken?: string;
    refreshToken?: string;
    workspace?: Array<{
      workspaceId?: string;
      workspaceName?: string;
    }>;
    createdAt?: FieldValue; // When accessToken was created
    updatedAt?: FieldValue; // When accessToken was updated
  };
  assessor?: string;
  assignedPj?: string;
  atlassian?: {
    accountId?: string;
    accessToken?: string;
    refreshToken?: string;
    organization?: Array<{
      organizationId?: string;
      organizationName?: string;
    }>;
    createdAt?: FieldValue; // When accessToken was created
    updatedAt?: FieldValue; // When accessToken was updated
  };
  avatarUrl?: string;
  birth?: FieldValue | number; // DB has Timestamp type but birth could be converted to number
  company?: string;
  country?: string;
  department?: string;
  documentId?: string;
  email?: string;
  firstName?: string;
  github?: {
    repositories?: Array<{
      owner?: string;
      repo?: string;
      visibility?: string;
    }>;
    userId?: number;
    userName?: string;
    accessToken?: string;
    createdAt?: FieldValue; // When accessToken was created
    updatedAt?: FieldValue; // When accessToken was updated
  };
  google?: {
    workspace?: Array<{
      accessToken?: string;
      gmail?: string;
      refreshToken?: string;
      userName?: string;
    }>;
    createdAt?: FieldValue; // When accessToken was created
    updatedAt?: FieldValue; // When accessToken was updated
  };
  lastName?: string;
  middleName?: string;
  photoURL?: string;
  productTour?: {
    dashboard?: number;
    userSettings?: number;
  };
  rank?: string;
  role?: string;
  slack?: {
    workspace?: Array<{
      accessToken?: string;
      memberId?: string;
      workspaceName?: string;
    }>;
    createdAt?: FieldValue; // When accessToken was created
    updatedAt?: FieldValue; // When accessToken was updated
  };
  supervisor?: string;
}

interface NumbersByPeriodType extends Record<string, number | undefined> {
  allPeriods?: number;
  thisYear?: number;
  lastYear?: number;
  thisMonth?: number;
  lastMonth?: number;
  thisWeek?: number;
  lastWeek?: number;
  customPeriods?: number;
}

interface StringsByPeriodType extends Record<string, string | undefined> {
  allPeriods?: string;
  thisYear?: string;
  lastYear?: string;
  thisMonth?: string;
  lastMonth?: string;
  thisWeek?: string;
  lastWeek?: string;
  customPeriods?: string;
}

interface NumbersType extends Record<string, unknown> {
  asana?: {
    numberOfTasks?: NumbersByPeriodType;
    numberOfTasksClosed?: NumbersByPeriodType;
    numberOfTasksOpen?: NumbersByPeriodType;
    velocityPerDay?: NumbersByPeriodType;
    velocityPerWeek?: NumbersByPeriodType;
    estimatedCompletionDate?: StringsByPeriodType;
    createdAt?: FieldValue; // When accessToken was created
    updatedAt?: FieldValue; // When accessToken was updated
  };
  github?: {
    numberOfCommits?: NumbersByPeriodType;
    numberOfPullRequests?: NumbersByPeriodType;
    numberOfReviews?: NumbersByPeriodType;
    numberOfLinesAdded?: NumbersByPeriodType;
    numberOfLinesDeleted?: NumbersByPeriodType;
    createdAt?: FieldValue; // When accessToken was created
    updatedAt?: FieldValue; // When accessToken was updated
  };
  googleCalendar?: {
    numberOfEvents?: NumbersByPeriodType;
    totalTimeOfEvents?: NumbersByPeriodType;
    createdAt?: FieldValue; // When accessToken was created
    updatedAt?: FieldValue; // When accessToken was updated
  };
  jira?: {
    numberOfIssues?: NumbersByPeriodType;
    numberOfIssuesClosed?: NumbersByPeriodType;
    numberOfIssuesOpen?: NumbersByPeriodType;
    velocityPerBizDay?: NumbersByPeriodType;
    velocityPerWeek?: NumbersByPeriodType;
    estimatedCompletionDate?: StringsByPeriodType;
    createdAt?: FieldValue; // When accessToken was created
    updatedAt?: FieldValue; // When accessToken was updated
  };
  slack?: {
    numberOfMentioned?: NumbersByPeriodType;
    numberOfNewSent?: NumbersByPeriodType;
    numberOfTotalSent?: NumbersByPeriodType;
    numberOfReplies?: NumbersByPeriodType;
    createdAt?: FieldValue; // When accessToken was created
    updatedAt?: FieldValue; // When accessToken was updated
  };
}

interface PullRequestsType extends Record<string, unknown> {
  id?: number; // Pull Request ID
  number?: number; // Pull Request Number
  title?: string;
  state?: string; // open or closed
  createdAt: string; // ISO 8601. Removed ? because it is required by the following code
  updatedAt?: string; // ISO 8601
  closedAt?: string; // ISO 8601
  mergedAt?: string; // ISO 8601
  leadTimeSinceLastPR?: number; // Lead time since last PR in milliseconds
  movingAverageLeadTimeSinceLastPR?: number; // Moving average lead time since last PR in milliseconds
  user?: string; // User Name
  repositoryUrl?: string;
}

export type {
  UserType,
  NumbersType,
  NumbersByPeriodType,
  PullRequestsType,
  StringsByPeriodType
};
