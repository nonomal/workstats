import {
  GlobalContextObjectType,
  useGlobalContext
} from '../../context/GlobalContextProvider';
import SpecifyPeriodFixedTerm from './SpecifyPeriodFixedTerm';
import timestampButtonList from '../../constants/timestampButtonList.json';

const ButtonList = () => {
  // Global timestamp button context
  const globalState: GlobalContextObjectType = useGlobalContext();
  const currentTimeframe = globalState.currentTimeframe;

  return (
    <div>
      <h2 className='text-xl mt-4 mb-2 px-5 md:px-0'>Select a time period</h2>
      <div className='flex flex-wrap mt-4 px-4 md:px-0'>
        {timestampButtonList.map((t) => (
          <SpecifyPeriodFixedTerm
            key={t.label}
            label={t.label}
            currentTimeframe={currentTimeframe}
          />
        ))}
      </div>
    </div>
  );
};

export default ButtonList;
