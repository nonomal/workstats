import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebaseClient';
import { UserType } from '../config/firebaseTypes';

const createUserDoc = async (docId: string) => {
  const docRef = doc(db, 'users', docId);
  const docData: UserType = {};
  const option = { merge: true };
  await setDoc(docRef, docData, option);
  return;
};

const handleSubmitBasicInfo = async (
  event: React.FormEvent<HTMLFormElement>,
  docId: string
) => {
  // Stop the form from submitting and refreshing the page.
  event.preventDefault();

  const docRef = doc(db, 'users', docId);
  const docData: UserType = {
    assessor: event.currentTarget.assessor.value,
    assignedPj: event.currentTarget.assignedPj.value,
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

const handleSubmitSourceCode = async (
  event: React.FormEvent<HTMLFormElement>,
  docId: string
) => {
  // Stop the form from submitting and refreshing the page.
  event.preventDefault();

  const docRef = doc(db, 'users', docId);
  const docData = {
    github: {
      repositories: [
        {
          owner: event.currentTarget.githubRepoOwner1.value,
          repo: event.currentTarget.githubRepo1.value,
          visibility: event.currentTarget.githubRepoVisibility1.value
        },
        {
          owner: event.currentTarget.githubRepoOwner2.value,
          repo: event.currentTarget.githubRepo2.value,
          visibility: event.currentTarget.githubRepoVisibility2.value
        }
      ],
      userId: event.currentTarget.githubUserId.valueAsNumber, // should be a number
      userName: event.currentTarget.githubUserName.value
    }
  };
  const option = { merge: true };

  await setDoc(docRef, docData, option);
  alert('Source code info updated!');
  return;
};

const handleSubmitTaskTicket = async (
  event: React.FormEvent<HTMLFormElement>,
  docId: string
) => {
  // Stop the form from submitting and refreshing the page.
  event.preventDefault();

  const docRef = doc(db, 'users', docId);
  const docData = {
    asana: {
      userId: event.currentTarget.asanaUserId.value,
      workspace: [
        {
          personalAccessToken:
            event.currentTarget.asanaWorkspacePersonalAccessToken1.value,
          workspaceId: event.currentTarget.asanaWorkspaceId1.value,
          workspaceName: event.currentTarget.asanaWorkspaceName1.value
        },
        {
          personalAccessToken:
            event.currentTarget.asanaWorkspacePersonalAccessToken2.value,
          workspaceId: event.currentTarget.asanaWorkspaceId2.value,
          workspaceName: event.currentTarget.asanaWorkspaceName2.value
        }
      ]
    }
  };
  const option = { merge: true }; // means that if the doc already exists, it will be updated instead of creating a new one.

  await setDoc(docRef, docData, option);
  alert('Task ticket info updated!');
  return;
};

const handleSubmitCommunicationActivity = async (
  event: React.FormEvent<HTMLFormElement>,
  docId: string
) => {
  // Stop the form from submitting and refreshing the page.
  event.preventDefault();

  const docRef = doc(db, 'users', docId);
  const docData = {
    slack: {
      workspace: [
        {
          workspaceName: event.currentTarget.slackWorkspaceName1.value,
          memberId: event.currentTarget.slackWorkspaceMemberId1.value,
          userToken: event.currentTarget.slackWorkspaceUserToken1.value,
          botToken: event.currentTarget.slackWorkspaceBotToken1.value
        },
        {
          workspaceName: event.currentTarget.slackWorkspaceName2.value,
          memberId: event.currentTarget.slackWorkspaceMemberId2.value,
          userToken: event.currentTarget.slackWorkspaceUserToken2.value,
          botToken: event.currentTarget.slackWorkspaceBotToken2.value
        }
      ]
    }
  };
  const option = { merge: true }; // means that if the doc already exists, it will be updated instead of creating a new one.

  await setDoc(docRef, docData, option);
  alert('Communication activity info updated!');
  return;
};

export {
  createUserDoc,
  handleSubmitBasicInfo,
  handleSubmitSourceCode,
  handleSubmitTaskTicket,
  handleSubmitCommunicationActivity
};
