import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "../style/x_app.css";

const Layout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const navigate = useNavigate();

  // 🔒 Redirect if not authenticated
  useEffect(() => {
    const user = localStorage.getItem("user");
    const userId = localStorage.getItem("userId");

    if (!user || !userId) {
      navigate("/AdminLogin");
    }
  }, [navigate]);

  // Handle sidebar visibility on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) setSidebarOpen((open) => !open);
  };

  return (
    <div className="app dark-theme">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      {isSidebarOpen && window.innerWidth <= 768 && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}
      <Header toggleSidebar={toggleSidebar} />
      <div className="main-content w-100">{children}</div>
    </div>
  );
};

export default Layout;
