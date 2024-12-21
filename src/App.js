// App.js
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './frontend/Home';
import SignupPage from './frontend/Signup';
import LoginPage from './frontend/LoginPage';
import Main from './frontend/main';
import FindDoctor from './frontend/FindDoctor';
import Booking from './frontend/Booking';
import MeetingsView from './frontend/MeetingsView';

import { UserProvider } from './UserContext'; // Correctly import UserProvider
import PatientMeetings from './frontend/PatientMeetings';

function App() {
    return (
        <UserProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/main" element={<Main />} />
                <Route path="/finddoctor" element={<FindDoctor />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/meeting" element={<MeetingsView />} />
                <Route path="/patient-appointments" element={<PatientMeetings />} />
            </Routes>
        </UserProvider>
    );
}

export default App;
