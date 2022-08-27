import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebaseClient';
import { UserType } from '../config/firebaseTypes';

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

export { getANumbersDoc, getAUserDoc, getPhotoURL, getUserInfo };
