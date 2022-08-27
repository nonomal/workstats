import Image from 'next/image';
import { useEffect, useState } from 'react';
import getAvatarURL from '../../services/getAnImageFromStorage';
import { getPhotoURL } from '../../services/getDocFromFirestore';

// @ts-ignore
const Avatar = ({ userId }) => {
  const noImage = '/noProfileImage.png';
  const [avatarURL, setAvatarURL] = useState(noImage);
  const [photoURL, setPhotoURL] = useState(noImage);

  // Get the download URL in firebase storage, which is the primary
  useEffect(() => {
    getAvatarURL(userId).then((url) => {
      setAvatarURL(url);
    });
  }, [userId]);

  // Get the photoURL in firestore which is set by google/github login, which is secondary
  useEffect(() => {
    getPhotoURL(userId).then((url) => {
      url ? setPhotoURL(url) : null;
    });
  }, [userId]);

  return (
    <div className='hidden md:grid md:object-center md:m-4 md:w-64 md:h-64'>
      <Image
        className='inline object-cover rounded-full'
        src={avatarURL !== noImage ? avatarURL : photoURL}
        width={256}
        height={256}
        alt='Profile image'
      />
    </div>
  );
};

export default Avatar;
