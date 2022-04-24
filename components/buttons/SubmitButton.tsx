import React from 'react';

const handleOnClick = () => {
  console.log('Submit button was clicked');
};

const SubmitButton = () => {
  return (
    <button
      type='submit'
      // value={'Submit'}
      className='w-auto h-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 mt-9 rounded-lg'
      onClick={() => handleOnClick()}
    >
      Submit
    </button>
  );
};

export default SubmitButton;
