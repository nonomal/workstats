// Frameworks and libraries
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import nookies from 'nookies';

// Components and others
import Avatar from '../components/Avatar';
import InputBox from '../components/InputBox';
import { UserType } from '../config/firebaseTypes';
import { verifyIdToken } from '../firebaseAdmin';
import getAUserDoc from '../services/getAUserDocFromFirebase';

const userSettings = ({ uid, userDoc }: { uid: string; userDoc: UserType }) => {
  return (
    <>
      <Head>
        <title>PolygonHR</title>
        <meta name="description" content="PolygonHR" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex">
        <div className="grid justify-items-center mt-5">
          <Avatar userId={uid} />
          <button
            className="text-blue-500 hover:underline hover:underline-offset-4"
            onClick={() => {}}
          >
            Change
          </button>
        </div>
        <div className="w-full">
          <h2 className="text-xl mt-8 mb-2 ml-6 underline underline-offset-4">
            Basic Information
          </h2>
          {/* <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4"> */}
          <div className="flex flex-wrap">
            <InputBox
              label={'First Name'}
              placeholder={'Oliver'}
              width={36}
              value={userDoc.firstName}
            />
            <InputBox
              label={'Middle Name'}
              placeholder={'Alan'}
              width={36}
              value={userDoc.middleName}
            />
            <InputBox
              label={'Last Name'}
              placeholder={'Smith'}
              width={36}
              value={userDoc.lastName}
            />
            <InputBox
              label={'Department'}
              placeholder={'IT & Development'}
              width={96}
              value={userDoc.department}
            />
            <InputBox
              label={'Rank'}
              placeholder={'Director'}
              width={36}
              value={userDoc.rank}
            />
            <InputBox
              label={'Supervisor'}
              placeholder={'A name here'}
              width={36}
              value={userDoc.supervisor}
            />
            <InputBox
              label={'Assessor'}
              placeholder={'A name here'}
              width={36}
              value={userDoc.assessor}
            />
            <InputBox
              label={'Assigned Project'}
              placeholder={'New Business Development'}
              width={96}
              value={userDoc.assignedPj}
            />
            <InputBox
              label={'Role'}
              placeholder={'Product Manager'}
              width={36}
              value={userDoc.role}
            />
          </div>
        </div>
      </div>
      <h2 className="text-xl mt-8 mb-2 ml-6 underline underline-offset-4">
        Source Code / GitHub
      </h2>
      <div className="flex flex-wrap items-center">
        <div className="ml-6 w-28"></div>
        <InputBox
          label={'User ID'}
          inputType={'number'}
          placeholder={'4620828'}
          width={36}
          value={userDoc.github?.userId}
        />
        <InputBox
          label={'User Name'}
          placeholder={'oliversmith'}
          width={36}
          value={userDoc.github?.userName}
        />
      </div>
      <div className="flex flex-wrap items-center">
        <h3 className="ml-6 w-28">Repository 1 :</h3>
        <InputBox
          label={'Repo Owner Name'}
          placeholder={'octocat'}
          width={36}
          value={userDoc.github?.repositories[0]?.owner}
        />
        <InputBox
          label={'Repo Name'}
          placeholder={'hello-world'}
          width={36}
          value={userDoc.github?.repositories[0]?.repo}
        />
        <InputBox
          label={'Repo Visibility'}
          placeholder={'Public or Private'}
          width={36}
          value={userDoc.github?.repositories[0]?.visibility}
        />
      </div>
      <div className="flex flex-wrap items-center">
        <h3 className="ml-6 w-28">Repository 2 :</h3>
        <InputBox
          label={'Repo Owner Name'}
          placeholder={'octocat'}
          width={36}
          value={userDoc.github?.repositories[1]?.owner}
        />
        <InputBox
          label={'Repo Name'}
          placeholder={'hello-world'}
          width={36}
          value={userDoc.github?.repositories[1]?.repo}
        />
        <InputBox
          label={'Repo Visibility'}
          placeholder={'Public or Private'}
          width={36}
          value={userDoc.github?.repositories[1]?.visibility}
        />
      </div>
      <h2 className="text-xl mt-8 mb-2 ml-6 underline underline-offset-4">
        Task Ticket / Asana
      </h2>
      <div className="flex flex-wrap items-center">
        <div className="ml-6 w-28"></div>
        <InputBox
          label={'User ID'}
          inputType={'number'}
          placeholder={'1200781652740141'}
          width={48}
          value={userDoc.asana?.userId}
        />
      </div>
      <div className="flex flex-wrap items-center">
        <h3 className="ml-6 w-28">Workspace 1 :</h3>
        <InputBox
          label={'Workspace ID'}
          inputType={'number'}
          placeholder={'1234567890123456'}
          width={48}
          value={userDoc.asana?.workspace[0]?.workspaceId}
        />
        <InputBox
          label={'Workspace Name'}
          placeholder={'Suchica'}
          width={36}
          value={userDoc.asana?.workspace[0]?.workspaceName}
        />
        <InputBox
          label={'Personal Access Token'}
          placeholder={'1/1234567890123456:031..........................a63'}
          width={96}
          value={userDoc.asana?.workspace[0]?.personalAccessToken}
        />
      </div>
      <div className="flex flex-wrap items-center">
        <h3 className="ml-6 w-28">Workspace 2 :</h3>
        <InputBox
          label={'Workspace ID'}
          inputType={'number'}
          placeholder={'1234567890123456'}
          width={48}
          value={userDoc.asana?.workspace[1]?.workspaceId}
        />
        <InputBox
          label={'Workspace Name'}
          placeholder={'Suchica'}
          width={36}
          value={userDoc.asana?.workspace[1]?.workspaceName}
        />
        <InputBox
          label={'Personal Access Token'}
          placeholder={'1/1234567890123456:031..........................a63'}
          width={96}
          value={userDoc.asana?.workspace[1]?.personalAccessToken}
        />
      </div>
      <h2 className="text-xl mt-8 mb-2 ml-6 underline underline-offset-4">
        Communication Activity / Slack
      </h2>
      <div className="flex items-center">
        <h3 className="ml-6 w-28">Workspace 1 :</h3>
        <div className="flex flex-wrap">
          <InputBox
            label={'Workspace Name'}
            placeholder={'Suchica'}
            width={36}
            value={userDoc.slack?.workspace[0]?.workspaceName}
          />
          <InputBox
            label={'Member ID'}
            placeholder={'U02DK80DN9H'}
            width={36}
            value={userDoc.slack?.workspace[0]?.memberId}
          />
          <InputBox
            label={'User Token'}
            placeholder={
              'xoxp-1234567890123-1234567890123-1234567890123-a94..........................16e'
            }
            width={96}
            value={userDoc.slack?.workspace[0]?.userToken}
          />
          <InputBox
            label={'Bot Token'}
            placeholder={
              'xoxb-1234567890123-1234567890123-Uia..................8HH'
            }
            width={96}
            value={userDoc.slack?.workspace[0]?.botToken}
          />
        </div>
      </div>
      <div className="flex items-center">
        <h3 className="ml-6 w-28">Workspace 2 :</h3>
        <div className="flex flex-wrap">
          <InputBox
            label={'Workspace Name'}
            placeholder={'Suchica'}
            width={36}
            value={userDoc.slack?.workspace[1]?.workspaceName}
          />
          <InputBox
            label={'Member ID'}
            placeholder={'U02DK80DN9H'}
            width={36}
            value={userDoc.slack?.workspace[1]?.memberId}
          />
          <InputBox
            label={'User Token'}
            placeholder={
              'xoxp-1234567890123-1234567890123-1234567890123-a94..........................16e'
            }
            width={96}
            value={userDoc.slack?.workspace[1]?.userToken}
          />
          <InputBox
            label={'Bot Token'}
            placeholder={
              'xoxb-1234567890123-1234567890123-Uia..................8HH'
            }
            width={96}
            value={userDoc.slack?.workspace[1]?.botToken}
          />
        </div>
      </div>
      <div className="h-20"></div>
    </>
  );
};

export default userSettings;

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext,
) => {
  const cookies = nookies.get(ctx);
  if (cookies.token) {
    const token = await verifyIdToken(cookies.token);
    const { uid } = token;
    const userDoc = await getAUserDoc(uid);
    return {
      props: { uid, userDoc },
    };
  } else {
    return { props: {} as never };
  }
};
