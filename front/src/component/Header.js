import React from 'react';
import { IoMenu } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import "../style/x_app.css";
import { FaSignOutAlt } from 'react-icons/fa';

const Header = ({ toggleSidebar }) => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear(); // or remove specific tokens/user info
        // redirect to login page or home
        navigate('/login'); // if using react-router's useNavigate
    };
    return (
        <section className='x_header'>
            <header className="header">
                <div className="x_header-left">
                    <button className="menu-btn" onClick={toggleSidebar}><IoMenu /></button>
                    <div className="x_logo-wrap">
                        <img
                            src="https://kalathiyainfotech.in/images/icon/logo.png"
                            alt="Logo"
                            className="logoh"
                        />
                    </div>
                </div>

                <div className="x_user-profile" style={{ cursor: 'pointer' }}>
                    <button className="btn btn-outline-secondary d-flex align-items-center" onClick={handleLogout}>
                        <FaSignOutAlt style={{ marginRight: 6 }} />
                        Logout
                    </button>
                </div>

            </header>
        </section>
    );
};

export default Header;
