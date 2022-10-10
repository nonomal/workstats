// @ts-ignore
const NumberOfReplies = ({ data }) => {
  return (
    <div className='bg-white shadow rounded-lg px-3 py-3 md:px-3 md:py-4 hover:bg-slate-200'>
      <div className='flex space-x-2 md:space-x-3 items-center'>
        <div>
          <div className='bg-orange-50 rounded-full w-5 h-5 md:w-10 md:h-10 text-orange-400 flex justify-center items-center'>
            <svg
              width='26'
              height='26'
              viewBox='0 0 20 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M19 16.685S16.775 6.953 8 6.953V2.969L1 9.542l7 6.69v-4.357c4.763-.001 8.516.421 11 4.81z'
                stroke='currentColor'
                strokeWidth='1.3'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
        </div>
        <div>
          <div className='text-gray-400 text-sm md:text-sm'># of replies</div>
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
export default NumberOfReplies;
