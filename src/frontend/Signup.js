import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';
import background from './images/h3.png'; // Import the background image

const SignupPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        bloodgroup: '',
        dob: '',
        password: '',
        confirmPassword: ''
    });

    const [requirements, setRequirements] = useState({
        lengthValid: false,
        specialCharValid: false,
        numberValid: false,
        passwordsMatch: false
    });

    const navigate = useNavigate(); // Initialize useNavigate

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'password') {
            validatePassword(value);
        }
        if (name === 'confirmPassword') {
            validateConfirmPassword(value);
        }
    };

    const validatePassword = (value) => {
        setRequirements({
            ...requirements,
            lengthValid: value.length >= 7,
            specialCharValid: /[!@#$%^&*(),.?":{}|<>]/.test(value),
            numberValid: /\d/.test(value)
        });
    };

    const validateConfirmPassword = (value) => {
        setRequirements({
            ...requirements,
            passwordsMatch: value === formData.password
        });
    };

    const validatePhone = (value) => {
        return value.length === 10 && /^[6789]/.test(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { lengthValid, specialCharValid, numberValid, passwordsMatch } = requirements;
        const isPhoneValid = validatePhone(formData.phone);

        if (!lengthValid || !specialCharValid || !numberValid || !passwordsMatch) {
            alert('Please make sure all requirements are met.');
        } else if (!isPhoneValid) {
            alert('Please enter a correct phone number.');
        } else {
            axios.post('http://localhost:3001/signup', formData)
                .then(response => {
                    document.getElementById('successMessage').style.display = 'block';
                    setTimeout(() => {
                        navigate('/login'); // Navigate to Home page after successful signup
                    }, 2000);
                })
                .catch(error => {
                    console.error('There was an error registering the user!', error);
                    alert('Error registering user: ' + (error.response?.data || 'Unknown error'));
                });
        }
    };

    return (
        <div className="signup-background" style={{ backgroundImage: `url(${background})` }}>
            <div className="registration-container">
                <h2>Hospital Registration</h2>
                <form id="registrationForm" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="bloodgroup">Blood Group</label>
                        <select
                            id="bloodgroup"
                            name="bloodgroup"
                            value={formData.bloodgroup}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Select your blood group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="dob">Date of Birth</label>
                        <input
                            type="date"
                            id="dob"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <div className="password-requirements">
                            <div className={`requirement ${requirements.lengthValid ? 'valid' : 'invalid'}`}>
                                <span>At least 7 characters</span>
                            </div>
                            <div className={`requirement ${requirements.specialCharValid ? 'valid' : 'invalid'}`}>
                                <span>At least 1 special character</span>
                            </div>
                            <div className={`requirement ${requirements.numberValid ? 'valid' : 'invalid'}`}>
                                <span>At least 1 number</span>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <div className="password-requirements">
                            <div className={`requirement ${requirements.passwordsMatch ? 'valid' : 'invalid'}`}>
                                <span>Passwords match</span>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Sign Up" />
                    </div>
                </form>
                <div className="success-message" id="successMessage">
                    Account created successfully! Redirecting to Login Page...
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
