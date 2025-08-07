import React from 'react';
import "../style/x_app.css";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className='w-100 text-center' style={{boxShadow:  "0px 2px 5px 0px rgba(0, 0, 0, 0.1)"}}><img src="https://kalathiyainfotech.in/images/icon/logo.png" alt="Logo" className="logo" /></div>
      <ul>
        <li>Dashboard</li>
        <li>Users</li>
        <li>Questions</li>
        <li>Quizzes</li>
        <li>Results</li>
        <li>Logout</li>
      </ul>
    </div>
  );
};

export default Sidebar;
