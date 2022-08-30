import { useState } from 'react';
import Avatar from '../../components/common/Avatar';
import uploadAnImageToFirebaseStorage from '../../services/uploadAnImageToFirebaseStorage';

interface SettingsForAvatarProps {
  uid: string;
}

const SettingsForAvatar = ({ uid }: SettingsForAvatarProps) => {
  const [isUploaded, setIsUploaded] = useState(0);

  return (
    <div id='avatar' className='hidden md:grid justify-items-center mt-5'>
      <Avatar userId={uid} isUploaded={isUploaded} />
      <div>
        <input
          type='file'
          accept='image/*'
          id='avatar-upload'
          className='block cursor-pointer rounded-lg w-64 py-0 mx-3 border border-gray-300 bg-white text-gray-700 file:cursor-pointer file:py-1 file:px-2 file:mr-3 file:border-0 file:border-r file:border-gray-200 file:text-slate-800 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-gray-500'
          onChange={async (event) => {
            const file = event.target.files?.[0];
            file
              ? await uploadAnImageToFirebaseStorage({
                  docId: uid,
                  file,
                  isUploaded,
                  setIsUploaded
                })
              : null;
          }}
        />
        <p className='px-2 mx-3 py-1 my-1 text-base text-gray-500'>
          PNG, JPG, SVG, or GIF files are available.
        </p>
      </div>
    </div>
  );
};

export default SettingsForAvatar;
