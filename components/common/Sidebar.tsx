import React from 'react';
import Link from 'next/link';
import HamburgerButton from './HamburgerButton';

interface SidebarProps {
  isMobile: boolean;
  handleClick: () => void;
}

const Sidebar = ({ isMobile, handleClick }: SidebarProps) => {
  return (
    <div className='sidebar fixed md:sticky top-0 z-10 bg-gray-800 text-blue-100 w-6/12 md:w-44 h-screen space-y-1 py-7 px-2 flex-none'>
      <div className='flex h-10'>
        <a href='#' className='text-white text-xl font-bold px-4'>
          WorkStats
        </a>
        <HamburgerButton color='text-blue-100' handleClick={handleClick} />
      </div>
      <nav>
        <Link href='/dashboard'>
          <a
            className='block py-2 px-4 rounded hover:bg-gray-700 hover:text-white'
            onClick={() => {
              if (isMobile) handleClick();
            }}
          >
            Dashboard
          </a>
        </Link>
        {/* <Link href="/personal-analysis">
          <a className="block py-2 px-4 rounded hover:bg-gray-700 hover:text-white">
            Personal Analysis
          </a>
        </Link> */}
        {/* <Link href="/team-analysis">
          <a className="block py-2 px-4 rounded hover:bg-gray-700 hover:text-white">
            Team Analysis
          </a>
        </Link> */}
        {/* <Link href='/user-list'> */}
        <a
          role='link'
          aria-disabled='true'
          className='block py-2 px-4 rounded text-gray-500'
        >
          User List
        </a>
        {/* </Link> */}
        {/* <Link href='/team-list'> */}
        <a
          role='link'
          aria-disabled='true'
          className='block py-2 px-4 rounded text-gray-500'
        >
          Team List
        </a>
        {/* </Link> */}
        <Link href='/user-settings'>
          <a
            id='user-settings'
            className='block py-2 px-4 rounded hover:bg-gray-700 hover:text-white'
            onClick={() => {
              if (isMobile) handleClick();
            }}
          >
            User Settings
          </a>
        </Link>
        {/* <Link href='/team-settings'> */}
        <a
          role='link'
          aria-disabled='true'
          className='block py-2 px-4 rounded text-gray-500'
        >
          Team Settings
        </a>
        {/* </Link> */}
        {/* <Link href='/invoice'> */}
        <a
          role='link'
          aria-disabled='true'
          className='block py-2 px-4 rounded text-gray-500'
        >
          Invoices
        </a>
        {/* </Link> */}
        {/* <Link href='/usage-plan'> */}
        <a
          role='link'
          aria-disabled='true'
          className='block py-2 px-4 rounded text-gray-500'
        >
          Usage Plan
        </a>
        {/* </Link> */}
        {/* <Link href='/payment-settings'> */}
        <a
          role='link'
          aria-disabled='true'
          className='block py-2 px-4 rounded text-gray-500'
        >
          Payment Settings
        </a>
        {/* </Link> */}
        <Link href='/terms-of-service'>
          <a
            className='block py-2 px-4 rounded hover:bg-gray-700 hover:text-white'
            target='_blank'
          >
            Terms of Service
          </a>
        </Link>
        <Link href='/privacy-policy'>
          <a
            className='block py-2 px-4 rounded hover:bg-gray-700 hover:text-white'
            target='_blank'
          >
            Privacy Policy
          </a>
        </Link>
        <Link href='/'>
          <a className='block py-2 px-4 rounded hover:bg-gray-700 hover:text-white'>
            About
          </a>
        </Link>
        <a
          className='block py-2 px-4 rounded hover:bg-gray-700 hover:text-white'
          href='mailto: info@suchica.com?subject=WorkStats Feedback'
          target='_blank'
          rel='noreferrer noopener' // Must pair with target='_blank' when jumping to an external site
        >
          Contact Us
        </a>
      </nav>
    </div>
  );
};

export default Sidebar;
