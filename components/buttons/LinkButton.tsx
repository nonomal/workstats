import Link from 'next/link';
import React from 'react';

interface PropTypes {
  href: string;
  label: string;
}

const LinkButton = ({ href, label }: PropTypes) => {
  return (
    <button
      type='submit'
      className='animate-pulse hover:animate-none w-auto h-10 md:h-11 text-xl md:text-2xl bg-gray-800 text-blue-100 hover:bg-gray-700 hover:text-green-200 font-semibold p-1 px-5 m-1 rounded-lg'
    >
      <Link href={href}>
        <a
          className='block'
          target='_blank'
          rel='noreferrer noopener' // Must pair with target='_blank'
        >
          {label}
        </a>
      </Link>
    </button>
  );
};

export default LinkButton;
