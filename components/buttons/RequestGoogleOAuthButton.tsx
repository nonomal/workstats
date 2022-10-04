import Image from 'next/image';
import React from 'react';
import GoogleIconLightNormal from '../../public/btn_google_light_normal_ios.svg';

interface PropTypes {
  label: string;
  handleClick: () => void;
}

const RequestGoogleOAuthButton = ({ label, handleClick }: PropTypes) => {
  return (
    <button
      className='animate-pulse w-auto h-8 flex bg-white ring-1 ring-gray-300 hover:ring-gray-500 ml-3 mt-1 md:mt-0 pr-3 rounded place-items-center'
      onClick={handleClick}
    >
      <Image
        src={GoogleIconLightNormal}
        alt='Google'
        width={36}
        height={36}
        layout='intrinsic'
        className='rounded-xl'
      />
      <span className='text-gray-600 font-semibold ml-1'>{label}</span>
    </button>
  );
};

export default RequestGoogleOAuthButton;
