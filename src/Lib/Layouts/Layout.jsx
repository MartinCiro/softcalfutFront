import React from 'react';
import NavBar from '@layouts/NavBar';
import Footer from '@layouts/Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <>
      <NavBar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;