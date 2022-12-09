// Libraries
import Head from 'next/head';
import Image from 'next/image';

// Components
import LinkButton from '../components/buttons/LinkButton';

// Pictures
import JiraIcon from '../public/home-page/Jira-Logo.png';
import AsanaIcon from '../public/home-page/Asana-Official-Logo.png';
import SlackIcon from '../public/slack-svgrepo-com.svg';
import GoogleCalendarIcon from '../public/google-calendar-svgrepo-com.svg';
import GitHubIcon from '../public/github-svgrepo-com.svg';
import NotFound from '../public/home-page/Not-Found.png';
import PlayingCards from '../public/home-page/Playing-Cards.png';
import Report from '../public/home-page/Report.png';

export default function HomePage() {
  const contentHead =
    'A dashboard tool for engineers and project managers to quantify their productivity, aggregating various numbers from GitHub, Asana, Slack and Google Calendar.';

  return (
    <div className='bg-slate-50 px-1 md:px-16'>
      <Head>
        <title>Home Page - WorkStats</title>
        <meta name='description' content={contentHead} />
      </Head>
      <div className='h-6 md:h-14'></div>
      <div className='md:flex'>
        <div className='grid gap-3 md:gap-4 md:w-4/12 p-2 m-2 text-center content-center place-items-center'>
          <h2 className='text-3xl md:text-5xl font-bold text-gray-800'>
            WorkStats...
          </h2>
          <div className='text-2xl md:text-3xl text-gray-800'>
            <p className='md:p-0.5'>assists you & your team</p>
            <p className='md:p-0.5'>to check and improve</p>
            <p className='md:p-0.5'>your work quantitatively,</p>
            <p className='md:p-0.5'>aggregated from</p>
          </div>
          <div className='flex gap-3'>
            <Image
              src={GitHubIcon}
              width={30}
              height={30}
              layout='intrinsic'
              alt='GitHub'
              quality={100}
              priority={false}
              placeholder='empty'
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
              alt='Asana'
              quality={100}
              priority={false}
              placeholder='empty'
            />
            <Image
              src={SlackIcon}
              width={30}
              height={30}
              layout='intrinsic'
              alt='Slack'
              quality={100}
              priority={false}
              placeholder='empty'
            />
            <Image
              src={GoogleCalendarIcon}
              width={30}
              height={30}
              layout='intrinsic'
              alt='Google Calendar'
              quality={100}
              priority={false}
              placeholder='empty'
            />
          </div>
          <LinkButton href='/dashboard' label='Try For Free' />
        </div>
        <div className='hidden md:block md:w-8/12 md:h-103 m-4'>
          <iframe
            src='https://www.youtube.com/embed/vBTGarbKpUE?autoplay=1&mute=1&loop=1&playlist=vBTGarbKpUE'
            width='100%'
            height='100%'
            allow='autoplay; fullscreen; picture-in-picture'
            title='WorkStats Demo'
          ></iframe>
        </div>
        <div className='md:hidden h-136'>
          <iframe
            src='https://www.youtube.com/embed/4YwH8GpK2a8?autoplay=1&mute=1&loop=1&playlist=4YwH8GpK2a8' // 'shorts' should be replaced with 'embed' in the url. And autoplay does not work on mobile due to Google and Apple's policies. https://developers.google.com/youtube/iframe_api_reference#Autoplay_and_scripted_playback
            width='100%'
            height='100%'
            allow='autoplay; fullscreen; picture-in-picture'
            title='WorkStats Demo for Mobile'
          ></iframe>
        </div>
      </div>
      <div className='h-12 md:h-32'></div>
      <h2 className='text-3xl md:text-5xl font-bold text-gray-800 text-center'>
        What You Can Do...
      </h2>
      <div className='h-4 md:h-10'></div>
      <div className='md:flex justify-center'>
        <div className='text-center text-2xl md:text-3xl md:px-4 md:w-1/3'>
          <Image
            src={NotFound}
            width={300}
            height={300}
            layout='intrinsic'
            alt=''
            quality={100}
            priority={false}
            placeholder='empty'
          />
          <p className='h-12 md:h-24'>1. Know your numbers</p>
          <p className='text-lg md:text-xl'>
            First, know your outputs in numbers.
          </p>
          <p className='text-lg md:text-xl'>
            Then discuss issues with the numbers.
          </p>
        </div>
        <div className='text-center text-2xl md:text-3xl md:px-4 md:w-1/3'>
          <Image
            src={PlayingCards}
            width={300}
            height={300}
            layout='intrinsic'
            alt=''
            quality={100}
            priority={false}
            placeholder='empty'
          />
          <p className='h-12 md:h-24'>2. Improve operations</p>
          <p className='text-lg md:text-xl'>Decide on action plans, </p>
          <p className='text-lg md:text-xl'>which vary depending on metrics.</p>
          <p className='text-lg md:text-xl'>Solve by system or rules.</p>
        </div>
        <div className='text-center text-2xl md:text-3xl md:px-4 md:w-1/3'>
          <Image
            src={Report}
            width={300}
            height={300}
            layout='intrinsic'
            alt=''
            quality={100}
            priority={false}
            placeholder='empty'
          />
          <p className='h-12 md:h-24'>3. Keep tracking your numbers</p>
          <p className='text-lg md:text-xl'>
            Keep tracking the numbers for a while
          </p>
          <p className='text-lg md:text-xl'>to see if actions are working.</p>
          <p className='text-lg md:text-xl'>Then repeat 1-3.</p>
        </div>
      </div>
      <div className='h-12 md:h-32'></div>
    </div>
  );
}

HomePage.requiresAuth = false;
