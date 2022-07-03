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
  department?: string;
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
  documentId?: string;
  lastName?: string;
  middleName?: string;
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

interface NumbersType extends Record<string, unknown> {
  github: {
    numberOfCommits: {
      allPeriods: number;
    };
    numberOfPullRequests: {
      allPeriods: number;
    };
    numberOfReviews: {
      allPeriods: number;
    };
  };
}

export type { UserType, NumbersType };
