import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import nookies from 'nookies';
import Avatar from '../components/Avatar';
import InputBox from '../components/InputBox';
import { verifyIdToken } from '../firebaseAdmin';

const userSettings = (uid: string) => {
  return (
    <>
      <Head>
        <title>PolygonHR</title>
        <meta name="description" content="PolygonHR" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex">
        <div className="grid justify-items-center">
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
            <InputBox label={'First Name'} placeholder={'Oliver'} width={36} />
            <InputBox label={'Middle Name'} placeholder={'Alan'} width={36} />
            <InputBox label={'Last Name'} placeholder={'Smith'} width={36} />
            <InputBox label={'Department'} placeholder={'IT & Development'} width={96} />
            <InputBox label={'Rank'} placeholder={'Director'} width={36} />
            <InputBox label={'Supervisor'} placeholder={'A name here'} width={36} />
            <InputBox label={'Assessor'} placeholder={'A name here'} width={36} />
            <InputBox
              label={'Assigned Project'}
              placeholder={'New Business Development'}
              width={96}
            />
            <InputBox label={'Role'} placeholder={'Product Manager'} width={36} />
          </div>
        </div>
      </div>
      <h2 className="text-xl mt-8 mb-2 ml-6 underline underline-offset-4">
        Source Code / GitHub
      </h2>
      <div className="flex flex-wrap items-center">
        <div className="ml-6 w-24"></div>
        <InputBox label={'User ID'} placeholder={'Smith'} width={36} />
        <InputBox label={'User Name'} placeholder={'Smith'} width={36} />
      </div>
      <div className="flex flex-wrap items-center">
        <h3 className="ml-6 w-24">Repository 1 :</h3>
        <InputBox
          label={'Repo Owner Name'}
          placeholder={'octocat'}
          width={36}
        />
        <InputBox label={'Repo Name'} placeholder={'hello-world'} width={36} />
        <InputBox
          label={'Repo Visibility'}
          placeholder={'Public or Private'}
          width={36}
        />
      </div>
      <div className="flex flex-wrap items-center">
        <h3 className="ml-6 w-24">Repository 2 :</h3>
        <InputBox
          label={'Repo Owner Name'}
          placeholder={'octocat'}
          width={36}
        />
        <InputBox label={'Repo Name'} placeholder={'hello-world'} width={36} />
        <InputBox
          label={'Repo Visibility'}
          placeholder={'Public or Private'}
          width={36}
        />
      </div>
      <h2 className="text-xl mt-8 mb-2 ml-6 underline underline-offset-4">
        Task Ticket / Asana
      </h2>
      <div className="flex flex-wrap items-center">
        <div className="ml-6 w-28"></div>
        <InputBox
          label={'User ID'}
          placeholder={'1200781652740141'}
          width={44}
        />
      </div>
      <div className="flex flex-wrap items-center">
        <h3 className="ml-6 w-28">Workspace 1 :</h3>
        <InputBox
          label={'Workspace ID'}
          placeholder={'1200781712370361'}
          width={44}
        />
        <InputBox label={'Workspace Name'} placeholder={'Suchica'} width={36} />
        <InputBox
          label={'Personal Access Token'}
          placeholder={'1/1200781652740141:031..........................a63'}
          width={96}
        />
      </div>
      <div className="flex flex-wrap items-center">
        <h3 className="ml-6 w-28">Workspace 2 :</h3>
        <InputBox
          label={'Workspace ID'}
          placeholder={'1200781712370361'}
          width={44}
        />
        <InputBox label={'Workspace Name'} placeholder={'Suchica'} width={36} />
        <InputBox
          label={'Personal Access Token'}
          placeholder={'1/1200781652740141:031..........................a63'}
          width={96}
        />
      </div>
      <h2 className="text-xl mt-8 mb-2 ml-6 underline underline-offset-4">
        Communication Activity / Slack
      </h2>
      <div className="flex flex-wrap items-center">
        <h3 className="ml-6 w-28">Workspace 1 :</h3>
        <InputBox label={'Workspace Name'} placeholder={'Suchica'} width={36} />
        <InputBox label={'Member ID'} placeholder={'U02DK80DN9H'} width={36} />
        <InputBox
          label={'User Token'}
          placeholder={
            'xoxp-1234567890123-1234567890123-1234567890123-a94..........................16e'
          }
          width={96}
        />
        <InputBox
          label={'Bot Token'}
          placeholder={
            'xoxb-1234567890123-1234567890123-Uia..................8HH'
          }
          width={96}
        />
      </div>
      <div className="flex flex-wrap items-center">
        <h3 className="ml-6 w-28">Workspace 1 :</h3>
        <InputBox label={'Workspace Name'} placeholder={'Suchica'} width={36} />
        <InputBox label={'Member ID'} placeholder={'U02DK80DN9H'} width={36} />
        <InputBox
          label={'User Token'}
          placeholder={
            'xoxp-1234567890123-1234567890123-1234567890123-a94..........................16e'
          }
          width={96}
        />
        <InputBox
          label={'Bot Token'}
          placeholder={
            'xoxb-1234567890123-1234567890123-Uia..................8HH'
          }
          width={96}
        />
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
    return {
      props: { uid },
    };
  } else {
    return { props: {} as never };
  }
};
