// firebase related
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup
} from '@firebase/auth';
import {
  auth,
  githubProvider,
  googleProvider
} from '../../config/firebaseClient';

// styles
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import Image from 'next/image';
import AsanaIcon from '../../public/asana-svgrepo-com.svg';
import SlackIcon from '../../public/slack-svgrepo-com.svg';
import GoogleCalendarIcon from '../../public/google-calendar-svgrepo-com.svg';
import GitHubIcon2 from '../../public/github-svgrepo-com.svg';

// Scopes in detail: https://developers.google.com/identity/protocols/oauth2/scopes#calendar
const scopes = 'https://www.googleapis.com/auth/calendar.readonly	';
googleProvider.addScope(scopes);

const Login = () => {
  // google login handler
  const loginWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        console.log('result is: ', result);
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        console.log('credential is: ', credential);
        const token = credential?.accessToken;
        console.log('token is: ', token);
        // The signed-in user info.
        const user = result.user;
        console.log('user is: ', user);
        window.location.reload();
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        console.log('errorCode is: ', errorCode);
        const errorMessage = error.message;
        console.log('errorMessage is: ', errorMessage);
        // The email of the user's account used.
        const email = error.email;
        console.log('email is: ', email);
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log('credential is: ', credential);
      });
  };

  // github login handler
  const loginWithGithub = () => {
    signInWithPopup(auth, githubProvider)
      .then((result) => {
        console.log('result is: ', result);
        const credential = GithubAuthProvider.credentialFromResult(result);
        console.log('credential is: ', credential);
        const token = credential?.accessToken;
        console.log('token is: ', token);
        const user = result.user;
        console.log('user is: ', user);
        window.location.reload();
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        console.log('errorCode is: ', errorCode);
        const errorMessage = error.message;
        console.log('errorMessage is: ', errorMessage);
        // The email of the user's account used.
        const email = error.email;
        console.log('email is: ', email);
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log('credential is: ', credential);
      });
  };

  return (
    <div className='flex'>
      <div className='grid gap-4 w-1/2 h-screen bg-white content-center justify-center justify-items-center'>
        <p className='text-xl text-slate-900'>Log in with OAuth provider</p>
        <button
          className='text-white bg-blue-600 hover:bg-blue-800 font-bold rounded-md w-52 h-10'
          onClick={loginWithGoogle}
        >
          <GoogleIcon className='text-white mr-2' />
          Login with Google
        </button>
        <button
          className='text-white bg-gray-600 hover:bg-gray-800 font-bold rounded-md w-52 h-10'
          onClick={loginWithGithub}
        >
          <GitHubIcon className='text-white mr-2' />
          Login with GitHub
        </button>
      </div>
      <div className='grid gap-6 w-1/2 h-screen bg-slate-800 content-center justify-center justify-items-center'>
        <h1 className='text-white text-5xl text-center'>
          Welcome to &quot;WorkStats&quot;
        </h1>
        <p className='text-white text-2xl text-center'>
          This app visualizes contribution of you and your team in numbers!
        </p>
        <p className='text-white text-2xl text-center'>
          Aggregate from the following services.
        </p>
        <div className='flex gap-3'>
          <Image
            src={GitHubIcon2}
            width={30}
            height={30}
            layout='intrinsic'
            alt='GitHub logo'
            quality={75}
            priority={false}
            placeholder='empty'
          />
          <Image
            src={AsanaIcon}
            width={30}
            height={30}
            layout='intrinsic'
            alt='Asana logo'
            quality={75}
            priority={false}
            placeholder='empty'
          />
          <Image
            src={SlackIcon}
            width={30}
            height={30}
            layout='intrinsic'
            alt='Slack logo'
            quality={75}
            priority={false}
            placeholder='empty'
          />
          <Image
            src={GoogleCalendarIcon}
            width={30}
            height={30}
            layout='intrinsic'
            alt='Google Calendar logo'
            quality={75}
            priority={false}
            placeholder='empty'
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
