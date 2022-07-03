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

const getANumbersDoc = async (docId: string) => {
  const docRef = doc(db, 'numbers', docId);
  const docSnap = await getDoc(docRef);
  return docSnap.data();

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

export { getANumbersDoc, getAUserDoc };
