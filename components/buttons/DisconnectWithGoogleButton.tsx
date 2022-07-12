import { handleSubmitGoogleAccessToken } from '../../services/setDocToFirestore';

interface PropTypes {
  label: string;
  uid: string;
  accessToken: string | undefined;
}

const DisconnectWithGoogleButton = ({ label, uid, accessToken }: PropTypes) => {
  const url = '/api/revoke-google-refresh-token';
  const body = {
    uid,
    accessToken
  };

  return (
    <button
      className='w-auto h-7 bg-red-600 hover:bg-red-700 text-white font-semibold px-3 ml-3 mt-9 rounded-lg inline-block align-middle'
      onClick={async () => {
        await handleSubmitGoogleAccessToken(uid, '', '');
        // Deauthorize Google
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        if (response.status === 200) {
          alert('Google has been deauthorized');
          window.location.replace(window.location.pathname);
        }
      }}
    >
      {label}
    </button>
  );
};

export default DisconnectWithGoogleButton;
