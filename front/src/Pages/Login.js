import React from 'react';
import '../style/d_style.css';

export default function Login() {
    return (
       <div className="d_auth_wrap">
         <div className="d_auth_container">
            <div className="d_auth_card d_auth_card_login">
                <img src={require('../Image/ki3.png')} alt="Logo" className="d_auth_logo" />
                {/* <h2 className="d_auth_title">Sign In</h2> */}
                <p className="d_auth_subtitle">Ready to Begin? Enter Your Email!</p>
                <form>
                    <div className="d_auth_group">
                        <label className="d_auth_label">Email</label>
                        <input type="email" placeholder="Enter email" className="d_auth_input" />
                    </div>
              
                    <button type="submit" className="d_auth_btn mt-3">Sign In</button>

                    <p className="d_auth_footer">
                        Don’t have an account? <a href="/register" className="text-info">Create Account</a>
                    </p>
                </form>
            </div>
        </div>
       </div>
    );
}
