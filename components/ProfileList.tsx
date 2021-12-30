import React from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const docRef = doc(db, "users");
const docSnap = await getDoc(docRef);

const ProfileList = () => {
  return (
    <div className="grid grid-rows-6 grid-flow-col gap-4 m-4">
      <div>Name / Age :</div>
      <div>Dept. / Rank :</div>
      <div>Supervisor :</div>
      <div>Assessor :</div>
      <div>Assigned PJ :</div>
      <div>Role :</div>
      <div>Hiroshi Nishio / 34</div>
      <div>Product Dev / Senior Manager</div>
      <div>James Bond</div>
      <div>Money Penny</div>
      <div>xxx App Development, xxx Marketing KPI</div>
      <div>Developer, Reviewer</div>
    </div>
  );
};

export default ProfileList;
