import React from 'react';
import { AuthProvider } from '@hooks/AuthContext';
import NavBar from '@layouts/NavBar';
import Footer from '@layouts/Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <AuthProvider>
      <div className="app-container">
        <NavBar />
        <main className="main-content">
          <Outlet />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default Layout;