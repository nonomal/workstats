import InputBox from '../../components/boxes/InputBox';
import SubmitButton from '../../components/buttons/SubmitButton';
import { UserType } from '../../config/firebaseTypes';
import { handleSubmitBasicInfo } from '../../services/setDocToFirestore';

interface SettingsForBasicInfoProps {
  uid: string;
  userDoc: UserType | null;
}

const SettingsForBasicInfo = ({ uid, userDoc }: SettingsForBasicInfoProps) => {
  return (
    <div id='basic-info' className='w-full'>
      <h2 className='text-xl mt-8 mb-2 ml-2 md:ml-3 pl-1 underline underline-offset-4'>
        Basic Information
      </h2>
      <form
        name='basic-info'
        onSubmit={(e) => handleSubmitBasicInfo(e, uid)}
        method='post'
        target='_self'
        autoComplete='off'
        className='flex flex-wrap'
      >
        <InputBox
          label={'First Name'}
          name={'firstName'}
          placeholder={'Oliver'}
          value={userDoc?.firstName}
        />
        <InputBox
          label={'Middle Name'}
          name={'middleName'}
          placeholder={'Alan'}
          value={userDoc?.middleName}
        />
        <InputBox
          label={'Last Name'}
          name={'lastName'}
          placeholder={'Smith'}
          value={userDoc?.lastName}
        />
        <InputBox
          label={'Login Email'}
          name={'email'}
          placeholder={'xxx@xxx.xxx'}
          disabled={true}
          value={userDoc?.email}
        />
        <InputBox
          label={'Role'}
          name={'role'}
          placeholder={'Product Manager'}
          value={userDoc?.role}
        />
        <InputBox
          label={'Assigned Project'}
          name={'assignedPj'}
          placeholder={'New Business Development'}
          value={userDoc?.assignedPj}
        />
        <InputBox
          label={'Rank'}
          name={'rank'}
          placeholder={'Director'}
          value={userDoc?.rank}
        />
        <InputBox
          label={'Department'}
          name={'department'}
          placeholder={'IT & Development'}
          value={userDoc?.department}
        />
        <InputBox
          label={'Supervisor'}
          name={'supervisor'}
          placeholder={'A name here'}
          value={userDoc?.supervisor}
        />
        <InputBox
          label={'Assessor'}
          name={'assessor'}
          placeholder={'A name here'}
          value={userDoc?.assessor}
        />
        <InputBox
          label={'Company Name'}
          name={'company'}
          placeholder={'Suchica, Inc.'}
          value={userDoc?.company}
        />
        <InputBox
          label={'Country'}
          name={'country'}
          placeholder={'United States of America'}
          value={userDoc?.country}
        />
        <div className='ml-2 pl-1 md:ml-2 md:pl-4'></div>
        <SubmitButton />
      </form>
    </div>
  );
};

export default SettingsForBasicInfo;
