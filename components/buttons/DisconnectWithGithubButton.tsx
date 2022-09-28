import React from 'react';
import { handleSubmitGithubAccessToken } from '../../services/setDocToFirestore';

interface PropTypes {
  label: string;
  uid: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
}

const DisconnectWithGithubButton = ({ label, uid, setState }: PropTypes) => {
  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const url = `https://github.com/settings/connections/applications/${clientId}`;
  return (
    <button
      className='w-auto h-7 bg-red-600 hover:bg-red-700 text-white font-semibold px-3 ml-3 mt-1 md:mt-0 rounded-lg inline-block align-middle'
      onClick={async () => {
        setState('');
        await handleSubmitGithubAccessToken(uid, '', '', '', true).then(() => {
          window.open(url, '_blank');
        });
      }}
    >
      {label}
    </button>
  );
};

export default DisconnectWithGithubButton;
