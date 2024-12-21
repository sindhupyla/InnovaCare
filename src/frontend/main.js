import React from 'react';
import './main.css'; // Import the CSS file
import { Link } from 'react-router-dom';

const Main = () => {
    return (
        <>
            <nav>
                <div className="nav-left">
                    <img src={require('./images/logo copy.jpg')} alt="Logo" className="logo" />
                    <span>InnovaCare</span>
                </div>
                <div className="nav-right">
                    <a href="#home">Home</a>
                    <a href="#about">About</a>
                    <a href="#contact">Contact Us</a>
                    <a href="/">Logout</a> {/* Link to separate profile page */}
                </div>
            </nav>
            <div id="home" className="video-section">
                <video id="background-video" autoPlay loop muted>
                    <source src={require('./images/back.mp4')} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="overlay"></div>
                <div className="welcome-text">
                    <h1>Welcome to InnovaCare....</h1>
                </div>
            </div>
            <div className="options">
                <div className="option-box">
                    <Link to="/finddoctor" className="option-link">
                        <img src={require('./images/40.jpg')} alt="Appointment Booking" />
                        Appointment Booking
                    </Link>
                </div>
                <div className="option-box">
                    <a href="dashboard.html" className="option-link">
                        <img src={require('./images/nutrition.jpg')} alt="Nutrishift" />
                        Nutrishift
                    </a>
                </div>
                <div className="option-box">
                    <Link to ="/patient-appointments" className="option-link">
                    <img src={require('./images/meetings.png')} alt="Meetings" />
                    Meetings
                    </Link>
                </div>
            </div>
            <div id="about" className="section">
                <h2>About Us</h2>
                <p><pre>Innovacare is an online web medical management system designed for users who cannot travel long distances for checkups and for students in hostels who need frequent medical </pre>
                     <pre> consultations.Innovacare provides detailed information about doctors, a user-friendly GUI, and simplifies booking appointments. Patients can check their </pre>
                     <pre> and their information is highly secured and authenticated. The platform also features Nutrishift, which suggests healthier food options and calculates nutritional information.</pre> 
                      <pre>previous appointments, join video meetings,Innovacare focuses on routine checkups and long-term management with integrated video conferencing. Unlike traditional hospital management systems, </pre>
                      <pre> Innovacare is designed for remote use, making it more accessible, user-friendly, and affordable. </pre>
                      <pre>It also surpasses typical online appointment booking systems by offering comprehensive features, including appointment history,</pre>
                       <pre> video consultations, enhanced security, and nutritional guidance through Nutrishift.</pre></p>
            </div>
            <div id="contact" className="section">
                <h2>Contact Us</h2>
                <div className="contact-icons">
                    <a href="#"><i className="fab fa-facebook"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="#"><i className="fab fa-linkedin"></i></a>
                    <a href="#"><i className="fab fa-youtube"></i></a>
                </div>
                <div className="contact-numbers">
                    <p>Phone: +91 9123 456 782</p>
                    <p>Phone: +91 9123 456 783</p>
                    <p>Phone: +91 9123 456 784</p>
                    <p>Email: info@innovacare.com</p>
                    <p>Please contact us through the above phone numbers or social media.</p>
                </div>
            </div>
            <footer>
                &copy; 2024 VaidhyoVistha. All rights reserved.
            </footer>
        </>
    );
}

export default Main;
