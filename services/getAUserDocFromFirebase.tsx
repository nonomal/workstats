import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseClient";
import { UserType } from "../config/firebaseTypes";

const getAUserDoc = async (docId: string) => {
  // TODO: IDs can be obtained from the user list or from the logged-in user.
  const docRef = doc(db, "users", docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const result: UserType = {
      ...docSnap.data(),
      documentId: docSnap.id,
    };
    // console.log("Document data:", result);
    return result;
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
    return;
  }
};

export default getAUserDoc;
