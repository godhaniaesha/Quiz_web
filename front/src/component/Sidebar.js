import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import "../style/x_app.css";
import LogoutModal from './LogoutModal';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  // Function to handle menu item click
  const handleMenuItemClick = () => {
    if (window.innerWidth <= 768) {
      toggleSidebar();
    }
  };
  return (
    <section className="x_sidebar">
      <div className={`sidebar ${isOpen ? 'open' : ''} `}>
        <div className='w-100 text-center' style={{ boxShadow: "0px 2px 5px 0px rgba(0, 0, 0, 0.1)" }}>
          <img src="https://kalathiyainfotech.in/images/icon/logo.png" alt="Logo" className="logo" />
        </div>
        <ul>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => isActive ? "active" : ""}
            onClick={handleMenuItemClick}
          >
            <li>Dashboard</li>
          </NavLink>

          <NavLink
            to="/techn"
            className={({ isActive }) => isActive ? "active" : ""}
            onClick={handleMenuItemClick}
          >
            <li>Technology</li>
          </NavLink>

          <NavLink
            to="/questions"
            className={({ isActive }) => isActive ? "active" : ""}
            onClick={handleMenuItemClick}
          >
            <li>Questions</li>
          </NavLink>

          <NavLink
            to="/quizzes"
            className={({ isActive }) => isActive ? "active" : ""}
            onClick={handleMenuItemClick}
          >
            <li>Quizzes</li>
          </NavLink>

          <NavLink
            to="/results"
            className={({ isActive }) => isActive ? "active" : ""}
            onClick={handleMenuItemClick}
          >
            <li>Results</li>
          </NavLink>

          <div
            onClick={() => {
              setShowLogoutModal(true);
              if (window.innerWidth <= 768) {
                toggleSidebar();
              }
            }}
            className="nav-link-custom">
            <li>Logout</li>
          </div>

          {showLogoutModal && (
            <LogoutModal
              open={showLogoutModal}
              onCancel={() => setShowLogoutModal(false)}
              onLogout={() => {
                // Add your logout logic here
                setShowLogoutModal(false);
                navigate('/login');
              }}
            />
          )}

        </ul>
      </div>
    </section>
  );
};

export default Sidebar;
