// firebase related
import { signInWithPopup } from '@firebase/auth';
import { auth, googleProvider } from '../../config/firebaseClient';

// styles
import WorkStats from '../../public/fulllogo_transparent_nobuffer.png';
import GoogleIcon from '@mui/icons-material/Google';
import Image from 'next/image';
import AsanaIcon from '../../public/home-page/Asana-Official-Logo.png';
import SlackIcon from '../../public/slack-svgrepo-com.svg';
import GoogleCalendarIcon from '../../public/google-calendar-svgrepo-com.svg';
import GitHubIcon2 from '../../public/github-svgrepo-com.svg';

// Next related and Custom services
import {
  createNumbersDoc,
  createUserDoc
} from '../../services/setDocToFirestore';
import Head from 'next/head';

// Scopes in detail: https://developers.google.com/identity/protocols/oauth2/scopes#calendar
// const scopes = 'https://www.googleapis.com/auth/calendar.readonly	';
// googleProvider.addScope(scopes);

const Login = () => {
  // google login handler
  const loginWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const user = result.user;
        const { uid, displayName, email, photoURL } = user;
        const firstName = displayName?.split(' ')[0] || undefined;
        // Japanese sometimes write without a space between last name and first name
        const lastName =
          displayName?.split(' ').slice(-1)[0] !== firstName
            ? displayName?.split(' ').slice(-1)[0]
            : undefined;
        const middleName =
          displayName?.split(' ').slice(1, -1).join(' ') || undefined;

        // Asynchronous functions are intentionally executed simultaneously without await
        createUserDoc(
          uid,
          firstName,
          middleName,
          lastName,
          email || undefined,
          photoURL || undefined
          // displayName || undefined
        );
        createNumbersDoc(uid);
      })
      .then(() => {
        // Workaround for Firebase authentication expires after 1 hour and nothing may be displayed after login.
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        // window.location.reload();
        console.log('error is: ', error);
      });
  };

  return (
    <>
      <Head>
        <title>Login - WorkStats</title>
        <meta
          name='description'
          content='WorkStats login page, you can login or sign in with your Google or GitHub account. If you would like to learn more before logging in, please click on the Product Hunt button to go to the introduction page.'
        />
      </Head>
      <div className='grid gap-4 md:gap-6 h-screen bg-slate-800 content-center justify-center justify-items-center'>
        <div className='grid gap-1 md:gap-1 place-items-center'>
          <div className='w-72 md:w-96 h-auto'>
            <Image
              src={WorkStats}
              alt='WorkStats'
              layout='responsive'
              objectFit='cover'
              quality={100}
              priority={true}
              placeholder='empty'
            />
          </div>
          <span className='text-green-300 text-base md:text-lg px-1.5 py-0 border-green-300 border rounded-md'>
            Beta
          </span>
        </div>
        <h1 className='text-white text-xl md:text-3xl text-center md:hidden'>
          Welcome to &quot;WorkStats&quot;
        </h1>
        <p className='text-white px-4 text-lg md:text-2xl text-center'>
          WorkStats visualizes contribution of you and your team in numbers!
          <br></br>
          Aggregates from the following services.
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
        <div className='h-5 md:hidden'></div>
        <div className='grid gap-4 content-center justify-center justify-items-center'>
          <p className='text-white px-4 text-lg md:text-2xl text-center'>
            Both login and sign up here.
          </p>
          <button
            className='text-white bg-blue-600 hover:bg-blue-800 font-bold rounded-md w-52 h-10'
            onClick={loginWithGoogle}
          >
            <GoogleIcon className='text-white mr-2' />
            Login with Google
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
