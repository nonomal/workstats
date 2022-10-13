import { doc, FieldValue, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../config/firebaseClient';
import {
  NumbersType,
  PullRequestsType,
  UserType
} from '../config/firebaseTypes';
import { getWorkspaces } from './asanaServices.client';
import { getUserInfo } from './getDocFromFirestore';
import { GetTheRepository } from './githubServices.client';

const createUserDoc = async (
  docId: string,
  firstName?: string,
  middleName?: string,
  lastName?: string,
  email?: string,
  photoURL?: string
  // displayName?: string
) => {
  const docRef = doc(db, 'users', docId);
  const userInfo = await getUserInfo(docId);
  const docData: UserType = {
    firstName: userInfo.firstName || firstName || '',
    middleName: userInfo.middleName || middleName || '',
    lastName: userInfo.lastName || lastName || '',
    email: userInfo.email || email || '',
    photoURL: userInfo.photoURL || photoURL || ''
    // Google's Gmail and User Name are items that users are not allowed to edit, so they should always be updated.
    // google: {
    //   workspace: [
    //     {
    //       gmail: email || '',
    //       userName: displayName || ''
    //     }
    //   ]
    // }
  };
  const option = { merge: true };
  await setDoc(docRef, docData, option);
  return;
};

const createNumbersDoc = async (docId: string) => {
  const docRef = doc(db, 'numbers', docId);
  const docData: NumbersType = {};
  const option = { merge: true };
  await setDoc(docRef, docData, option);
  return;
};

const updatePhotoURL = async (docId: string, photoURL: string) => {
  const docRef = doc(db, 'users', docId);
  const option = { merge: true };
  await setDoc(docRef, { photoURL }, option);
  return;
};

const handleSubmitBasicInfo = async (
  event: React.FormEvent<HTMLFormElement>,
  docId: string
) => {
  event.preventDefault();
  const docRef = doc(db, 'users', docId);
  const docData: UserType = {
    assessor: event.currentTarget.assessor.value,
    assignedPj: event.currentTarget.assignedPj.value,
    company: event.currentTarget.company.value,
    country: event.currentTarget.country.value,
    department: event.currentTarget.department.value,
    firstName: event.currentTarget.firstName.value,
    lastName: event.currentTarget.lastName.value,
    middleName: event.currentTarget.middleName.value,
    rank: event.currentTarget.rank.value,
    role: event.currentTarget.role.value,
    supervisor: event.currentTarget.supervisor.value
  };
  const option = { merge: true }; // means that if the doc already exists, it will be updated instead of creating a new one.

  await setDoc(docRef, docData, option);
  alert('Basic info updated!');
  return;
};

const handleSubmitGithubAccessToken = async (
  docId: string,
  accessToken: string,
  userId: number | string,
  userName: string,
  createdAt?: FieldValue | undefined | boolean
) => {
  const docRef = doc(db, 'users', docId);
  // If createdAt is truthy, which means GitHub has been connected with WorkStats at least once before, then go to ?, otherwise go to :
  const docData = createdAt
    ? {
        github: {
          accessToken: accessToken,
          userId: userId,
          userName: userName,
          updatedAt: serverTimestamp()
        }
      }
    : {
        github: {
          accessToken: accessToken,
          userId: userId,
          userName: userName,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }
      };
  const option = { merge: true };
  await setDoc(docRef, docData, option);
  return;
};

const handleSubmitSourceCode = async (
  event: React.FormEvent<HTMLFormElement>,
  docId: string
) => {
  event.preventDefault();

  // Get the repository values from the input fields.
  const owner1 = event.currentTarget.githubRepoOwner1.value || '';
  const repo1 = event.currentTarget.githubRepo1.value || '';
  const owner2 = event.currentTarget.githubRepoOwner2.value || '';
  const repo2 = event.currentTarget.githubRepo2.value || '';

  // Get the repository visibility using the input fields.
  const visibility1 =
    owner1 && repo1
      ? await GetTheRepository({
          owner: event.currentTarget.githubRepoOwner1.value,
          repo: event.currentTarget.githubRepo1.value,
          accessToken: event.currentTarget.githubAccessToken.value
        }).then((res) => {
          if (res) return res?.visibility || '';
          else return '';
        })
      : '';

  // Store the repository values in the database.
  const docRef = doc(db, 'users', docId);
  const docData: UserType = {
    github: {
      repositories: [
        {
          owner: owner1,
          repo: repo1,
          visibility: visibility1
        },
        {
          owner: owner2,
          repo: repo2
        }
      ]
    }
  };
  const option = { merge: true };

  await setDoc(docRef, docData, option);
  alert('Source code info updated!');
  return;
};

const handleSubmitAtlassianAccessToken = async (
  docId: string,
  accessToken: string,
  accountId: string,
  cloudId: string,
  cloudName: string,
  refreshToken: string
) => {
  const docRef = doc(db, 'users', docId);
  const docData: UserType =
    // If refreshToken is falsy and is not empty string then go to ?, otherwise go to :
    !refreshToken && refreshToken !== ''
      ? {
          atlassian: {
            accessToken: accessToken,
            accountId: accountId,
            organization: [
              {
                organizationId: cloudId,
                organizationName: cloudName
              }
            ],
            updatedAt: serverTimestamp()
          }
        }
      : {
          atlassian: {
            accessToken: accessToken,
            accountId: accountId,
            refreshToken: refreshToken,
            organization: [
              {
                organizationId: cloudId,
                organizationName: cloudName
              }
            ],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          }
        };
  const option = { merge: true };
  await setDoc(docRef, docData, option);
  return;
};

const deleteAtlassianAccessToken = async (docId: string) => {
  const docRef = doc(db, 'users', docId);
  const docData: UserType = {
    atlassian: {
      accessToken: '',
      accountId: '',
      refreshToken: '',
      organization: [
        {
          organizationId: '',
          organizationName: ''
        }
      ],
      updatedAt: serverTimestamp()
    }
  };
  const option = { merge: true };
  await setDoc(docRef, docData, option);
  return;
};

// Update Atlassian access token and refresh token when the access token expires.
const updateAtlassianTokens = async (
  docId: string,
  accessToken: string,
  refreshToken: string
) => {
  const docRef = doc(db, 'users', docId);
  const docData: UserType = {
    atlassian: {
      accessToken: accessToken,
      refreshToken: refreshToken,
      updatedAt: serverTimestamp()
    }
  };
  const option = { merge: true };
  await setDoc(docRef, docData, option);
  return;
};

const handleSubmitAsanaAccessToken = async (
  docId: string,
  accessToken: string,
  userId?: string,
  refreshToken?: string
) => {
  const docRef = doc(db, 'users', docId);
  const docData: UserType =
    // If refreshToken is falsy and is not empty string then go to ?, otherwise go to :
    !refreshToken && refreshToken !== ''
      ? {
          asana: {
            accessToken: accessToken,
            updatedAt: serverTimestamp()
          }
        }
      : {
          asana: {
            accessToken: accessToken,
            refreshToken: refreshToken,
            userId: userId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          }
        };
  const option = { merge: true };
  await setDoc(docRef, docData, option);
  return;
};

const deleteAsanaAccessToken = async (docId: string) => {
  const docRef = doc(db, 'users', docId);
  const docData: UserType = {
    asana: {
      accessToken: '',
      refreshToken: '',
      userId: '',
      updatedAt: serverTimestamp()
    }
  };
  const option = { merge: true };
  await setDoc(docRef, docData, option);
  return;
};

const handleSubmitTaskTicket = async (
  event: React.FormEvent<HTMLFormElement>,
  docId: string
) => {
  event.preventDefault();
  const workspaceName1 = event.currentTarget.asanaWorkspaceName1.value || '';

  // Get the workspace id using the input fields.
  const workspaceId1 = workspaceName1
    ? await getWorkspaces(
        docId,
        event.currentTarget.asanaAccessToken.value,
        event.currentTarget.asanaRefreshToken.value
      )
        .then((res) => {
          if (res) {
            const workspace = res.data.find(
              (workspace) => workspace.name === workspaceName1
            );
            return workspace?.gid || '';
          } else return '';
        })
        .catch((err) => {
          console.log(err);
          return '';
        })
    : '';

  const docRef = doc(db, 'users', docId);
  const docData: UserType = {
    asana: {
      workspace: [
        {
          workspaceId: workspaceId1,
          workspaceName: workspaceName1
        }
      ]
    }
  };
  const option = { merge: true }; // means that if the doc already exists, it will be updated instead of creating a new one.

  await setDoc(docRef, docData, option);
  alert('Task ticket info updated!');
  return;
};

const handleSubmitSlackAccessToken = async (
  docId: string,
  accessToken: string,
  userId: string,
  workspaceName: string
) => {
  const docRef = doc(db, 'users', docId);
  const docData: UserType = {
    slack: {
      workspace: [
        {
          accessToken: accessToken,
          memberId: userId,
          workspaceName: workspaceName
        }
      ],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
  };
  const option = { merge: true };
  await setDoc(docRef, docData, option);
  return;
};

const deleteSlackAccessToken = async (docId: string) => {
  const docRef = doc(db, 'users', docId);
  const docData: UserType = {
    slack: {
      workspace: [
        {
          accessToken: '',
          memberId: '',
          workspaceName: ''
        }
      ],
      updatedAt: serverTimestamp()
    }
  };
  const option = { merge: true };
  await setDoc(docRef, docData, option);
  return;
};

const handleSubmitCommunicationActivity = async (
  event: React.FormEvent<HTMLFormElement>,
  docId: string
) => {
  event.preventDefault();
  const docRef = doc(db, 'users', docId);
  const docData: UserType = {
    slack: {
      workspace: [
        {
          workspaceName: event.currentTarget.slackWorkspaceName1.value,
          memberId: event.currentTarget.slackWorkspaceMemberId1.value
        },
        {
          workspaceName: event.currentTarget.slackWorkspaceName2.value,
          memberId: event.currentTarget.slackWorkspaceMemberId2.value
        }
      ]
    }
  };
  const option = { merge: true }; // means that if the doc already exists, it will be updated instead of creating a new one.

  await setDoc(docRef, docData, option);
  alert('Communication activity info updated!');
  return;
};

const handleSubmitGoogleAccessToken = async (
  docId: string,
  accessToken: string,
  refreshToken?: string
) => {
  const docRef = doc(db, 'users', docId);
  const docData: UserType =
    // If refreshToken is falsy and is not empty string then go to ?, otherwise go to :
    !refreshToken && refreshToken !== ''
      ? {
          google: {
            workspace: [
              {
                accessToken
              }
            ],
            updatedAt: serverTimestamp()
          }
        }
      : {
          google: {
            workspace: [
              {
                accessToken,
                refreshToken
              }
            ],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          }
        };
  const option = { merge: true };
  await setDoc(docRef, docData, option);
  return;
};

const deleteGoogleAccessToken = async (docId: string) => {
  const docRef = doc(db, 'users', docId);
  const docData: UserType = {
    google: {
      workspace: [
        {
          accessToken: '',
          refreshToken: ''
        }
      ],
      updatedAt: serverTimestamp()
    }
  };
  const option = { merge: true };
  await setDoc(docRef, docData, option);
  return;
};

const handleSubmitProductTour = async (
  docId: string,
  productTourType: string,
  numberOfTimesCompleted: number
) => {
  const docRef = doc(db, 'users', docId);
  const docData: UserType = {
    productTour: {
      [productTourType]: numberOfTimesCompleted
    }
  };
  const option = { merge: true };
  await setDoc(docRef, docData, option);
  return;
};

const handleSubmitSurveyWhyYouLeave = async (
  event: React.FormEvent<HTMLFormElement>,
  docId: string,
  n: number
) => {
  event.preventDefault();
  const docRef = doc(db, 'unsub-reasons', docId);
  const arrayData = Array(n)
    .fill(0) // fill with 0 because map() will not work with undefined
    .map((_, i) => {
      return {
        reasonId: event.currentTarget[`reason${i + 1}`].id,
        reasonName: event.currentTarget[`reason${i + 1}`].name,
        checked: event.currentTarget[`reason${i + 1}`].checked
      };
    });
  const docData = {
    reasons: arrayData
  };
  const option = { merge: true }; // means that if the doc already exists, it will be updated instead of creating a new one.

  await setDoc(docRef, docData, option);
  return;
};

interface UpdInsGithubNumbersProps {
  docId: string;
  numberOfCommitsAllPeriods: number;
  numberOfPullRequestsAllPeriods: number;
  numberOfReviewsAllPeriods: number;
  numberOfLinesAddedAllPeriods: number;
  numberOfLinesDeletedAllPeriods: number;
}
const UpdInsGithubNumbers = async ({
  docId,
  numberOfCommitsAllPeriods,
  numberOfPullRequestsAllPeriods,
  numberOfReviewsAllPeriods,
  numberOfLinesAddedAllPeriods,
  numberOfLinesDeletedAllPeriods
}: UpdInsGithubNumbersProps) => {
  const docRef = doc(db, 'numbers', docId);
  const docData: NumbersType = {
    github: {
      numberOfCommits: {
        allPeriods: numberOfCommitsAllPeriods
      },
      numberOfPullRequests: {
        allPeriods: numberOfPullRequestsAllPeriods
      },
      numberOfReviews: {
        allPeriods: numberOfReviewsAllPeriods
      },
      numberOfLinesAdded: {
        allPeriods: numberOfLinesAddedAllPeriods
      },
      numberOfLinesDeleted: {
        allPeriods: numberOfLinesDeletedAllPeriods
      }
    }
  };
  const option = { merge: true };
  await setDoc(docRef, docData, option);
  return;
};

interface UpdInsJiraNumbersProps {
  docId: string;
  numberOfIssuesAllPeriods: number;
  numberOfIssuesClosedAllPeriods: number;
  numberOfIssuesOpenAllPeriods: number;
  velocityPerBizDayAllPeriods: number;
  velocityPerWeekAllPeriods: number;
  estimatedCompletionDateAllPeriods: string;
}
const UpdInsJiraNumbers = async ({
  docId,
  numberOfIssuesAllPeriods,
  numberOfIssuesClosedAllPeriods,
  numberOfIssuesOpenAllPeriods,
  velocityPerBizDayAllPeriods,
  velocityPerWeekAllPeriods,
  estimatedCompletionDateAllPeriods
}: UpdInsJiraNumbersProps) => {
  const docRef = doc(db, 'numbers', docId);
  const docData: NumbersType = {
    jira: {
      numberOfIssues: {
        allPeriods: numberOfIssuesAllPeriods
      },
      numberOfIssuesClosed: {
        allPeriods: numberOfIssuesClosedAllPeriods
      },
      numberOfIssuesOpen: {
        allPeriods: numberOfIssuesOpenAllPeriods
      },
      velocityPerBizDay: {
        allPeriods: velocityPerBizDayAllPeriods
      },
      velocityPerWeek: {
        allPeriods: velocityPerWeekAllPeriods
      },
      estimatedCompletionDate: {
        allPeriods: estimatedCompletionDateAllPeriods
      }
    }
  };
  const option = { merge: true };
  await setDoc(docRef, docData, option);
  return;
};

interface UpdInsAsanaNumbersProps {
  docId: string;
  numberOfTasksAllPeriods: number;
  numberOfTasksClosedAllPeriods: number;
  numberOfTasksOpenAllPeriods: number;
  velocityPerDayAllPeriods: number;
  velocityPerWeekAllPeriods: number;
  estimatedCompletionDateAllPeriods: string;
}
const UpdInsAsanaNumbers = async ({
  docId,
  numberOfTasksAllPeriods,
  numberOfTasksClosedAllPeriods,
  numberOfTasksOpenAllPeriods,
  velocityPerDayAllPeriods,
  velocityPerWeekAllPeriods,
  estimatedCompletionDateAllPeriods
}: UpdInsAsanaNumbersProps) => {
  const docRef = doc(db, 'numbers', docId);
  const docData: NumbersType = {
    asana: {
      numberOfTasks: {
        allPeriods: numberOfTasksAllPeriods
      },
      numberOfTasksClosed: {
        allPeriods: numberOfTasksClosedAllPeriods
      },
      numberOfTasksOpen: {
        allPeriods: numberOfTasksOpenAllPeriods
      },
      velocityPerDay: {
        allPeriods: velocityPerDayAllPeriods
      },
      velocityPerWeek: {
        allPeriods: velocityPerWeekAllPeriods
      },
      estimatedCompletionDate: {
        allPeriods: estimatedCompletionDateAllPeriods
      }
    }
  };
  const option = { merge: true };
  await setDoc(docRef, docData, option);
  return;
};

interface UpdInsSlackNumbersProps {
  docId: string;
  numberOfMentionedAllPeriods: number;
  numberOfNewSentAllPeriods: number;
  numberOfTotalSentAllPeriods: number;
  numberOfRepliesAllPeriods: number;
}
const UpdInsSlackNumbers = async ({
  docId,
  numberOfMentionedAllPeriods,
  numberOfNewSentAllPeriods,
  numberOfTotalSentAllPeriods,
  numberOfRepliesAllPeriods
}: UpdInsSlackNumbersProps) => {
  const docRef = doc(db, 'numbers', docId);
  const docData: NumbersType = {
    slack: {
      numberOfMentioned: {
        allPeriods: numberOfMentionedAllPeriods
      },
      numberOfNewSent: {
        allPeriods: numberOfNewSentAllPeriods
      },
      numberOfTotalSent: {
        allPeriods: numberOfTotalSentAllPeriods
      },
      numberOfReplies: {
        allPeriods: numberOfRepliesAllPeriods
      }
    }
  };
  const option = { merge: true };
  await setDoc(docRef, docData, option);
  return;
};

interface UpdInsGoogleCalendarNumbersProps {
  docId: string;
  numberOfEventsAllPeriods: number;
  totalTimeOfEventsAllPeriods: number;
}
const UpdInsGoogleCalendarNumbers = async ({
  docId,
  numberOfEventsAllPeriods,
  totalTimeOfEventsAllPeriods
}: UpdInsGoogleCalendarNumbersProps) => {
  const docRef = doc(db, 'numbers', docId);
  const docData: NumbersType = {
    googleCalendar: {
      numberOfEvents: {
        allPeriods: numberOfEventsAllPeriods
      },
      totalTimeOfEvents: {
        allPeriods: totalTimeOfEventsAllPeriods
      }
    }
  };
  const option = { merge: true };
  await setDoc(docRef, docData, option);
  return;
};

interface UpdInsGitHubPullRequestsProps {
  docId: string;
  pullRequests: PullRequestsType[];
}
const UpdInsGitHubPullRequests = async ({
  docId,
  pullRequests
}: UpdInsGitHubPullRequestsProps) => {
  const docRef = doc(db, 'github-pull-requests', docId);
  const docData = { pullRequests };
  const option = { merge: true };
  await setDoc(docRef, docData, option);
  return;
};

export {
  createNumbersDoc,
  createUserDoc,
  deleteAsanaAccessToken,
  deleteAtlassianAccessToken,
  deleteGoogleAccessToken,
  deleteSlackAccessToken,
  handleSubmitBasicInfo,
  handleSubmitGithubAccessToken,
  handleSubmitSourceCode,
  handleSubmitAtlassianAccessToken,
  handleSubmitAsanaAccessToken,
  handleSubmitTaskTicket,
  handleSubmitSlackAccessToken,
  handleSubmitCommunicationActivity,
  handleSubmitGoogleAccessToken,
  handleSubmitProductTour,
  handleSubmitSurveyWhyYouLeave,
  updatePhotoURL,
  updateAtlassianTokens,
  UpdInsAsanaNumbers,
  UpdInsGithubNumbers,
  UpdInsGitHubPullRequests,
  UpdInsGoogleCalendarNumbers,
  UpdInsJiraNumbers,
  UpdInsSlackNumbers
};
