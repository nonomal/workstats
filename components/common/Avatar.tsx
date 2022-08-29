import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getPhotoURL } from '../../services/getDocFromFirestore';

interface AvatarProps {
  userId: string;
  isUploaded?: number;
}
const Avatar = ({ userId, isUploaded }: AvatarProps) => {
  const noImage = '/noProfileImage.png';
  const [photoURL, setPhotoURL] = useState(noImage);

  // Get the photoURL in firestore which is set by google login or by users
  // isUploaded increases when the user uploads a new photo, so the useEffect will run again
  useEffect(() => {
    getPhotoURL(userId).then((url) => {
      url ? setPhotoURL(url) : null;
    });
  }, [userId, isUploaded]);

  return (
    <div className='hidden md:block md:object-center md:m-4 md:mb-0 md:w-64 md:h-60'>
      <Image
        className='inline object-cover rounded-full'
        src={photoURL}
        width={256}
        height={256}
        alt='Profile image'
      />
    </div>
  );
};

export default Avatar;
