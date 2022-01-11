import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const ProfileList = () => {
  // const [state variable, fn to change the state] = useState(initial value of the state)
  const [profile, setProfile] = useState({});

  // The function passed to useEffect will work after the render result is reflected on the screen.
  // The second argument is the variable used in the useEffect, and it is compared before and after the useEffect, but the set function is immutable, so there is no need to assign it.
  useEffect(() => {
    // TODO: IDs can be obtained from the user list or from the logged-in user.
    const id = "REArvdg1hv5I6pkJ40nC";
    const docRef = doc(db, "users", id);
    getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
        setProfile({...docSnap.data(), id: docSnap.id});
      } else {
        console.log("No such document!");
      }
    });
  }, []);

  return (
    <div className="grid grid-rows-6 grid-flow-col gap-4 m-4">
      <div>Name / Age :</div>
      <div>Dept. / Rank :</div>
      <div>Supervisor :</div>
      <div>Assessor :</div>
      <div>Assigned PJ :</div>
      <div>Role :</div>
      <div>{profile.firstName} {profile.lastName} / 34</div>
      <div>{profile.department} / {profile.rank}</div>
      <div>{profile.supervisor}</div>
      <div>{profile.assessor}</div>
      <div>{profile.assignedPj}</div>
      <div>{profile.role}</div>
    </div>
  );
};

export default ProfileList;
