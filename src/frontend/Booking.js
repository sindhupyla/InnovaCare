import React, { useState } from 'react';
import axios from 'axios';
import './Booking.css';

const Booking = () => {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        phone: '',
        specialization: '',
        doctor: '',
        date: '',
        time: ''
    });

    const [errors, setErrors] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    const doctors = {
        Cardiology: ['John Doe', 'Jane Smith', 'Emily Johnson', 'Michael Brown', 'Linda Davis'],
        Pediatrician: ['Riley', 'Hannah', 'Isaac', 'Madison', 'Isabella'],
        Gynecologist: ['Emma', 'Vibha', 'Anju Martin', 'Anchala', 'Minu'],
        Psychiatrist: ['Olivia', 'Benjamin', 'Henry', 'Michael Stone', 'Scarlett Davis'],
        Dermatologist: ['Sophia Adams', 'Alexander Brown', 'Amaira Clarke', 'William Evans', 'Mia Garcia'],
        FamilyMedicinePhysician: ['John', 'Jane', 'Johnson', 'Michael', 'David']
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateFullName = () => formData.fullname.trim() !== "";
    const validatePhoneNumber = () => /^[0-9]{10}$/.test(formData.phone);
    const validateEmail = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const validateDateTime = () => {
        const currentDate = new Date();
        const selectedDate = new Date(`${formData.date}T${formData.time}`);
        return selectedDate > currentDate;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newErrors = {};
        if (!validateFullName()) newErrors.fullname = "Full name is required.";
        if (!validatePhoneNumber()) newErrors.phone = "Phone number should be 10 digits.";
        if (!validateEmail()) newErrors.email = "Invalid email format.";
        if (!validateDateTime()) newErrors.dateTime = "Date and time must be in the future.";

        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            try {
                const response = await axios.post('http://localhost:3001/booking', {
                    Name: formData.fullname,
                    Phone: formData.phone,
                    Doctor: formData.doctor,
                    Date: formData.date,
                    Time: formData.date + 'T' + formData.time,
                });
                console.log(response.data);
                setPopupMessage('Appointment booked successfully!');
            } catch (error) {
                if (error.response && error.response.status === 409) {
                    setPopupMessage('We’re sorry, but we are unable to complete your booking request.');
                } else {
                    setPopupMessage('Booking failed. Please try again.');
                }
                console.error('Booking failed:', error);
            }
            setShowPopup(true);
        }
    };

    const handleCancel = () => {
        setShowPopup(false);
    };

    const filteredDoctors = formData.specialization ? doctors[formData.specialization] : [];

    return (
        <div className="booking-page">
            <div className="navbar">
                <div className="logo">
                <img src={require('./images/logo copy.jpg')} alt="Logo" className="logo" />
                <span><strong>InnovaCare</strong></span>

                </div>
                
                <div className="links">
                    <a href="/main">Home</a>
                    <a href="/main">About Us</a>
                    <a href="/">Logout</a>
                    <a href="/main">Contact Us</a>
                    
                </div>
            </div>
            <div className="container">
                <h2>Book an Appointment</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="fullname">Full Name:</label>
                    <input
                        type="text"
                        id="fullname"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                        className={errors.fullname ? 'error' : ''}
                        required
                    />
                    {errors.fullname && <p className="error-text">{errors.fullname}</p>}

                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? 'error' : ''}
                        required
                    />
                    {errors.email && <p className="error-text">{errors.email}</p>}

                    <label htmlFor="phone">Phone Number:</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={errors.phone ? 'error' : ''}
                        required
                        pattern="[0-9]{10}"
                        title="Phone number should be 10 digits"
                    />
                    {errors.phone && <p className="error-text">{errors.phone}</p>}

                    <label htmlFor="specialization">Select Specialization:</label>
                    <select
                        id="specialization"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        className={errors.specialization ? 'error' : ''}
                        required
                    >
                        <option value="">Select Specialization</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Pediatrician">Pediatrician</option>
                        <option value="Gynecologist">Gynecologist</option>
                        <option value="Psychiatrist">Psychiatrist</option>
                        <option value="Dermatologist">Dermatologist</option>
                        <option value="FamilyMedicinePhysician">Family Medicine Physician</option>
                    </select>
                    {errors.specialization && <p className="error-text">{errors.specialization}</p>}

                    {formData.specialization && (
                        <>
                            <label htmlFor="doctor">Select Doctor:</label>
                            <select
                                id="doctor"
                                name="doctor"
                                value={formData.doctor}
                                onChange={handleChange}
                                className={errors.doctor ? 'error' : ''}
                                required
                            >
                                <option value="">Select Doctor</option>
                                {filteredDoctors.map((doctor, index) => (
                                    <option key={index} value={doctor}>{doctor}</option>
                                ))}
                            </select>
                            {errors.doctor && <p className="error-text">{errors.doctor}</p>}
                        </>
                    )}

                    <label htmlFor="date">Select Date:</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className={errors.dateTime ? 'error' : ''}
                        required
                    />

                    <label htmlFor="time">Select Time:</label>
                    <input
                        type="time"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className={errors.dateTime ? 'error' : ''}
                        required
                    />
                    {errors.dateTime && <p className="error-text">{errors.dateTime}</p>}

                    <input type="submit" value="Book Appointment" />
                </form>
            </div>

            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h3>{popupMessage}</h3>
                        <button onClick={handleCancel}>OK</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Booking;
