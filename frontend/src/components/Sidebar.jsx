import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 min-h-screen bg-black/20 backdrop-blur-md border-r border-white/10 shadow-xl relative overflow-hidden z-10">
      {/* Background decorative elements */}
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500 opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute top-36 -right-20 w-40 h-40 bg-purple-500 opacity-20 rounded-full blur-3xl"></div>
      
      <div className="p-4 relative z-10 flex flex-col h-full">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3 mb-10 hover-lift">
          <div className="w-12 h-12 sapphire-teal-gradient rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white glass-text">MedPortal</span>
        </div>

        {/* Navigation Links - with padding bottom to prevent overlap with user section */}
        <nav className="space-y-2.5 flex-1 overflow-y-auto pb-20">
          <Link 
            to="/dashboard" 
            className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
              isActiveRoute('/dashboard') 
                ? 'bg-white/20 shadow-lg' 
                : 'bg-black/20 hover:bg-white/10 hover-lift'
            }`}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-white font-medium glass-text">Dashboard</span>
          </Link>

          <Link 
            to="/patients" 
            className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
              isActiveRoute('/patients') 
                ? 'bg-white/20 shadow-lg' 
                : 'bg-black/20 hover:bg-white/10 hover-lift'
            }`}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-white font-medium glass-text">Patients</span>
          </Link>

          <Link 
            to="/appointments" 
            className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
              isActiveRoute('/appointments') 
                ? 'bg-white/20 shadow-lg' 
                : 'bg-black/20 hover:bg-white/10 hover-lift'
            }`}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-white font-medium glass-text">Appointments</span>
          </Link>

          <Link 
            to="/doctors" 
            className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
              isActiveRoute('/doctors') 
                ? 'bg-white/20 shadow-lg' 
                : 'bg-black/20 hover:bg-white/10 hover-lift'
            }`}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-white font-medium glass-text">Doctors</span>
          </Link>

          <Link 
            to="/medicalrecords" 
            className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
              isActiveRoute('/medicalrecords') 
                ? 'bg-white/20 shadow-lg' 
                : 'bg-black/20 hover:bg-white/10 hover-lift'
            }`}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-white font-medium glass-text">Medical Records</span>
          </Link>

          <Link 
            to="/reports" 
            className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
              isActiveRoute('/reports') 
                ? 'bg-white/20 shadow-lg' 
                : 'bg-black/20 hover:bg-white/10 hover-lift'
            }`}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-white font-medium glass-text">Reports</span>
          </Link>
        </nav>

        {/* User Section at bottom - fixed position */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/10 border-t border-white/5">
          <div className="flex items-center space-x-3 bg-black/20 hover:bg-white/10 p-3 rounded-xl transition-all cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
              MD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">Dr. Martin</p>
              <p className="text-white/70 text-xs">Administrator</p>
            </div>
            <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 