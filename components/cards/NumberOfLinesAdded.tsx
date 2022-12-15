interface PropTypes {
  data: number;
}

const NumberOfLinesAdded = ({ data }: PropTypes) => {
  return (
    <div className='bg-white shadow rounded-lg px-3 py-3 md:pl-3 md:pr-3 md:py-4 hover:bg-slate-200'>
      <div className='flex space-x-2 md:space-x-3 items-center'>
        <div>
          <div className='bg-green-50 rounded-full w-5 h-5 md:w-10 md:h-10 text-green-400 flex justify-center items-center'>
            <svg
              width='24px'
              height='24px'
              viewBox='0 0 24 24'
              role='img'
              xmlns='http://www.w3.org/2000/svg'
              aria-labelledby='plusIconTitle'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              fill='none'
              color='currentColor'
            >
              {' '}
              <title id='plusIconTitle'>Plus</title>{' '}
              <path d='M20 12L4 12M12 4L12 20' />{' '}
            </svg>
          </div>
        </div>
        <div>
          <div className='text-gray-400 text-sm md:text-sm'>
            # of lines added
          </div>
          <div className='hidden md:contents md:text-xl md:font-bold md:text-gray-900'>
            {data.toLocaleString()} lines
          </div>
        </div>
      </div>
      <div className='md:hidden text-xl font-bold text-gray-900'>
        {data.toLocaleString()} lines
      </div>
    </div>
  );
};

export default NumberOfLinesAdded;
