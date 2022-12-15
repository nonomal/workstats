interface PropTypes {
  unit: string;
  number: string;
}

const VelocityOfTaskClose = ({ unit, number }: PropTypes) => {
  return (
    <div className='bg-white shadow rounded-lg px-3 py-3 md:pl-3 md:pr-0 md:py-4 hover:bg-slate-200'>
      <div className='flex space-x-2 md:space-x-3 items-center'>
        <div>
          <div className='bg-pink-50 rounded-full w-5 h-5 md:w-10 md:h-10 text-pink-400 flex justify-center items-center'>
            <svg
              width='25px'
              height='25px'
              viewBox='0 0 24 24'
              role='img'
              xmlns='http://www.w3.org/2000/svg'
              aria-labelledby='timeIconTitle'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              fill='none'
              color='currentColor'
            >
              <circle cx='12' cy='12' r='10' />
              <polyline points='12 5 12 12 16 16' />
            </svg>
          </div>
        </div>
        <div>
          <div className='text-gray-400 text-sm md:text-sm'>
            Closing velocity
          </div>
          <div className='hidden md:contents md:text-xl md:font-bold md:text-gray-900'>
            {number ? number.toLocaleString() : 0}{' '}
            <span className='md:text-lg'>{unit}</span>
          </div>
        </div>
      </div>
      <div className='md:hidden text-xl font-bold text-gray-900'>
        {number ? number.toLocaleString() : 0} {unit}
      </div>
    </div>
  );
};

export default VelocityOfTaskClose;
