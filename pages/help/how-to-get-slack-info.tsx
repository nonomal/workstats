// React and Next.js
import Head from 'next/head';
import Image from 'next/image';

// Images
import SlackIcon from '../../public/slack-svgrepo-com.svg';
import UserSettings_SlackInfo_InitialState from '../../public/help/UserSettings_SlackInfo_InitialState.png';
import SlackLogin from '../../public/help/Slack_Login.png';
import SlackWorkspaceId from '../../public/help/Slack_WorkspaceId.png';
import SlackLogin2 from '../../public/help/Slack_Login2.png';
import SlackRequestPermission from '../../public/help/Slack_RequestPermission.png';
import SlackRequestToInstall from '../../public/help/Slack_RequestToInstall.png';
import SlackAppDirectoryRequestSubmitted from '../../public/help/Slack_AppDirectory_RequestSubmitted.png';
import SlackDMSlackBotRequestApproval from '../../public/help/Slack_DM_SlackBot_RequestApproval.png';
import Slack_DM_SlackBot_ToAdmin_Approved from '../../public/help/Slack_DM_SlackBot_ToAdmin_Approved.png';
import Slack_DM_SlackBot_ToUser_Approved from '../../public/help/Slack_DM_SlackBot_ToUser_Approved.png';
import UserSettings_SlackInfo_Redirected from '../../public/help/UserSettings_SlackInfo_Redirected.png';
import UserSettings_SlackInfo_Connected from '../../public/help/UserSettings_SlackInfo_Connected.png';
import Dashboard_Slack_Aggregated from '../../public/help/Dashboard_Slack_Aggregated.png';
import UserSettings_SlackInfo_Disconnecting from '../../public/help/UserSettings_SlackInfo_Disconnecting.png';

const HelpPageHowToGetSlackInfo = () => {
  return (
    <>
      <Head>
        <title>How to get Slack Info - WorkStats</title>
        <meta
          name='description'
          content='This help page explains the settings required to aggregate numbers from Slack in WorkStats and how to configure them'
        />
      </Head>
      <main className='px-5'>
        <div className='flex py-4'>
          <h1 className='text-2xl md:text-3xl pr-2 md:pr-3'>
            How to get Slack info
          </h1>
          <div className='mt-1 md:mt-0.5 w-6 md:w-8'>
            <Image
              src={SlackIcon}
              layout='responsive'
              alt='Slack logo'
              quality={75}
              priority={false}
              placeholder='empty'
            />
          </div>
        </div>
        <h2 className='text-lg md:text-2xl py-2 md:py-4'>
          1. Open the User Settings page and press the &quot;Connect with
          Slack&quot; button.
        </h2>
        <p className='text-sm md:text-base py-1 pb-4'>
          Pressing this button does not mean that the linkage will be
          established immediately. It can also be immediately cancelled after
          the linkage is established.
        </p>
        <div className='w-full md:w-3/4 h-auto'>
          <Image
            src={UserSettings_SlackInfo_InitialState}
            alt='Slack info with an initial state in user settings'
            layout='intrinsic'
            quality={75}
            priority={false}
            placeholder='empty'
          />
        </div>
        <h2 className='text-lg md:text-2xl py-2 md:py-4'>
          2. Enter the name of the workspace you want to log in to.
        </h2>
        <p className='hidden md:contents text-sm md:text-base py-1 pb-4'>
          To know the workspace ID you want to log in to, open that workspace
          and click on the workspace name in the upper left corner. The
          workspace ID will then be displayed.
        </p>
        <div className='md:flex md:pt-4'>
          <div className='w-full md:w-6/12'>
            <Image
              src={SlackLogin}
              alt='Slack login page'
              layout='intrinsic'
              quality={75}
              priority={false}
              placeholder='empty'
            />
          </div>
          <p className='md:hidden text-sm md:text-base py-1 pb-4'>
            To know the workspace ID you want to log in to, open that workspace
            and click on the workspace name in the upper left corner. The
            workspace ID will then be displayed.
          </p>
          <div className='w-full md:w-6/12'>
            <Image
              src={SlackWorkspaceId}
              alt='Slack Workspace ID'
              layout='intrinsic'
              quality={75}
              priority={false}
              placeholder='empty'
            />
          </div>
        </div>
        <h2 className='text-lg md:text-2xl py-2 md:py-4'>3. Log in to Slack</h2>
        <p className='text-sm md:text-base py-1 pb-4'>
          Log in with the account from which you want to retrieve data. If you
          are using multiple accounts, don&apos;t worry if you log in with the
          wrong account, you can redo it later!
        </p>
        <div className='w-full md:w-1/4'>
          <Image
            src={SlackLogin2}
            alt='Slack login page'
            layout='intrinsic'
            quality={75}
            priority={false}
            placeholder='empty'
          />
        </div>
        <h2 className='text-lg md:text-2xl py-2 md:py-4'>
          4. Authorization request is displayed, check the contents and press
          the &quot;Allow&quot; button.
        </h2>
        <p className='text-sm md:text-base py-1 pb-4'>
          The scope required for aggregation in WorkStats will be displayed. (If
          the user is a Slack admin, or if the workspace is configured to not
          require authorization to install the app) Check it and if it is OK,
          click the &quot;Allow&quot; button. Then jump to step 8.
        </p>
        <div className='w-full md:w-2/6'>
          <Image
            src={SlackRequestPermission}
            alt='Slack request permission page'
            layout='intrinsic'
            quality={75}
            priority={false}
            placeholder='empty'
          />
        </div>
        <p className='text-sm md:text-base py-1 pb-4'>
          If you did not see this screen, go to the next step 5.
        </p>
        <h2 className='text-lg md:text-2xl py-2 md:py-4'>
          5. If the app installation request screen appears, please make a
          request.
        </h2>
        <p className='text-sm md:text-base py-1 pb-4'>
          If the user is not a Slack admin, and the workspace is configured to
          require Admin approval to install the app, a screen will appear asking
          you to submit a request to the Admin to install the WorkStats app.
        </p>
        <p className='hidden md:contents text-sm md:text-base py-1 pb-4'>
          Clicking &quot;Submit&quot; button will take you to an administration
          page where you will see that you are awaiting approval.
        </p>
        <div className='md:flex md:pt-4 md:place-items-center'>
          <div className='w-full md:w-4/12 md:pr-1'>
            <Image
              src={SlackRequestToInstall}
              alt='Slack login page'
              layout='intrinsic'
              quality={75}
              priority={false}
              placeholder='empty'
            />
          </div>
          <p className='md:hidden text-sm md:text-base py-1 pb-4'>
            Clicking &quot;Submit&quot; button will take you to an
            administration page where you will see that you are awaiting
            approval.
          </p>
          <div className='hidden md:contents md:px-3'>{'=>'}</div>
          <div className='w-full md:w-8/12 md:pl-1'>
            <Image
              src={SlackAppDirectoryRequestSubmitted}
              alt='Slack Workspace ID'
              layout='intrinsic'
              quality={75}
              priority={false}
              placeholder='empty'
            />
          </div>
        </div>
        <h2 className='text-lg md:text-2xl py-2 md:py-4'>
          6. Wait for your request to be approved or contact the Admin (if you
          know).
        </h2>
        <p className='text-sm md:text-base py-1 pb-4'>
          SlackBot will send a direct message to the Admin and the user needs to
          wait for the approval. Prompt the Admin as needed. For the Slack
          Admin, see the details here;{' '}
          <a
            className='py-1 text-blue-600'
            href='https://slack.com/help/articles/360024269514-Manage-app-requests-for-your-workspace'
            target='_blank'
            rel='noreferrer noopener' // Must pair with target='_blank'
          >
            [Slack Official Help] Manage app requests for your workspace.
          </a>
        </p>
        <div className='w-full md:w-2/4'>
          <Image
            src={SlackDMSlackBotRequestApproval}
            alt='Slack bot sends a DM to the admin for approval'
            layout='intrinsic'
            quality={75}
            priority={false}
            placeholder='empty'
          />
        </div>
        <p className='text-sm md:text-base py-1 pb-4'>
          As you can see in this image, if an admin presses the &quot;Approve
          for WorkStats&quot; button in the message sent by SlackBot, it will
          give you permission to install the WorkStats app!
        </p>
        <h2 className='text-lg md:text-2xl py-2 md:py-4'>
          7. The Admin allows to install WorkStats apps
        </h2>
        <p className='text-sm md:text-base py-1 pb-4'>
          When the admins approve the installation of the WorkStats app, the
          admins are notified of the approval.
        </p>
        <div className='w-full md:w-2/4'>
          <Image
            src={Slack_DM_SlackBot_ToAdmin_Approved}
            alt='Slack bot sent the admin a DM that the app installation was approved'
            layout='intrinsic'
            quality={75}
            priority={false}
            placeholder='empty'
          />
        </div>
        <p className='text-sm md:text-base py-1 pb-4'>
          When the admin approves the installation of the WorkStats application,
          the user who submitted the application will also be notified that it
          has been approved. Let&apos;s go back to step 1 and continue the
          process! The next step should be a breeze to install.
        </p>
        <div className='w-full md:w-4/6'>
          <Image
            src={Slack_DM_SlackBot_ToUser_Approved}
            alt='Slack bot sent the admin a DM that the app installation was approved'
            layout='intrinsic'
            quality={75}
            priority={false}
            placeholder='empty'
          />
        </div>
        <h2 className='text-lg md:text-2xl py-2 md:py-4'>
          8. You will be redirected to the user settings screen.
        </h2>
        <p className='text-sm md:text-base py-1 pb-4'>
          Then you will be notified that the integration between WorkStats and
          Slack is complete, and the screen will automatically reload when you
          click &quot;OK&quot;
        </p>
        <div className='w-full md:w-4/5'>
          <Image
            src={UserSettings_SlackInfo_Redirected}
            alt='User will be redirected to the user settings screen'
            layout='intrinsic'
            quality={75}
            priority={false}
            placeholder='empty'
          />
        </div>
        <h2 className='text-lg md:text-2xl py-2 md:py-4'>
          10. You&apos;re all set up for Slack integration!
        </h2>
        <p className='text-sm md:text-base py-1 pb-4'>
          The WorkSpace name you want to retrieve is set, the member ID (Slack
          user ID) is also set, and the access token required for API
          integration is also set.
        </p>
        <div className='w-full md:w-4/6'>
          <Image
            src={UserSettings_SlackInfo_Connected}
            alt='Slack integration is complete'
            layout='intrinsic'
            quality={75}
            priority={false}
            placeholder='empty'
          />
        </div>
        <h2 className='text-lg md:text-2xl py-2 md:py-4'>
          11. Open the Dashboard page and confirm that Slack numbers are
          displayed.
        </h2>
        <p className='text-sm md:text-base py-1 pb-4'>
          Were the numbers what you thought they were?
        </p>
        <div className='w-full md:w-4/6'>
          <Image
            src={Dashboard_Slack_Aggregated}
            alt='Slack numbers are displayed'
            layout='intrinsic'
            quality={75}
            priority={false}
            placeholder='empty'
          />
        </div>
        <h2 className='text-lg md:text-2xl py-2 md:py-4'>
          12. (If you want to disconnect with Slack) Click the &quot;Disconnect
          with Slack&quot; button.
        </h2>
        <p className='text-sm md:text-base py-1 pb-4'>
          Even if the linkage is removed, it can be re-established by performing
          step 1.
        </p>
        <div className='w-full md:w-4/6'>
          <Image
            src={UserSettings_SlackInfo_Connected}
            alt='Slack integration is complete'
            layout='intrinsic'
            quality={75}
            priority={false}
            placeholder='empty'
          />
        </div>
        <h2 className='text-lg md:text-2xl py-2 md:py-4'>
          13. Click OK, when you see the message &quot;Disconnection
          completed.&quot;
        </h2>
        <p className='text-sm md:text-base py-1 pb-4'>
          It will then reload automatically.
        </p>
        <div className='w-full md:w-4/6'>
          <Image
            src={UserSettings_SlackInfo_Disconnecting}
            alt='Slack integration is being disconnected'
            layout='intrinsic'
            quality={75}
            priority={false}
            placeholder='empty'
          />
        </div>
        <h2 className='text-lg md:text-2xl py-2 md:py-4'>
          14. You can confirm that the registered linkage information has
          disappeared.
        </h2>
        <div className='w-full md:w-4/6 '>
          <Image
            src={UserSettings_SlackInfo_InitialState}
            alt='Slack integration is now disconnected'
            layout='intrinsic'
            quality={75}
            priority={false}
            placeholder='empty'
          />
        </div>
        <div className='h-20 md:h-40'></div>
      </main>
    </>
  );
};

export default HelpPageHowToGetSlackInfo;
