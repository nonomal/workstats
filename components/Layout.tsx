import React from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex bg-slate-50 w-full">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
