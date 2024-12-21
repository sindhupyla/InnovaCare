const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const moment = require('moment-timezone');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // replace with your MySQL root password if you have set one
    database: 'miniproject'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ', err);
        process.exit(1); // Exit the process if connection fails
    } else {
        console.log('Connected to MySQL');
    }
});

// Endpoint for user registration
app.post('/signup', async (req, res) => {
    const { username, email, phone, bloodgroup, dob, password } = req.body;

    try {
        if (!username || !email || !phone || !bloodgroup || !dob || !password) {
            return res.status(400).send('All fields are required.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if user already exists
        const checkQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
        db.query(checkQuery, [username, email], (err, results) => {
            if (err) {
                console.error('Error executing checkQuery:', err);
                return res.status(500).send('Internal Server Error');
            }

            if (results.length > 0) {
                return res.status(400).send('User with this username or email already exists');
            }

            // Insert the new user
            const query = 'INSERT INTO users (username, email, phone, bloodgroup, dob, password) VALUES (?, ?, ?, ?, ?, ?)';
            db.query(query, [username, email, phone, bloodgroup, dob, hashedPassword], (err) => {
                if (err) {
                    console.error('Error executing insert query:', err);
                    return res.status(500).send('Internal Server Error');
                }

                res.status(200).send('User registered successfully');
            });
        });
    } catch (err) {
        console.error('Error during signup:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoint for patient login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error executing login query:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length === 0) {
            return res.status(401).send('Invalid username or password');
        }

        const user = results[0];
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).send('Internal Server Error');
            }

            if (result) {
                res.status(200).send('Login successful');
            } else {
                res.status(401).send('Invalid username or password');
            }
        });
    });
});

// Endpoint for doctor login
app.post('/doctor-login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM doctors WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        if (result.length > 0) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    });
});

// Endpoint for booking appointments
app.post('/booking', (req, res) => {
    const { Name, Phone, Doctor, Date, Time } = req.body;

    if (!Name || !Phone || !Doctor || !Date || !Time) {
        return res.status(400).send('Please provide name, phone, doctor, date, and time.');
    }

    // 1. Check if the same person is trying to book the same appointment twice
    const checkExactDuplicateQuery = 'SELECT * FROM booking WHERE Name = ? AND Phone = ? AND Doctor = ? AND Date = ? AND Time = ?';
    db.query(checkExactDuplicateQuery, [Name, Phone, Doctor, Date, Time], (err, results) => {
        if (err) {
            console.error('Error executing checkExactDuplicateQuery:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length > 0) {
            return res.status(409).send('You have already booked the appointment with the same details.');
        }

        // 2. Check if another person is trying to book the same time slot for the same doctor
        const checkSlotAvailabilityQuery = 'SELECT * FROM booking WHERE Doctor = ? AND Date = ? AND Time = ?';
        db.query(checkSlotAvailabilityQuery, [Doctor, Date, Time], (err, slotResults) => {
            if (err) {
                console.error('Error executing checkSlotAvailabilityQuery:', err);
                return res.status(500).send('Internal Server Error');
            }
            if (slotResults.length > 0) {
                // Slot is occupied by someone else for the same doctor, but it's OK to book with different doctor
                return res.status(409).send('Slot is not available.');
            }

            // 3. Check if another person has an appointment with the same Name, Phone, Date, and Time but different doctor
            const checkDifferentDoctorQuery = 'SELECT * FROM booking WHERE Name = ? AND Phone = ? AND Date = ? AND Time = ? AND Doctor != ?';
            db.query(checkDifferentDoctorQuery, [Name, Phone, Date, Time, Doctor], (err, differentDoctorResults) => {
                if (err) {
                    console.error('Error executing checkDifferentDoctorQuery:', err);
                    return res.status(500).send('Internal Server Error');
                }
                if (differentDoctorResults.length > 0) {
                    return res.status(409).send('You already have an appointment with another doctor at the same time.');
                }

                // Insert new booking if all checks pass
                const insertQuery = 'INSERT INTO booking (Name, Phone, Doctor, Date, Time) VALUES (?, ?, ?, ?, ?)';
                db.query(insertQuery, [Name, Phone, Doctor, Date, Time], (err) => {
                    if (err) {
                        console.error('Error executing insert query:', err);
                        return res.status(500).send('Internal Server Error');
                    }
                    res.status(200).send('Appointment booked successfully.');
                });
            });
        });
    });
});



app.get('/api/appointments', (req, res) => {
    const { doctor } = req.query;
    console.log(`Fetching appointments for doctor: ${doctor}`);

    const query = 'SELECT Name, Date, Time FROM booking WHERE Doctor = ?';
    db.query(query, [doctor], (err, results) => {
        if (err) {
            console.error('Error fetching appointments:', err);
            res.status(500).json({ error: 'Error fetching appointments' });
        } else {
            const formattedResults = results.map(appointment => {
                const date = moment(appointment.Date).format('YYYY-MM-DD');
                const time = moment(appointment.Time, 'HH:mm:ss').format('HH:mm');
                return {
                    Name: appointment.Name,
                    Date: date,
                    Time: time
                };
            });
            console.log(`Fetched appointments: ${JSON.stringify(formattedResults)}`);
            res.json(formattedResults);
        }
    });
});

// In your server.js or routes file

app.get('/patient-appointments', (req, res) => {
    const username = req.query.username;
    const query = 'SELECT * FROM booking WHERE Name = ?';

    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error fetching patient appointments:', err);
            res.status(500).json({ error: 'Failed to fetch appointments' });
        } else {
            const formattedResults = results.map((appointment) => ({
                ...appointment,
                Date: moment(appointment.Date).format('YYYY-MM-DD')
            }));
            res.json(formattedResults);
        }
    });
});



app.listen(port, (err) => {
    if (err) {
        console.error('Error starting the server:', err);
        process.exit(1); // Exit the process if the server fails to start
    }
    console.log(`Server is running on port ${port}`);
});
