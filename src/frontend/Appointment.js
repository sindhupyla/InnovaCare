import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Appointment.css';
import axios from 'axios';
import moment from 'moment';

const Appointment = () => {
    const location = useLocation();
    const { fullname, phone, doctor, date, time } = location.state;
    const [appointments, setAppointments] = useState([]);
    const [meetingLink, setMeetingLink] = useState('');

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get('http://localhost:3001/appointment', {
                    params: {
                        Name: fullname,
                        Phone: phone
                    }
                });
                const formattedAppointments = response.data.map(appt => ({
                    ...appt,
                    Date: moment(appt.Date).format('YYYY-MM-DD'),
                    Time: moment(appt.Time, 'HH:mm').format('HH:mm')
                }));

                const currentFormattedDate = moment(date).format('YYYY-MM-DD');
                const currentFormattedTime = moment(time, 'HH:mm').format('HH:mm');

                const previousAppointments = formattedAppointments.filter(appt => 
                    moment(`${appt.Date} ${appt.Time}`).isBefore(moment(`${currentFormattedDate} ${currentFormattedTime}`))
                );

                setAppointments(previousAppointments);
            } catch (error) {
                console.error('Error fetching appointment history:', error);
            }
        };

        fetchAppointments();
    }, [fullname, phone, date, time]);

    useEffect(() => {
        setMeetingLink(`https://meeting-platform.com/join/${Math.random().toString(36).substring(2, 15)}`);
    }, []);

    return (
        <div className="appointment-container">
            <h2>Appointment Details</h2>
            <p><strong>Patient Name:</strong> {fullname}</p>
            <p><strong>Doctor Name:</strong> {doctor}</p>
            <p><strong>Date:</strong> {moment(date).format('YYYY-MM-DD')}</p>
            <p><strong>Time:</strong> {moment(time, 'HH:mm').format('HH:mm')}</p>
            <a href={meetingLink} className="meeting-link" target="_blank" rel="noopener noreferrer">
                Join the Meeting
            </a>

            <h3>Previous Appointments</h3>
            {appointments.length > 0 ? (
                <ul className="appointment-history">
                    {appointments.map((appt, index) => (
                        <li key={index}>
                            <p><strong>Doctor:</strong> {appt.Doctor}</p>
                            <p><strong>Date:</strong> {moment(appt.Date).format('YYYY-MM-DD')}</p>
                            <p><strong>Time:</strong> {appt.Time}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No previous appointments yet.</p>
            )}
        </div>
    );
};

export default Appointment;
