import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext';
import './PatientMeetings.css';

const PatientMeetings = () => {
    const { user } = useContext(UserContext); // Retrieve the logged-in user from context
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true); // State to handle loading

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!user) {
                return;
            }
            try {
                const response = await axios.get('http://localhost:3001/patient-appointments', {
                    params: { username: user.username },
                });
                const formattedAppointments = response.data.map((appointment) => ({
                    ...appointment,
                    Date: moment(appointment.Date).format('DD/MM/YYYY'),
                }));
                setAppointments(formattedAppointments);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching is done
            }
        };

        fetchAppointments();
    }, [user]);

    if (loading) {
        return <p>Loading...</p>; // Display loading message while fetching data
    }

    if (!user) {
        return <p>User is not logged in.</p>; // Handle case where user is null
    }

    return (
        <div className="patient-meetings-container">
            <nav className="find-doctor-nav">
                <div className="nav-left">
                    <img src={require('./images/logo copy.jpg')} alt="Logo" className="logo" />
                    <span>InnovaCare</span>
                </div>
                <div className="nav-right">
                    <Link to="/main">Home</Link>
                    <Link to="/main">About</Link>
                    <Link to="/main">Contact Us</Link>
                    <Link to="/">Logout</Link>
                </div>
            </nav>
            <div className="content">
                <h2>Your Appointments</h2>
                {appointments.length === 0 ? (
                    <p>No appointments found.</p>
                ) : (
                    <ul className="patient-meetings-list">
                        {appointments.map((appointment) => (
                            <li key={appointment.Sno} className="appointment-item">
                                <p>Doctor: {appointment.Doctor}</p>
                                <p>Date: {appointment.Date}</p>
                                <p>Time: {appointment.Time}</p>
                                <button onClick={() => window.open('https://us05web.zoom.us/j/89486954070?pwd=Zmmtc2DRoj1og1XJeG9cR84UlOb06f.1', '_blank')}>
                                    Join the Meet
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default PatientMeetings;
