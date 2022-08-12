import React from 'react';

interface PropTypes {
  label?: string;
  handleClick: () => void;
}

const StartTutorial = ({ label, handleClick }: PropTypes) => {
  return (
    <button
      id='start-tutorial'
      type='button'
      className='w-28 h-8 bg-gray-800 hover:bg-gray-700 text-blue-100 hover:text-white font-semibold rounded-md absolute top-3.5 right-28'
      onClick={() => {
        handleClick();
      }}
    >
      {label}
    </button>
  );
};

export default StartTutorial;
