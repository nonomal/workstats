import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebaseClient';
import {
  PullRequestsType,
  SlackSearchResultsType,
  UserType
} from '../config/firebaseTypes';

const getAUserDoc = async (docId: string) => {
  const docRef = doc(db, 'users', docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const result: UserType = {
      ...docSnap.data(),
      documentId: docSnap.id
    };
    return result;
  } else {
    console.log('No such document!');
    return;
  }
};

const getPhotoURL = async (docId: string) => {
  const docRef = doc(db, 'users', docId);
  const docSnap = await getDoc(docRef);
  const photoURL: string | undefined = docSnap.data()?.photoURL || undefined;
  return photoURL;
};

const getUserInfo = async (docId: string) => {
  const docRef = doc(db, 'users', docId);
  const docSnap = await getDoc(docRef);
  interface UserInfo {
    firstName: string | undefined;
    middleName: string | undefined;
    lastName: string | undefined;
    email: string | undefined;
    photoURL: string | undefined;
  }
  const userInfo: UserInfo = {
    firstName: docSnap.data()?.firstName || undefined,
    middleName: docSnap.data()?.middleName || undefined,
    lastName: docSnap.data()?.lastName || undefined,
    email: docSnap.data()?.email || undefined,
    photoURL: docSnap.data()?.photoURL || undefined
  };
  return userInfo;
};

const getANumbersDoc = async (docId: string) => {
  const docRef = doc(db, 'numbers', docId);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
};

const getPullRequests = async (docId: string) => {
  const docRef = doc(db, 'github-pull-requests', docId);
  const docSnap = await getDoc(docRef);
  return docSnap?.data()?.pullRequests as PullRequestsType[];
};

const getMentionedMessages = async (docId: string) => {
  const docRef = doc(db, 'slack-mentioned-messages', docId);
  const docSnap = await getDoc(docRef);
  return docSnap?.data()?.messages as SlackSearchResultsType[];
};

const getRepliesMessages = async (docId: string) => {
  const docRef = doc(db, 'slack-replies-messages', docId);
  const docSnap = await getDoc(docRef);
  return docSnap?.data()?.messages as SlackSearchResultsType[];
};

const getNewSentMessages = async (docId: string) => {
  const docRef = doc(db, 'slack-new-sent-messages', docId);
  const docSnap = await getDoc(docRef);
  return docSnap?.data()?.messages as SlackSearchResultsType[];
};

export {
  getANumbersDoc,
  getAUserDoc,
  getMentionedMessages,
  getNewSentMessages,
  getPhotoURL,
  getPullRequests,
  getRepliesMessages,
  getUserInfo
};
