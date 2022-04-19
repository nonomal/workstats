import React from 'react';

const Topbar = () => {
  return (
    <nav className='flex justify-between items-center'>
      <div className='text-2xl font-bold text-grey-800'>PolygonHR</div>
      <div className='flex'>
        <a
          href='/api/logout'
          className='rounded bg-blue-500 hover:bg-blue-600 text-white py-2 px-4'
        >
          Logout
        </a>
        <a
          href='/api/logout'
          className='rounded bg-blue-500 hover:bg-blue-600 text-white py-2 px-4'
        >
          Login
        </a>
      </div>
    </nav>
  );
};

export default Topbar;
