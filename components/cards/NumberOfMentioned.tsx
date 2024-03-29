// @ts-ignore
const NumberOfMentioned = ({ data }) => {
  return (
    <div className='bg-white shadow rounded-lg px-3 py-3 md:px-4 md:py-4 hover:bg-slate-200'>
      <div className='flex space-x-2 md:space-x-4 items-center'>
        <div>
          <div className='bg-red-50 rounded-full w-5 h-5 md:w-12 md:h-12 text-red-400 flex justify-center items-center'>
            <svg
              width='32'
              height='32'
              viewBox='0 0 24 24'
              fill='currentColor'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M22,12 L22,13.75 C22,15.8210678 20.3210678,17.5 18.25,17.5 C16.7458289,17.5 15.4485014,16.6143971 14.8509855,15.3361594 C14.032894,16.3552078 12.8400151,17 11.5,17 C8.99236936,17 7,14.7419814 7,12 C7,9.25801861 8.99236936,7 11.5,7 C12.6590052,7 13.7079399,7.48235986 14.5009636,8.27192046 L14.5,7.75 C14.5,7.33578644 14.8357864,7 15.25,7 C15.6296958,7 15.943491,7.28215388 15.9931534,7.64822944 L16,7.75 L16,13.75 C16,14.9926407 17.0073593,16 18.25,16 C19.440864,16 20.4156449,15.0748384 20.4948092,13.9040488 L20.5,13.75 L20.5,12 C20.5,7.30557963 16.6944204,3.5 12,3.5 C7.30557963,3.5 3.5,7.30557963 3.5,12 C3.5,16.6944204 7.30557963,20.5 12,20.5 C13.032966,20.5 14.0394669,20.3160231 14.9851556,19.9612482 C15.3729767,19.8157572 15.8053117,20.0122046 15.9508027,20.4000257 C16.0962937,20.7878469 15.8998463,21.2201818 15.5120251,21.3656728 C14.3985007,21.7834112 13.2135869,22 12,22 C6.4771525,22 2,17.5228475 2,12 C2,6.4771525 6.4771525,2 12,2 C17.4292399,2 21.8479317,6.32667079 21.9961582,11.7200952 L22,12 L22,13.75 L22,12 Z M11.5,8.5 C9.86549502,8.5 8.5,10.047561 8.5,12 C8.5,13.952439 9.86549502,15.5 11.5,15.5 C13.134505,15.5 14.5,13.952439 14.5,12 C14.5,10.047561 13.134505,8.5 11.5,8.5 Z'
                stroke='currentColor'
                strokeWidth='0.2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
        </div>
        <div>
          <div className='text-gray-400 text-sm md:text-base'>
            # of mentioned
          </div>
          <div className='hidden md:contents md:text-2xl md:font-bold md:text-gray-900'>
            {data ? data.toLocaleString() : 0} times
          </div>
        </div>
      </div>
      <div className='md:hidden text-xl font-bold text-gray-900'>
        {data ? data.toLocaleString() : 0} times
      </div>
    </div>
  );
};
export default NumberOfMentioned;
