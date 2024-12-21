import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import moment from 'moment';
import './MeetingsView.css';
import { UserContext } from '../UserContext';

const MeetingsView = () => {
    const { user } = useContext(UserContext);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        if (user && user.username) {
            axios.get(`http://localhost:3001/api/appointments?doctor=${user.username}`)
                .then(response => {
                    console.log('Appointments received:', response.data);
                    setAppointments(response.data);
                })
                .catch(error => {
                    console.error('There was an error fetching the appointments!', error);
                });
        }
    }, [user]);

    const formatDate = (dateString) => {
        const date = moment(dateString, 'YYYY-MM-DD');
        if (!date.isValid()) {
            console.error('Invalid date value:', dateString);
            return 'Invalid Date';
        }
        return date.format('MMMM Do YYYY');
    };

    const formatTime = (timeString) => {
        const time = moment(timeString, 'HH:mm');
        if (!time.isValid()) {
            console.error('Invalid time value:', timeString);
            return 'Invalid Time';
        }
        return time.format('hh:mm A');
    };

    return (
        
        <div className="meetings-view">

<nav>
                <div className="nav-left">
                    <img src={require('./images/logo copy.jpg')} alt="Logo" className="logo" />
                    <span>InnovaCare</span>
                </div>
                <div className="nav-right">
                    
                    <a href="/">Logout</a> {/* Link to separate profile page */}
                </div>
            </nav>
            <h2>Appointments for Dr. {user?.username}</h2>
            <ul>
                {appointments.map((appointment, index) => (
                    <li key={index}>
                        <p><strong>Patient Name:</strong> {appointment.Name}</p>
                        <p><strong>Date:</strong> {formatDate(appointment.Date)}</p>
                        <p><strong>Time:</strong> {formatTime(appointment.Time)}</p>
                        <button 
                            className="join-meeting-button" 
                            onClick={() => window.open('https://us05web.zoom.us/j/89486954070?pwd=Zmmtc2DRoj1og1XJeG9cR84UlOb06f.1', '_blank')}
                        >
                            Join the Meeting
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MeetingsView;
