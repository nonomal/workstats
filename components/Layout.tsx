import React from 'react';
import LogOut from './common/Logout';
import Sidebar from './common/Sidebar';

// @ts-ignore
const Layout = ({ children }) => {
  return (
    <div className='flex bg-slate-50 w-full'>
      <Sidebar />
      <div>
        <LogOut />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
