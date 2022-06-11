import React from 'react';

interface PropTypes {
  label: string;
  handleClick: () => void;
}

const RequestOAuthButton = ({ label, handleClick }: PropTypes) => {
  return (
    <button
      className='w-auto h-7 bg-green-600 hover:bg-green-700 text-white font-semibold px-3 ml-3 mt-9 rounded-lg inline-block align-middle'
      onClick={handleClick}
    >
      {label}
    </button>
  );
};

export default RequestOAuthButton;
