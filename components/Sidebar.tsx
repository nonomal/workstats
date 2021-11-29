import React from 'react';
import Link from "next/link";

const Sidebar = () => {
  return (
    <div className="sidebar bg-gray-800 text-blue-100 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0">
      <a href="#" className="text-white flex items-center space-x-2 px-4">
        <span className="text-2xl font-extrabold">PolygonHR</span>
      </a>
      <nav>
        <Link href="/">
          <a className="block py-2 px-4 rounded hover:bg-gray-700 hover:text-white">
            Home
          </a>
        </Link>
        <Link href="/about">
          <a className="block py-2 px-4 rounded hover:bg-gray-700 hover:text-white">
            About
          </a>
        </Link>
        <Link href="/team-analysis">
          <a className="block py-2 px-4 rounded hover:bg-gray-700 hover:text-white">
            Team Analysis
          </a>
        </Link>
        <Link href="/personal-analysis">
          <a className="block py-2 px-4 rounded hover:bg-gray-700 hover:text-white">
            Personal Analysis
          </a>
        </Link>
        <Link href="/team-list">
          <a className="block py-2 px-4 rounded hover:bg-gray-700 hover:text-white">
            Team List
          </a>
        </Link>
        <Link href="/user-list">
          <a className="block py-2 px-4 rounded hover:bg-gray-700 hover:text-white">
            User List
          </a>
        </Link>
        <Link href="/contact">
          <a className="block py-2 px-4 rounded hover:bg-gray-700 hover:text-white">
            Contact
          </a>
        </Link>
        <Link href="/api-config">
          <a className="block py-2 px-4 rounded hover:bg-gray-700 hover:text-white">
            API Config
          </a>
        </Link>
        <Link href="/user-config">
          <a className="block py-2 px-4 rounded hover:bg-gray-700 hover:text-white">
            User Config
          </a>
        </Link>
        <Link href="/team-config">
          <a className="block py-2 px-4 rounded hover:bg-gray-700 hover:text-white">
            Team Config
          </a>
        </Link>
        <Link href="/invoice">
          <a className="block py-2 px-4 rounded hover:bg-gray-700 hover:text-white">
            Invoice
          </a>
        </Link>
        <Link href="/payment-config">
          <a className="block py-2 px-4 rounded hover:bg-gray-700 hover:text-white">
            Payment Config
          </a>
        </Link>
        <Link href="/usage-plan">
          <a className="block py-2 px-4 rounded hover:bg-gray-700 hover:text-white">
            Usage Plan
          </a>
        </Link>
        <Link href="/terms-of-service">
          <a className="block py-2 px-4 rounded hover:bg-gray-700 hover:text-white">
            Terms of Service
          </a>
        </Link>
        <Link href="/privacy-policy">
          <a className="block py-2 px-4 rounded hover:bg-gray-700 hover:text-white">
            Privacy Policy
          </a>
        </Link>
        <Link href="/company">
          <a className="block py-2 px-4 rounded hover:bg-gray-700 hover:text-white">
            Company
          </a>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
