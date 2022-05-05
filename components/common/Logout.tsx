import { signOut } from 'firebase/auth';
import React from 'react';
import { auth } from '../../config/firebaseClient';

const LogOut = () => {
  const handleClick = () => {
    signOut(auth)
      .then(() => {
        console.log('signed out');
        // window.location.reload(); // https://developer.mozilla.org/en-US/docs/Web/API/Location/reload
      })
      .catch((error) => {
        console.log('error is: ', error);
      });
  };

  return (
    <button
      type='button' // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button
      className='w-20 h-8 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-md absolute top-3.5 right-10'
      onClick={() => {
        handleClick();
      }}
    >
      Logout
    </button>
  );
};

export default LogOut;
