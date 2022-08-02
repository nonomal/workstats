// Libraries
import Head from 'next/head';
import Image from 'next/image';

// Components
import LinkButton from '../components/buttons/LinkButton';
import ProductHuntVote from '../components/buttons/ProductHunt';

// Pictures
import Dashboard from '../public/home-page/WorkStats_Dashboard2.png';
import Dashboard_Mobile from '../public/home-page/WorkStats_Dashboard_Mobile.png';
import AsanaIcon from '../public/home-page/Asana-Official-Logo.png';
import SlackIcon from '../public/slack-svgrepo-com.svg';
import GoogleCalendarIcon from '../public/google-calendar-svgrepo-com.svg';
import GitHubIcon from '../public/github-svgrepo-com.svg';
import A_Team_Meeting from '../public/home-page/A-team-meeting.jpg';
import An_Evaluation_Meeting from '../public/home-page/An-evaluation-meeting.jpg';
import A_1on1_Meeting from '../public/home-page/A-1on1-meeting.jpg';
import Issue1 from '../public/home-page/WorkStats_Dashboard_Issue1.png';
import Issue2 from '../public/home-page/WorkStats_Dashboard_Issue2.png';
import Issue3 from '../public/home-page/WorkStats_Dashboard_Issue3.png';
import WorkStats_Users_By_Country from '../public/home-page/workstats-users-by-country.png';
import ProductHunt from '../public/home-page/Logo_ProductHunt.png';
import BetaList from '../public/home-page/Logo_BetaList.png';
import StartupBase from '../public/home-page/Logo_StartupBase.png';
import Betafy from '../public/home-page/Logo_Betafy.png';

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
        <div className='grid gap-3 md:gap-4 md:w-5/12 p-2 m-2 text-center content-center place-items-center'>
          <h2 className='text-3xl md:text-5xl font-bold text-grey-800'>
            WorkStats is...
          </h2>
          <div className='text-2xl md:text-3xl text-grey-800'>
            <p className='md:p-0.5'>a dashboard tool</p>
            {/* <p className='md:p-0.5'>
              for engineers and project managers
            </p> */}
            <p className='md:p-0.5'>to quantify your productivity</p>
            <p className='md:p-0.5'>by visualizing numbers</p>
            <p className='md:p-0.5'>from services such as;</p>
          </div>
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
          <LinkButton href='/dashboard' label='Get Started' />
        </div>
        <div className='hidden md:block md:w-8/12 m-4 rounded-2xl border border-slate-300'>
          <Image
            src={Dashboard}
            alt='A dashboard'
            layout='responsive'
            objectFit='contain'
            quality={100}
            priority={true}
            placeholder='empty'
            className='rounded-2xl'
          />
        </div>
        <div className='md:hidden m-4 rounded-2xl border border-slate-300'>
          <Image
            src={Dashboard_Mobile}
            alt='A dashboard'
            layout='responsive'
            objectFit='contain'
            quality={100}
            priority={true}
            placeholder='empty'
            className='rounded-2xl'
          />
        </div>
      </div>
      <div className='h-12 md:h-32'></div>
      <h2 className='text-3xl md:text-5xl font-bold text-grey-800 text-center'>
        Issues we think
      </h2>
      <div className='h-4 md:h-10'></div>
      <div className='text-center md:hidden p-2 m-2 text-2xl font-semibold text-grey-800'>
        <h3>1. For weekly project meetings &quot;without numbers&quot;</h3>
      </div>
      <div className='md:flex'>
        <div className='hidden md:block md:w-5/12 m-4 rounded-2xl'>
          <Image
            src={A_Team_Meeting}
            alt='A team meeting photo'
            layout='responsive'
            objectFit='cover'
            quality={100}
            priority={true}
            placeholder='empty'
            className='rounded-2xl'
          />
        </div>
        <div className='md:hidden m-4 rounded-2xl'>
          <Image
            src={A_Team_Meeting}
            alt='A team meeting photo'
            layout='responsive'
            objectFit='cover'
            quality={100}
            priority={true}
            placeholder='empty'
            className='rounded-2xl object-cover h-10'
          />
        </div>
        <div className='grid gap-2 md:gap-4 md:w-7/12 p-2 m-2 text-center content-center place-items-center'>
          <div className='hidden md:block text-2xl md:text-4xl font-semibold text-grey-800'>
            <h3>1. For weekly project meetings</h3>
            <h3>&quot;without numbers&quot;</h3>
          </div>
          <div className='text-lg md:text-2xl text-grey-800'>
            <p className='p-1 md:p-2'>
              <b className='text-gray-800'>Velocity</b> for each member is often{' '}
              <b className='text-gray-800'>not quantified</b>. (ex: average 8.2
              tasks / week / member)
            </p>
            <p className='p-1 md:p-2'>
              Members often{' '}
              <b className='text-gray-800'>
                don’t know their own numbers, or other members’
              </b>
              . The same is true for PJ leaders. So they don’t know{' '}
              <b className='text-gray-800'>if their numbers are Good or Not</b>.
            </p>
          </div>
        </div>
        {/* <div className='md:w-20'></div> */}
      </div>
      <div className='h-8 md:h-20'></div>
      <div className='text-center md:hidden p-2 m-2 text-2xl font-semibold text-grey-800'>
        <h3>2. For monthly 1-on-1 meetings &quot;without numbers&quot;</h3>
      </div>
      <div className='md:flex'>
        <div className='md:hidden m-4 rounded-2xl'>
          <Image
            src={A_1on1_Meeting}
            alt='A 1-on-1 meeting photo'
            layout='responsive'
            objectFit='cover'
            quality={100}
            priority={true}
            placeholder='empty'
            className='rounded-2xl object-cover h-10'
          />
        </div>
        <div className='grid gap-2 md:gap-4 md:w-7/12 p-2 m-2 text-center content-center place-items-center'>
          <div className='hidden md:block text-2xl md:text-4xl font-semibold text-grey-800'>
            <h3>2. For monthly 1-on-1 meetings</h3>
            <h3>&quot;without numbers&quot;</h3>
          </div>
          <div className='text-lg md:text-2xl text-grey-800'>
            <p className='p-1 md:p-2'>
              <b className='text-gray-800'>Qualitative</b> 1-on-1s are{' '}
              <b className='text-gray-800'>fine as long as</b> the relationship
              between them is good or a good evaluation is given.
            </p>
            <p className='p-1 md:p-2'>
              <b className='text-gray-800'>When it’s not</b>, communication will
              be sensitive. <b className='text-gray-800'>Without numbers</b>,
              this will{' '}
              <b className='text-gray-800'>lack persuasiveness & objectivity</b>
              .
            </p>
          </div>
        </div>
        <div className='hidden md:block md:w-5/12 m-4 rounded-2xl'>
          <Image
            src={A_1on1_Meeting}
            alt='A 1-on-1 meeting photo'
            layout='responsive'
            objectFit='cover'
            quality={100}
            priority={true}
            placeholder='empty'
            className='rounded-2xl'
          />
        </div>
      </div>
      <div className='h-8 md:h-20'></div>
      <div className='text-center md:hidden p-2 m-2 text-2xl font-semibold text-grey-800'>
        <h3>
          3. For half-year evaluation meetings &quot;without numbers&quot;
        </h3>
      </div>
      <div className='md:flex'>
        <div className='hidden md:block md:w-5/12 m-4 rounded-2xl'>
          <Image
            src={An_Evaluation_Meeting}
            alt='An evaluation meeting photo'
            layout='responsive'
            objectFit='cover'
            quality={100}
            priority={true}
            placeholder='empty'
            className='rounded-2xl'
          />
        </div>
        <div className='md:hidden m-4 rounded-2xl'>
          <Image
            src={An_Evaluation_Meeting}
            alt='An evaluation meeting photo'
            layout='responsive'
            objectFit='cover'
            quality={100}
            priority={true}
            placeholder='empty'
            className='rounded-2xl object-cover h-10'
          />
        </div>
        <div className='grid gap-2 md:gap-4 md:w-7/12 p-2 m-2 text-center content-center place-items-center'>
          <div className='hidden md:block text-2xl md:text-4xl font-semibold text-grey-800'>
            <h3>3. For half-year evaluation meetings</h3>
            <h3>&quot;without numbers&quot;</h3>
          </div>
          <div className='text-lg md:text-2xl text-grey-800'>
            <p className='p-1 md:p-2'>
              When a company size grows, it goes{' '}
              <b className='text-gray-800'>difficult</b> for a evaluator to
              <b className='text-gray-800'>
                understand other evaluators’ evaluation
              </b>
              .
            </p>
            <p className='p-1 md:p-2'>
              The time per an evaluated gets less than{' '}
              <b className='text-gray-800'>5 minutes</b>.
            </p>
            <p className='p-1 md:p-2'>
              <b className='text-gray-800'>Without</b> numbers,{' '}
              <b className='text-gray-800'>the problem gets worse</b>.
            </p>
          </div>
        </div>
      </div>
      <div className='h-12 md:h-32'></div>
      <h2 className='text-3xl md:text-5xl font-bold text-grey-800 text-center'>
        How we solve the issues
      </h2>
      <div className='h-4 md:h-10'></div>
      <div className='text-center md:hidden p-2 m-2 text-2xl font-semibold text-grey-800'>
        <h3>1. For weekly project meetings</h3>
      </div>
      <div className='md:flex'>
        <div className='hidden md:block md:w-5/12 m-4 rounded-2xl border border-slate-300'>
          <Image
            src={Issue1}
            alt='A dashboard photo with issue 1'
            layout='responsive'
            objectFit='cover'
            quality={100}
            priority={true}
            placeholder='empty'
            className='rounded-2xl'
          />
        </div>
        <div className='md:hidden m-4 rounded-2xl border border-slate-300'>
          <Image
            src={Issue1}
            alt='A dashboard photo with issue 1'
            layout='responsive'
            objectFit='cover'
            quality={100}
            priority={true}
            placeholder='empty'
            className='rounded-2xl object-cover h-10'
          />
        </div>
        <div className='grid gap-2 md:gap-4 md:w-7/12 p-2 m-2 text-center content-center place-items-center'>
          <div className='hidden md:block text-2xl md:text-4xl font-semibold text-grey-800'>
            <h3>1. For weekly project meetings</h3>
          </div>
          <div className='text-lg md:text-2xl text-grey-800'>
            <p className='p-1 md:p-2'>
              For example, <b className='text-gray-800'>compare</b> velocities
              within your team.
            </p>
            <p className='p-1 md:p-2'>
              If a member/team has a <b className='text-gray-800'>poorer</b>{' '}
              number, it may have issues. But with this number, you can think
              about it <b className='text-gray-800'>objectively</b>.
            </p>
            <p className='p-1 md:p-2'>
              And it will be <b className='text-gray-800'>easier</b> to consider
              the <b className='text-gray-800'>cause</b>, like if tasks are too
              big, or if the member tend to struggle alone.
            </p>
          </div>
        </div>
      </div>
      <div className='h-8 md:h-20'></div>
      <div className='text-center md:hidden p-2 m-2 text-2xl font-semibold text-grey-800'>
        <h3>2. For monthly 1-on-1 meetings</h3>
      </div>
      <div className='md:flex'>
        <div className='md:hidden m-4 rounded-2xl border border-slate-300'>
          <Image
            src={Issue2}
            alt='A dashboard photo with issue 2'
            layout='responsive'
            objectFit='cover'
            quality={100}
            priority={true}
            placeholder='empty'
            className='rounded-2xl object-cover h-10'
          />
        </div>
        <div className='grid gap-2 md:gap-4 md:w-7/12 p-2 m-2 text-center content-center place-items-center'>
          <div className='hidden md:block text-2xl md:text-4xl font-semibold text-grey-800'>
            <h3>2. For monthly 1-on-1 meetings</h3>
          </div>
          <div className='text-lg md:text-2xl text-grey-800'>
            <p className='p-1 md:p-2'>
              For example, <b className='text-gray-800'>compare</b> the number
              of outgoing messages within the team.
            </p>
            <p className='p-1 md:p-2'>
              If a member/team has a <b className='text-gray-800'>poorer</b>{' '}
              number, it may have issues. But with this number, you can think
              about it <b className='text-gray-800'>objectively</b>.
            </p>
            <p className='p-1 md:p-2'>
              And it will be <b className='text-gray-800'>easier</b> to consider
              the <b className='text-gray-800'>cause</b>, if it is a lack of
              familiarity with others or a cultural difference.
            </p>
          </div>
        </div>
        <div className='hidden md:block md:w-5/12 m-4 rounded-2xl border border-slate-300'>
          <Image
            src={Issue2}
            alt='A dashboard photo with issue 2'
            layout='responsive'
            objectFit='cover'
            quality={100}
            priority={true}
            placeholder='empty'
            className='rounded-2xl'
          />
        </div>
      </div>
      <div className='h-8 md:h-20'></div>
      <div className='text-center md:hidden p-2 m-2 text-2xl font-semibold text-grey-800'>
        <h3>3. For half-year evaluation meetings</h3>
      </div>
      <div className='md:flex'>
        <div className='hidden md:block md:w-5/12 m-4 rounded-2xl border border-slate-300'>
          <Image
            src={Issue3}
            alt='A dashboard photo with issue 3'
            layout='responsive'
            objectFit='cover'
            quality={100}
            priority={true}
            placeholder='empty'
            className='rounded-2xl'
          />
        </div>
        <div className='md:hidden m-4 rounded-2xl border border-slate-300'>
          <Image
            src={Issue3}
            alt='A dashboard photo with issue 3'
            layout='responsive'
            objectFit='cover'
            quality={100}
            priority={true}
            placeholder='empty'
            className='rounded-2xl object-cover h-10'
          />
        </div>
        <div className='grid gap-2 md:gap-4 md:w-7/12 p-2 m-2 text-center content-center place-items-center'>
          <div className='hidden md:block text-2xl md:text-4xl font-semibold text-grey-800'>
            <h3>3. For half-year evaluation meetings</h3>
          </div>
          <div className='text-lg md:text-2xl text-grey-800'>
            <p className='p-1 md:p-2'>
              For example, <b className='text-gray-800'>compare</b> a manager’s
              number of code reviews with others’.
            </p>
            <p className='p-1 md:p-2'>
              The manager may not be a good{' '}
              <b className='text-gray-800'>self-presenter</b>, but the number of
              code reviews may be <b className='text-gray-800'>outstanding</b>.
            </p>
            <p className='p-1 md:p-2'>
              More reviews are <b className='text-gray-800'>not always</b>{' '}
              better. The <b className='text-gray-800'>quantity of feedback</b>,
              the # of comments, should also be reviewed.{' '}
              <b className='text-gray-800'>With numbers</b>, constructive
              discussions will occur.
            </p>
          </div>
        </div>
      </div>
      <div className='h-12 md:h-32'></div>
      <h2 className='text-3xl md:text-5xl font-bold text-grey-800 text-center'>
        Customers by country
      </h2>
      <div className='h-4 md:h-10'></div>
      <div className='text-xl md:text-3xl text-grey-800 p-2 m-2 text-center content-center place-items-center'>
        <p className='p-1 md:p-2'>
          WorkStats users are in 41 countries worldwide.
        </p>
      </div>
      <div className='flex place-content-center'>
        <div className='w-full md:w-9/12 m-4 rounded-2xl border border-slate-300'>
          <Image
            src={WorkStats_Users_By_Country}
            alt='A dashboard'
            layout='responsive'
            objectFit='contain'
            quality={100}
            priority={true}
            placeholder='empty'
            className='rounded-2xl'
          />
        </div>
      </div>
      <div className='h-12 md:h-32'></div>
      <h2 className='text-3xl md:text-5xl font-bold text-grey-800 text-center'>
        Media coverage
      </h2>
      <div className='h-8 md:h-20'></div>
      <div className='flex place-content-center'>
        <div className='grid grid-cols-4 gap-y-2 gap-x-4 md:gap-y-2 md:gap-x-14 w-9/12 md:w-6/12 text-center text-xl md:text-2xl text-grey-800'>
          <a
            href='https://www.producthunt.com/products/workstats#workstats'
            target='_blank'
            rel='noreferrer noopener' // Must pair with target='_blank'
          >
            <Image
              src={ProductHunt}
              alt='Product Hunt logo'
              layout='responsive'
              objectFit='cover'
              quality={100}
              priority={true}
              placeholder='empty'
              className='h-10 rounded-full'
            />
          </a>
          <a
            href='https://betalist.com/startups/workstats'
            target='_blank'
            rel='noreferrer noopener' // Must pair with target='_blank'
          >
            <Image
              src={BetaList}
              alt='Beta List logo'
              layout='responsive'
              objectFit='cover'
              quality={100}
              priority={true}
              placeholder='empty'
              className='h-10 rounded-full'
            />
          </a>
          <a
            href='https://startupbase.io/startups/workstats'
            target='_blank'
            rel='noreferrer noopener' // Must pair with target='_blank'
          >
            <Image
              src={StartupBase}
              alt='Startup Base logo'
              layout='responsive'
              objectFit='cover'
              quality={100}
              priority={true}
              placeholder='empty'
              className='h-10 rounded-full'
            />
          </a>
          <a
            href='https://www.betafy.co/startup/workstats'
            target='_blank'
            rel='noreferrer noopener' // Must pair with target='_blank'
          >
            <Image
              src={Betafy}
              alt='Betafy logo'
              layout='responsive'
              objectFit='cover'
              quality={100}
              priority={true}
              placeholder='empty'
              className='h-10 rounded-full'
            />
          </a>
          <p>Product Hunt</p>
          <p>Beta List</p>
          <p>Startup Base</p>
          <p>Betafy</p>
        </div>
      </div>
      <div className='h-4 md:h-10'></div>
      <div className='flex place-content-center'>
        <ProductHuntVote />
      </div>
      <div className='h-12 md:h-32'></div>
      <h2 className='text-3xl md:text-5xl font-bold text-grey-800 text-center'>
        Try WorkStats today
      </h2>
      <div className='h-4 md:h-10'></div>
      <div className='text-xl md:text-3xl text-grey-800 p-2 m-2 text-center content-center place-items-center'>
        <p className='p-1 md:p-2'>Know your numbers.</p>
        <p className='p-1 md:p-2'>Keep tracking your numbers.</p>
        <p className='p-1 md:p-2'>Take action to drive your numbers.</p>
        <div className='h-2 md:h-4'></div>
        <LinkButton href='/dashboard' label='Get Started' />
      </div>
      <div className='h-12 md:h-32'></div>
    </div>
  );
}

HomePage.requiresAuth = false;
