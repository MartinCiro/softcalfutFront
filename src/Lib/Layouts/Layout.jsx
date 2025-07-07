import React from 'react';
import NavBar from '@layouts/NavBar';
import Footer from '@layouts/Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <NavBar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;