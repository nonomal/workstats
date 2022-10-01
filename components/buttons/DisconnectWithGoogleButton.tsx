import { deleteGoogleAccessToken } from '../../services/setDocToFirestore';

interface PropTypes {
  label: string;
  uid: string;
  accessToken: string | undefined;
  setState: React.Dispatch<React.SetStateAction<string>>;
}

const DisconnectWithGoogleButton = ({
  label,
  uid,
  accessToken,
  setState
}: PropTypes) => {
  const url = '/api/revoke-google-refresh-token';
  const body = {
    uid,
    accessToken
  };

  return (
    <button
      className='w-auto h-7 bg-red-600 hover:bg-red-700 text-white font-semibold px-3 ml-3 mt-1 md:mt-0 rounded-lg inline-block align-middle'
      onClick={async () => {
        setState('');
        await deleteGoogleAccessToken(uid);
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
        }
      }}
    >
      {label}
    </button>
  );
};

export default DisconnectWithGoogleButton;
