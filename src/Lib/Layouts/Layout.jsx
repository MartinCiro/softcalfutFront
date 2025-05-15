import React from 'react';
import NavBar from '@layouts/NavBar';
import Footer from '@layouts/Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <>
      <NavBar />
      <main style={{ minHeight: '80vh' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;