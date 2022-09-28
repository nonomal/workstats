import { Timestamp } from 'firebase/firestore';

interface UserType extends Record<string, unknown> {
  asana?: {
    userId?: string;
    accessToken?: string;
    refreshToken?: string;
    workspace?: Array<{
      workspaceId?: string;
      workspaceName?: string;
    }>;
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
  };
  avatarUrl?: string;
  birth?: Timestamp | number; // DB has Timestamp type but birth could be converted to number
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
    createdAt?: Timestamp; // When accessToken was created
    updatedAt?: Timestamp; // When accessToken was updated
  };
  google?: {
    workspace?: Array<{
      accessToken?: string;
      gmail?: string;
      refreshToken?: string;
      userName?: string;
    }>;
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
  };
  github?: {
    numberOfCommits?: NumbersByPeriodType;
    numberOfPullRequests?: NumbersByPeriodType;
    numberOfReviews?: NumbersByPeriodType;
    numberOfLinesAdded?: NumbersByPeriodType;
    numberOfLinesDeleted?: NumbersByPeriodType;
  };
  googleCalendar?: {
    numberOfEvents?: NumbersByPeriodType;
    totalTimeOfEvents?: NumbersByPeriodType;
  };
  jira?: {
    numberOfIssues?: NumbersByPeriodType;
    numberOfIssuesClosed?: NumbersByPeriodType;
    numberOfIssuesOpen?: NumbersByPeriodType;
    velocityPerBizDay?: NumbersByPeriodType;
    velocityPerWeek?: NumbersByPeriodType;
    estimatedCompletionDate?: StringsByPeriodType;
  };
  slack?: {
    numberOfMentioned?: NumbersByPeriodType;
    numberOfNewSent?: NumbersByPeriodType;
    numberOfTotalSent?: NumbersByPeriodType;
    numberOfReplies?: NumbersByPeriodType;
  };
}

export type { UserType, NumbersType, NumbersByPeriodType, StringsByPeriodType };
