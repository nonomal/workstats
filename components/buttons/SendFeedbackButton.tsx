import React from 'react';

const SendFeedbackButton = () => {
  return (
    <button
      type='submit'
      className='w-auto h-8 bg-gray-800 text-blue-100 hover:bg-gray-700 hover:text-white font-bold mt-4 py-1 px-3 rounded-lg'
    >
      Send your feedback to us
    </button>
  );
};

export default SendFeedbackButton;
