// Libraries
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

// Pictures
import WorkStats from '../../public/fulllogo_transparent_nobuffer.png';

const Topbar = () => {
  return (
    <nav className='flex sticky justify-between items-center bg-slate-50 pt-4 px-4 md:px-16'>
      <Link href='/'>
        <a type='button' className='w-40 md:w-48 h-auto'>
          <Image
            src={WorkStats}
            alt='WorkStats'
            layout='responsive'
            objectFit='cover'
            quality={100}
            priority={true}
            placeholder='empty'
          />
        </a>
      </Link>
      <Link href='/dashboard'>
        <a className='w-20 h-8 bg-gray-800 hover:bg-gray-700 text-blue-100 hover:text-white font-semibold rounded-md text-center'>
          <span className='align-middle'>Login</span>
        </a>
      </Link>
    </nav>
  );
};

export default Topbar;
