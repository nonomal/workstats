import moment from 'moment';
import { useEffect, useState } from 'react';

interface SpecifyPeriodFixedTermTypes {
  currentTimeframe?: {
    timeframe: {
      label: string;
      since: moment.Moment | undefined; // moment object
      until: moment.Moment; // moment object
    };
    setTimeFrame({}): void; // func dispatchSetState
  };
  label: string;
}

const SpecifyPeriodFixedTerm = ({
  currentTimeframe,
  label
}: SpecifyPeriodFixedTermTypes) => {
  const [bgColor, setBgColor] = useState('bg-white');
  const [textColor, setTextColor] = useState('slate-800');
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setBgColor(
      currentTimeframe?.timeframe.label === label ? 'bg-gray-500' : 'bg-white'
    );
    setTextColor(
      currentTimeframe?.timeframe.label === label ? 'white' : 'slate-800'
    );
    setDisabled(currentTimeframe?.timeframe.label === label ? true : false);
  }, [currentTimeframe, label]);

  const handleOnClick = () => {
    switch (label) {
      case 'Full':
        currentTimeframe?.setTimeFrame({
          label: label,
          since: undefined,
          until: moment()
        });
        break;
      case 'This Year':
        currentTimeframe?.setTimeFrame({
          label: label,
          since: moment().startOf('year'),
          until: moment()
        });
        break;
      case 'Last Year':
        currentTimeframe?.setTimeFrame({
          label: label,
          since: moment().subtract(1, 'year').startOf('year'),
          until: moment().subtract(1, 'year').endOf('year')
        });
        break;
      case 'Last 6 Months':
        currentTimeframe?.setTimeFrame({
          label: label,
          since: moment().subtract(6, 'month').startOf('month'),
          until: moment().subtract(1, 'month').endOf('month')
        });
        break;
      case 'Last 3 Months':
        currentTimeframe?.setTimeFrame({
          label: label,
          since: moment().subtract(3, 'month').startOf('month'),
          until: moment().subtract(1, 'month').endOf('month')
        });
        break;
      case 'This Month':
        currentTimeframe?.setTimeFrame({
          label: label,
          since: moment().startOf('month'),
          until: moment()
        });
        break;
      case 'Last Month':
        currentTimeframe?.setTimeFrame({
          label: label,
          since: moment().subtract(1, 'month').startOf('month'),
          until: moment().subtract(1, 'month').endOf('month')
        });
        break;
      case 'This Week':
        currentTimeframe?.setTimeFrame({
          label: label,
          since: moment().startOf('week'),
          until: moment()
        });
        break;
      case 'Last Week':
        currentTimeframe?.setTimeFrame({
          label: label,
          since: moment().subtract(1, 'week').startOf('week'),
          until: moment().subtract(1, 'week').endOf('week')
        });
        break;
      default:
        break;
    }
  };

  return (
    <button
      onClick={handleOnClick}
      disabled={disabled}
      className={`rounded-lg ${bgColor} shadow text-${textColor} text-sm md:text-base px-2 md:px-3 py-1 mx-1 md:mr-4 md:ml-0 my-1`}
    >
      {label}
    </button>
  );
};

export default SpecifyPeriodFixedTerm;
