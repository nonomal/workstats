import React from 'react';
import { deleteAtlassianAccessToken } from '../../services/setDocToFirestore';

interface PropTypes {
  label: string;
  uid: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
}

const DisconnectWithAtlassianButton = ({ label, uid, setState }: PropTypes) => {
  const url = 'https://id.atlassian.com/manage-profile/apps';
  return (
    <button
      className='w-auto h-7 bg-red-600 hover:bg-red-700 text-white font-semibold px-3 ml-3 mt-1 md:mt-0 rounded-lg inline-block align-middle'
      onClick={() => {
        setState('');
        deleteAtlassianAccessToken(uid);
        window.open(url, '_blank');
      }}
    >
      {label}
    </button>
  );
};

export default DisconnectWithAtlassianButton;
