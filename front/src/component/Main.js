import React from 'react'
import "../style/x_app.css";
import Header from './Header';
import Sidebar from './Sidebar';
import { useState } from 'react';
import { useEffect } from 'react';


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
      <div className="main-content">
        <h2>Welcome to Quiz Admin Panel</h2>
        <p>Manage your quizzes, users, and results efficiently.</p>
      </div>
    </div>
  );
}
