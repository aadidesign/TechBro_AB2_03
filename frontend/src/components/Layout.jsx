import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 -right-40 w-80 h-80 bg-pink-500 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-10 w-80 h-80 bg-blue-500 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-purple-500 opacity-10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Content */}
      <div className="flex w-full z-10 relative">
        <Sidebar />
        <main className="flex-1 p-6 overflow-hidden">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 