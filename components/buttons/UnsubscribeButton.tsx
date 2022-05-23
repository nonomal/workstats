import React from 'react';
import handleSubmitCancelMembership from '../../services/deleteUserDocInFirestore';

interface UnsubscribeButtonTypes {
  uid: string;
  disabled: boolean;
}

const UnsubscribeButton = ({ uid, disabled }: UnsubscribeButtonTypes) => {
  console.log('disabled in the button: ', disabled);
  return (
    <>
      {disabled ? (
        <p className='py-1 text-red-600'>
          It enables this button below to submit the survey before.
        </p>
      ) : (
        <p className='py-1 text-red-600'>
          Now you can click this button below.
        </p>
      )}
      <button
        type='submit'
        className='w-auto h-8 bg-red-500 hover:bg-red-700 text-white font-bold mt-4 py-1 px-3 rounded-lg'
        disabled={disabled}
        onClick={async () => await handleSubmitCancelMembership(uid)}
      >
        Delete My Account and Data Permanently
      </button>
    </>
  );
};

export default UnsubscribeButton;
