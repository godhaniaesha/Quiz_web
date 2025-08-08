import React, { useState } from 'react';
import '../style/d_style.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function AdminRegister() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        phone: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' }); // Clear error
    };

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Phone number must be 10 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log('Login successful:', formData);
            // Add API call or logic here
        }
    };

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="d_auth_wrap">
            <div className="d_auth_container">
                <div className="d_auth_card d_auth_card_login">
                    <img src={require('../Image/ki.png')} alt="Logo" className="d_auth_logo" />
                    <p className="d_auth_subtitle">Admin Access Only — Please Sign In to Continue</p>

                    <form onSubmit={handleSubmit}>
                        <div className="d_auth_group">
                            <label className="d_auth_label">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter email"
                                className="d_auth_input"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <small className="d_auth_error">{errors.email}</small>}
                        </div>

                        <div className="d_auth_group mt-3">
                            <label className="d_auth_label">Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                placeholder="Enter 10-digit phone number"
                                className="d_auth_input"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            {errors.phone && <small className="d_auth_error">{errors.phone}</small>}
                        </div>

                        <div className="d_auth_group position-relative mt-3">
                            <label className="d_auth_label">Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Enter password"
                                className="d_auth_input"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <span className="d_auth_toggle_icon" onClick={togglePassword}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                            {errors.password && <small className="d_auth_error">{errors.password}</small>}
                        </div>

                        <button type="submit" className="d_auth_btn mt-3">Sign In</button>
                            <p className="d_auth_footer">
                        Don’t have an account? <a href="/AdminLogin" className="text-info">Create Account</a>
                    </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
