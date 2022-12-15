// firebase related
import { signInWithPopup } from '@firebase/auth';
import {
  auth,
  googleProvider,
  microsoftProvider
} from '../../config/firebaseClient';

// styles
import WorkStats from '../../public/fulllogo_transparent_nobuffer.png';
import GoogleIcon from '@mui/icons-material/Google';
import MicrosoftIcon from '../../public/home-page/Microsoft-Logo.png';
import Image from 'next/image';
import JiraIcon from '../../public/home-page/Jira-Logo.png';
import AsanaIcon from '../../public/home-page/Asana-Official-Logo.png';
import SlackIcon from '../../public/slack-svgrepo-com.svg';
import GoogleCalendarIcon from '../../public/google-calendar-svgrepo-com.svg';
import GitHubIcon from '../../public/home-page/GitHub-Logo-64px.png';

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
        }, 1500);
      })
      .catch((error) => {
        // window.location.reload();
        console.log('error is: ', error);
      });
  };

  // Microsoft login handler. References are as below
  // https://firebase.google.com/docs/auth/web/microsoft-oauth
  // https://dev.to/425show/integrate-azure-ad-with-firebase-and-call-ms-graph-in-a-node-js-app-973
  const loginWithMicrosoft = () => {
    signInWithPopup(auth, microsoftProvider)
      .then((result) => {
        // Save these tokens to the user document in Firestore in the future
        // const credential = OAuthProvider.credentialFromResult(result);
        // const accessToken = credential?.accessToken;
        // @ts-ignore
        // const refreshToken = result._tokenResponse.refreshToken;

        // Get the signed-in user info.
        // @ts-ignore
        const email = result?._tokenResponse?.email || undefined;
        // @ts-ignore
        const firstName = result?._tokenResponse?.firstName || undefined;
        // @ts-ignore
        const lastName = result?._tokenResponse?.lastName || undefined;
        const user = result.user;
        const { uid, displayName } = user;
        const middleName =
          displayName?.split(' ').slice(1, -1).join(' ') || undefined;
        const photoURL = user?.photoURL || undefined;

        // Asynchronous functions are intentionally executed simultaneously without await
        createUserDoc(
          uid,
          firstName,
          middleName,
          lastName,
          email,
          photoURL
          // displayName || undefined
        );
        createNumbersDoc(uid);
      })
      .then(() => {
        // Workaround for Firebase authentication expires after 1 hour and nothing may be displayed after login.
        setTimeout(() => {
          window.location.reload();
        }, 1500);
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
      <div className='grid gap-4 md:gap-6 h-screen bg-slate-100 content-center justify-center justify-items-center'>
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
          <span className='text-green-300 text-base md:text-lg px-1.5 py-0 border-green-300 border rounded-md bg-slate-700'>
            Beta
          </span>
        </div>
        <h1 className='text-xl md:text-3xl text-center md:hidden'>
          Welcome to &quot;WorkStats&quot;
        </h1>
        <p className='px-4 text-lg md:text-2xl text-center'>
          WorkStats visualizes contribution of you and your team in numbers!
          <br></br>
          Aggregates from the following services.
        </p>
        <div className='flex gap-3'>
          <Image
            src={GitHubIcon}
            width={30}
            height={30}
            layout='intrinsic'
            alt='GitHub logo'
            quality={75}
            priority={false}
            placeholder='empty'
            className='bg-black rounded-full border-white border-4'
          />
          <Image
            src={JiraIcon}
            width={30}
            height={30}
            layout='intrinsic'
            alt='Jira'
            quality={100}
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
          <p className='px-4 text-lg md:text-2xl text-center'>
            Both login and sign up here.
          </p>
          <button
            className='text-white bg-blue-600 hover:bg-blue-800 font-bold rounded-md w-56 h-10'
            onClick={loginWithGoogle}
          >
            <GoogleIcon className='text-white mr-2' />
            Login with Google
          </button>
          <button
            className='flex text-slate-700 bg-white font-bold rounded-md w-56 h-10 place-items-center justify-center border-slate-400 border'
            onClick={loginWithMicrosoft}
          >
            <Image
              src={MicrosoftIcon}
              alt='Microsoft logo'
              width={28}
              height={28}
              layout='intrinsic'
              className='mr-2'
            />
            <div className='w-2'></div>
            Login with Microsoft
          </button>
          <p className='px-4 text-sm md:text-lg text-center'>
            * No credit card is required for free plan.
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
