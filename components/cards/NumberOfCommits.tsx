interface PropTypes {
  data: number;
}

const NumberOfCommits = ({ data }: PropTypes) => {
  return (
    <div className='bg-white shadow rounded-lg px-3 py-3 md:px-3 md:py-4 hover:bg-slate-200'>
      <div className='flex space-x-2 md:space-x-3 items-center'>
        <div>
          <div className='bg-fuchsia-50 rounded-full w-5 h-5 md:w-10 md:h-10 text-fuchsia-400 flex justify-center items-center'>
            <svg
              width='32'
              height='32'
              viewBox='0 0 32 32'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M17.3333 9.33334H28M28 9.33334V20M28 9.33334L17.3333 20L12 14.6667L4 22.6667'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
        </div>
        <div>
          <div className='text-gray-400 text-sm md:text-sm'># of commits</div>
          <div className='hidden md:contents md:text-xl md:font-bold md:text-gray-900'>
            {data.toLocaleString()} times
          </div>
        </div>
      </div>
      <div className='md:hidden text-xl font-bold text-gray-900'>
        {data.toLocaleString()} times
      </div>
    </div>
  );
};

export default NumberOfCommits;
