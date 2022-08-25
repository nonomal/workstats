import React from 'react';
import { handleSubmitAsanaAccessToken } from '../../services/setDocToFirestore';

interface PropTypes {
  label: string;
  uid: string;
  refreshToken: string | undefined;
}

const DisconnectWithAsanaButton = ({ label, uid, refreshToken }: PropTypes) => {
  const url = '/api/revoke-asana-refresh-token';
  const body = {
    uid,
    refreshToken
  };

  return (
    <button
      className='w-auto h-7 bg-red-600 hover:bg-red-700 text-white font-semibold px-3 ml-3 mt-1 md:mt-0 rounded-lg inline-block align-middle'
      onClick={async () => {
        await handleSubmitAsanaAccessToken(uid, '', '', '');
        // Deauthorize Asana
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        if (response.status === 200) {
          alert('Asana has been deauthorized');
          window.location.replace(window.location.pathname);
        }
      }}
    >
      {label}
    </button>
  );
};

export default DisconnectWithAsanaButton;
