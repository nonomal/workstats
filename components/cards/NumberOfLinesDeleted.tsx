interface PropTypes {
  data: number;
}

const NumberOfLinesDeleted = ({ data }: PropTypes) => {
  return (
    <div className='bg-white shadow rounded-lg px-3 py-3 md:px-4 md:py-4 hover:bg-slate-200'>
      <div className='flex space-x-2 md:space-x-4 items-center'>
        <div>
          <div className='bg-red-50 rounded-full w-5 h-5 md:w-12 md:h-12 text-red-400 flex justify-center items-center'>
            <svg
              width='24px'
              height='24px'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M4 12L20 12'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
        </div>
        <div>
          <div className='text-gray-400 text-sm md:text-base'>
            # of lines deleted
          </div>
          <div className='hidden md:contents md:text-2xl md:font-bold md:text-gray-900'>
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

export default NumberOfLinesDeleted;
