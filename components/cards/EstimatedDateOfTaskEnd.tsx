interface PropTypes {
  date: string;
}

const EstimatedDateOfCompletion = ({ date }: PropTypes) => {
  return (
    <div className='bg-white shadow rounded-lg px-3 py-3 md:px-3 md:py-4 hover:bg-slate-200'>
      <div className='flex space-x-2 md:space-x-3 items-center'>
        <div>
          <div className='bg-purple-50 rounded-full w-5 h-5 md:w-10 md:h-10 text-purple-400 flex justify-center items-center'>
            <svg
              width='24px'
              height='24px'
              viewBox='0 0 48 48'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <rect width='48' height='48' fill='white' fillOpacity='0.01' />
              <path
                d='M43 11L16.875 37L5 25.1818'
                stroke='currentColor'
                strokeWidth='5'
                strokeLinecap='round'
                strokeLinejoin='round'
                fill='none'
                color='currentColor'
              />
            </svg>
          </div>
        </div>
        <div>
          <div className='text-gray-400 text-sm md:text-sm'>
            Est. completion
          </div>
          <div className='hidden md:contents md:text-xl whitespace-nowrap md:font-bold md:text-gray-900'>
            {date ? date : '--'}
          </div>
        </div>
      </div>
      <div className='md:hidden text-xl font-bold text-gray-900'>
        {date ? date : '--'}
      </div>
    </div>
  );
};

export default EstimatedDateOfCompletion;
