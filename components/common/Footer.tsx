import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <div className='text-center bg-gray-800 text-blue-100'>
      <div className='grid grid-cols-2 md:flex text-base items-center justify-center'>
        <div className='grid grid-rows-5 gap-1 md:gap-2 md:w-40 py-2 px-2 my-2 mx-3'>
          <p className='border-b border-white pb-1'>Service</p>
          <a className='rounded hover:bg-gray-700 hover:text-white'>About Us</a>
          <Link href='/terms-of-service'>
            <a className='rounded hover:bg-gray-700 hover:text-white'>
              Terms & Conditions
            </a>
          </Link>
          <Link href='/privacy-policy'>
            <a
              className='rounded hover:bg-gray-700 hover:text-white'
              target='_blank'
            >
              Privacy Policy
            </a>
          </Link>
          <a
            className='rounded hover:bg-gray-700 hover:text-white'
            href='mailto: info@suchica.com?subject=WorkStats Feedback'
            target='_blank'
            rel='noreferrer noopener' // Must pair with target='_blank'
          >
            Contact Us
          </a>
        </div>
        <div className='grid grid-rows-5 gap-1 md:gap-2 md:w-40 py-2 px-2 my-2 mx-3'>
          <p className='border-b border-white pb-1'>Media</p>
          <a
            className='rounded hover:bg-gray-700 hover:text-white'
            href='https://www.producthunt.com/products/workstats#workstats'
            target='_blank'
            rel='noreferrer noopener' // Must pair with target='_blank'
          >
            Product Hunt
          </a>
          <a
            className='rounded hover:bg-gray-700 hover:text-white'
            href='https://betalist.com/startups/workstats'
            target='_blank'
            rel='noreferrer noopener' // Must pair with target='_blank'
          >
            Beta List
          </a>
          <a
            className='rounded hover:bg-gray-700 hover:text-white'
            href='https://startupbase.io/startups/workstats'
            target='_blank'
            rel='noreferrer noopener' // Must pair with target='_blank'
          >
            Startup Base
          </a>
          <a
            className='rounded hover:bg-gray-700 hover:text-white'
            href='https://www.betafy.co/startup/workstats'
            target='_blank'
            rel='noreferrer noopener' // Must pair with target='_blank'
          >
            Betafy
          </a>
        </div>
        <div className='grid grid-rows-5 gap-1 md:gap-2 md:w-40 py-2 px-2 my-2 mx-3'>
          <p className='border-b border-white pb-1'>SNS</p>
          <a
            className='rounded hover:bg-gray-700 hover:text-white'
            href='https://twitter.com/workstatsdev'
            target='_blank'
            rel='noreferrer noopener' // Must pair with target='_blank'
          >
            Twitter (Official)
          </a>
          <a
            className='rounded hover:bg-gray-700 hover:text-white'
            href='https://twitter.com/hnishio0105'
            target='_blank'
            rel='noreferrer noopener' // Must pair with target='_blank'
          >
            Twitter (Author)
          </a>
          <a
            className='rounded hover:bg-gray-700 hover:text-white'
            href='https://www.youtube.com/channel/UCCc3BO-nbc89H0dVdrRjFbA'
            target='_blank'
            rel='noreferrer noopener' // Must pair with target='_blank'
          >
            YouTube (Official)
          </a>
        </div>
      </div>
      <p className='p-1 h-12'>
        Copyright {new Date().getFullYear()} Suchica, Inc. All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
