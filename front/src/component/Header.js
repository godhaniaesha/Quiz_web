import React, { useState } from 'react';
import { IoMenu } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import "../style/x_app.css";
import { FaSignOutAlt } from 'react-icons/fa';
import LogoutModal from './LogoutModal';

const Header = ({ toggleSidebar }) => {
    const navigate = useNavigate();
     const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    
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

                {/* <div className="x_user-profile" style={{ cursor: 'pointer' }}>
                    <button className="btn btn-outline-secondary d-flex align-items-center" onClick={handleLogout}>
                        <FaSignOutAlt style={{ marginRight: 6 }} />
                        Logout
                    </button>
                </div> */}

                <div className="x_user-profile" style={{ cursor: "pointer" }}>
                    <button
                        className="btn btn-outline-secondary d-flex align-items-center"
                        onClick={() => setIsLogoutModalOpen(true)} // Just open modal
                    >
                        <FaSignOutAlt style={{ marginRight: 6 }} />
                        Logout
                    </button>
                </div>

                {/* Modal */}
                <LogoutModal
                    open={isLogoutModalOpen}
                    onCancel={() => setIsLogoutModalOpen(false)}
                />
        </header>
        </section >
    );
};

export default Header;
