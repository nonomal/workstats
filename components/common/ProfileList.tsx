// @ts-ignore
const ProfileList = ({ profileList }) => {
  return (
    <div
      id='profile-list'
      className='hidden md:grid md:grid-cols-2 md:gap-1 md:m-4 md:mr-0 break-words md:w-48'
    >
      <div>Full Name :</div>
      <div>
        {profileList.firstName} {profileList.middleName} {profileList.lastName}
      </div>
      <div>E-mail :</div>
      <div>{profileList.email}</div>
      <div>Assigned :</div>
      <div>{profileList.assignedPj}</div>
      <div>Role :</div>
      <div>{profileList.role}</div>
      <div>Rank :</div>
      <div>{profileList.rank}</div>
      <div>Dept. :</div>
      <div>{profileList.department}</div>
      <div>Supervisor :</div>
      <div>{profileList.supervisor}</div>
      <div>Assessor :</div>
      <div>{profileList.assessor}</div>
      <div>Company :</div>
      <div>{profileList.company}</div>
      <div>Country :</div>
      <div>{profileList.country}</div>
    </div>
  );
};

export default ProfileList;
