import React, { useState } from 'react';
import '../style/d_style.css';

export default function AdminVerifyOTP() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp !== '123456') {
      setError('Invalid OTP'); // fake check
      return;
    }
    window.location.href = '/AdminResetPassword';
  };

  return (
    <div className="d_auth_wrap">
      <div className="d_auth_container">
        <div className="d_auth_card">
              <img src={require('../Image/ki.png')} alt="Logo" className="d_auth_logo" />
                 <p className="d_auth_subtitle fs-5">Verify OTP</p>
          <form onSubmit={handleSubmit}>
            <div className="d_auth_group">
              <label className="d_auth_label">Enter the 6-digit OTP</label>
              <input
                type="text"
                className="d_auth_input"
                  placeholder="Enter your 6 digit OTP"
                maxLength="6"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setError('');
                }}
              />
              {error && <small className="d_auth_error">{error}</small>}
            </div>
            <button type="submit" className="d_auth_btn mt-3">Verify</button>
          </form>
        </div>
      </div>
    </div>
  );
}
