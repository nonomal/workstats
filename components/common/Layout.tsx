import React, { useLayoutEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import LogOut from './Logout';
import Sidebar from './Sidebar';
import HamburgerButton from './HamburgerButton';

// @ts-ignore
const Layout = ({ children }) => {
  // Hamburger menu state
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  useLayoutEffect(() => {
    if (isMobile) setIsOpen(false);
    else setIsOpen(true);
  }, [isMobile]);

  return (
    <div className='md:flex bg-slate-50 w-full'>
      {isOpen ? (
        <>
          <div className='h-10 md:hidden'></div>
          <Sidebar isMobile={isMobile} handleClick={toggleMenu} />
        </>
      ) : (
        <HamburgerButton
          color='text-gray-800'
          handleClick={toggleMenu}
          margin='m-3'
        />
      )}
      <div>
        <LogOut />
        <main
          onClick={() => {
            if (isMobile && isOpen) toggleMenu();
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
