// @ts-ignore
const ProfileList = ({ profileList }) => {
  return (
    <div
      id='profile-list'
      className='hidden md:grid md:grid-cols-2 md:gap-3 md:m-4 break-words'
    >
      <div>Full Name :</div>
      <div>
        {profileList.firstName} {profileList.middleName} {profileList.lastName}
      </div>
      <div>email :</div>
      <div>{profileList.email}</div>
      <div>Assigned PJ :</div>
      <div>{profileList.assignedPj}</div>
      <div>Role :</div>
      <div>{profileList.role}</div>
      <div>Rank :</div>
      <div>{profileList.rank}</div>
      <div>Department :</div>
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
