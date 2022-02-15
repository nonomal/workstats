import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const ProfileList = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    department: "",
    rank: "",
    supervisor: "",
    assessor: "",
    assignedPj: "",
    role: "",
    id: "",
  });

  // The function passed to useEffect will work after the render result is reflected on the screen.
  // The second argument is the variable used in the useEffect, and it is compared before and after the useEffect, but the set function is immutable, so there is no need to assign it.
  useEffect(() => {
    // TODO: IDs can be obtained from the user list or from the logged-in user.
    const id = "REArvdg1hv5I6pkJ40nC";
    const docRef = doc(db, "users", id);
    getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
        setProfile({ ...docSnap.data(), id: docSnap.id });
      } else {
        console.log("No such document!");
      }
    });
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3 m-4">
      <div>Name / Age :</div>
      <div>
        {profile.firstName} {profile.lastName} / 34
      </div>
      <div>Department :</div>
      <div>{profile.department}</div>
      <div>Rank :</div>
      <div>{profile.rank}</div>
      <div>Supervisor :</div>
      <div>{profile.supervisor}</div>
      <div>Assessor :</div>
      <div>{profile.assessor}</div>
      <div>Assigned PJ :</div>
      <div>{profile.assignedPj}</div>
      <div>Role :</div>
      <div>{profile.role}</div>
    </div>
  );
};

export default ProfileList;
