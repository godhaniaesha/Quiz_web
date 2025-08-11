import React from 'react'
import "../style/x_app.css";
import Header from './Header';
import Sidebar from './Sidebar';
import { useState } from 'react';
import { useEffect } from 'react';
import Dashboard from '../Pages/Dashboard';


export default function Main() {
    const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen((open) => !open);
    }
  };
   // Overlay click handler
  const handleOverlayClick = () => {
    if (window.innerWidth <= 768 && isSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="app dark-theme">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
       {isSidebarOpen && window.innerWidth <= 768 && (
        <div className="sidebar-overlay" onClick={handleOverlayClick}></div>
      )}
      <Header toggleSidebar={toggleSidebar} />
      <div className="w-100">
        <Dashboard></Dashboard>
      </div>
    </div>
  );
}
