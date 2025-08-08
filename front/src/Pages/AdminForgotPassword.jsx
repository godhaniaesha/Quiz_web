import React, { useState } from 'react';
import '../style/d_style.css';

export default function AdminForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    // Fake API call: send OTP
    console.log('OTP sent to:', email);
    localStorage.setItem('db_admin_forgot_email', email); // save email for next step
    window.location.href = '/AdminVerifyOTP'; // navigate
  };

  return (
    <div className="d_auth_wrap">
      <div className="d_auth_container">
        
        <div className="d_auth_card">
               <img src={require('../Image/ki.png')} alt="Logo" className="d_auth_logo" />
                 <p className="d_auth_subtitle fs-5">Forgot Password</p>
          {/* <h3 className="text-center">Forgot Password</h3> */}
          <form onSubmit={handleSubmit}>
            <div className="d_auth_group">
              <label className="d_auth_label">Enter your email</label>
              <input
                type="email"
                className="d_auth_input"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
              />
              {error && <small className="d_auth_error">{error}</small>}
            </div>
            <button type="submit" className="d_auth_btn mt-3">Send OTP</button>
          </form>
        </div>
      </div>
    </div>
  );
}
