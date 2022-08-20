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
  avatarUrl?: string;
  birth?: Timestamp | number; // DB has Timestamp type but birth could be converted to number
  companyName?: string;
  country?: string;
  department?: string;
  documentId?: string;
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
}

interface NumbersType extends Record<string, unknown> {
  asana?: {
    numberOfTasks?: NumbersByPeriodType;
    numberOfTasksClosed?: NumbersByPeriodType;
    numberOfTasksOpen?: NumbersByPeriodType;
    velocityPerDay?: NumbersByPeriodType;
    velocityPerWeek?: NumbersByPeriodType;
    estimatedCompletionDate?: {
      allPeriods?: string;
      thisYear?: string;
      lastYear?: string;
      thisMonth?: string;
      lastMonth?: string;
      thisWeek?: string;
      lastWeek?: string;
    };
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
  slack?: {
    numberOfMentioned?: NumbersByPeriodType;
    numberOfNewSent?: NumbersByPeriodType;
    numberOfTotalSent?: NumbersByPeriodType;
    numberOfReplies?: NumbersByPeriodType;
  };
}

export type { UserType, NumbersType };
