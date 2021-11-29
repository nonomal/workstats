import React from "react";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="content">
      <Sidebar />
      {children}
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;