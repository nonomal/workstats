import { doc, getDoc } from "firebase/firestore";
import { db, UserType } from "../config/firebase";

const getAUserDoc = async (docID: string) => {
  // TODO: IDs can be obtained from the user list or from the logged-in user.
  const docRef = doc(db, "users", docID);
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
