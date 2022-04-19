import SpecifyPeriodLastWeek from './SpecifyPeriodLastWeek';

const ButtonList = () => {
  return (
    <div>
      <h2 className='text-xl mt-4 mb-2 px-5'>Select a time period</h2>
      <div className='flex mt-4 px-2'>
        <SpecifyPeriodLastWeek />
        <SpecifyPeriodLastWeek />
        <SpecifyPeriodLastWeek />
        <SpecifyPeriodLastWeek />
        <SpecifyPeriodLastWeek />
      </div>
    </div>
  );
};

export default ButtonList;
