// firebase related
import { signInWithPopup } from '@firebase/auth';
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

const Login = () => {
  // google login handler
  const loginWithGoogle = () => {
    signInWithPopup(auth, googleProvider).then((result) => {
      console.log('result is: ', result);
      window.location.reload();
    });
  };

  // github login handler
  const loginWithGithub = () => {
    signInWithPopup(auth, githubProvider).then((result) => {
      console.log('result is: ', result);
      window.location.reload();
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
            alt='asana logo'
          />
          <Image
            src={AsanaIcon}
            width={30}
            height={30}
            layout='intrinsic'
            alt='asana logo'
          />
          <Image
            src={SlackIcon}
            width={30}
            height={30}
            layout='intrinsic'
            alt='asana logo'
          />
          <Image
            src={GoogleCalendarIcon}
            width={30}
            height={30}
            layout='intrinsic'
            alt='asana logo'
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
