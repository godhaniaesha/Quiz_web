import React from 'react';
import { IoMenu } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import "../style/x_app.css";

const Header = ({ toggleSidebar }) => {
    const navigate = useNavigate();
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
            
            <div className="x_user-profile" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
                <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="User"
                    className="x_user-avatar"
                />
                <div className="x_user-info">
                    <div className="x_user-name">William</div>
                    <div className="x_user-role">Interviewer</div>
                </div>
            </div>
            
        </header>
        </section>
    );
};

export default Header;
