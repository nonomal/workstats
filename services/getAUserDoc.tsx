import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const getAUserDoc = async (docId: string) => {
  // TODO: IDs can be obtained from the user list or from the logged-in user.
  const docRef = doc(db, "users", docId);
  const userDoc = await getDoc(docRef);
  return userDoc;
};

export default getAUserDoc;
