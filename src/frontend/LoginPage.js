// LoginPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';
import doctorIcon from './images/doctor-icon1.jpg';
import patientIcon from './images/patient-icon.png';
import background from './images/h3.png';
import { UserContext } from '../UserContext';

const LoginPage = () => {
    const [doctorLoginData, setDoctorLoginData] = useState({
        username: '',
        password: ''
    });

    const [patientLoginData, setPatientLoginData] = useState({
        username: '',
        password: ''
    });

    const [doctorLoginError, setDoctorLoginError] = useState('');
    const [patientLoginError, setPatientLoginError] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [welcomeMessage, setWelcomeMessage] = useState('');
    const navigate = useNavigate();
    const [loginType, setLoginType] = useState('');
    const { setUser } = useContext(UserContext); // Use the UserContext to set the user

    useEffect(() => {
        if (modalVisible) {
            const timer = setTimeout(() => {
                setModalVisible(false);
                if (loginType === 'doctor') {
                    navigate('/meeting');
                } else if (loginType === 'patient') {
                    navigate('/main');
                }
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [modalVisible, navigate, loginType]);

    const handleDoctorChange = (e) => {
        const { name, value } = e.target;
        setDoctorLoginData({ ...doctorLoginData, [name]: value });
    };

    const handlePatientChange = (e) => {
        const { name, value } = e.target;
        setPatientLoginData({ ...patientLoginData, [name]: value });
    };

    const handleLogin = async (e, type) => {
        e.preventDefault();
        setLoginType(type);
        const endpoint = type === 'doctor' ? '/doctor-login' : '/login';
        const loginData = type === 'doctor' ? doctorLoginData : patientLoginData;

        try {
            const response = await axios.post(`http://localhost:3001${endpoint}`, loginData);
            if (response.status === 200) {
                setWelcomeMessage(`Welcome, ${loginData.username}!`);
                setUser({ username: loginData.username, type }); // Store the username and type in the context
                setModalVisible(true);
                if (type === 'doctor') {
                    setDoctorLoginError('');
                } else {
                    setPatientLoginError('');
                }
            }
        } catch (error) {
            if (type === 'doctor') {
                setDoctorLoginError('Invalid username or password!');
            } else {
                setPatientLoginError('Invalid username or password!');
            }
            console.error('There was an error logging in!', error);
        }
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    return (
        <div>
            <div className="login-background" style={{ backgroundImage: `url(${background})` }}>
                <div className="login-container doctor-login">
                    <h2><img src={doctorIcon} alt="Doctor Icon" /> Doctor Login</h2>
                    <form onSubmit={(e) => handleLogin(e, 'doctor')}>
                        <div className="form-group">
                            <label htmlFor="doctor-username">Username</label>
                            <input
                                type="text"
                                id="doctor-username"
                                name="username"
                                value={doctorLoginData.username}
                                onChange={handleDoctorChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="doctor-password">Password</label>
                            <input
                                type="password"
                                id="doctor-password"
                                name="password"
                                value={doctorLoginData.password}
                                onChange={handleDoctorChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input type="submit" value="Login" />
                        </div>
                        {doctorLoginError && <p className="error">{doctorLoginError}</p>}
                    </form>
                </div>
                <div className="login-container patient-login">
                    <h2><img src={patientIcon} alt="Patient Icon" /> Patient Login</h2>
                    <form onSubmit={(e) => handleLogin(e, 'patient')}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={patientLoginData.username}
                                onChange={handlePatientChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={patientLoginData.password}
                                onChange={handlePatientChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input type="submit" value="Login" />
                        </div>
                        {patientLoginError && <p className="error">{patientLoginError}</p>}
                    </form>
                </div>

                {/* The Modal */}
                {modalVisible && (
                    <div id="successModal" className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={closeModal}>&times;</span>
                            <h2>Login Successful</h2>
                            <p id="welcomeMessage">{welcomeMessage}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
