import React from 'react';
import { AuthProvider } from '@hooks/AuthContext';
import NavBar from '@layouts/NavBar';
import Footer from '@layouts/Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100">
        <NavBar />
        <main className="flex-grow-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default Layout;