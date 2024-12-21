// src/frontend/Home.js
import React from 'react';
import './Home.css';
import logo from './images/logo copy.jpg';
import image1 from './images/image1.jpg';
import image2 from './images/image2.jpg';
import image3 from './images/image3.jpg';
import image4 from './images/image4.jpg';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-page">
      <header>
        <div className="logo">
          <img src={logo} alt="Logo" />
          <span className="website-name">InnovaCare</span>
        </div>
        <div className="auth-buttons">
          <Link to="/login">
            <button className="login">Login</button>
          </Link>
          <Link to="/signup">
            <button className="signup">Signup</button>
          </Link>
        </div>
      </header>
      <main>
        <div className="carousel">
          <div className="carousel-item">
            <div className="background" style={{ backgroundImage: `url(${image1})` }}></div>
            <div className="quote">"A good laugh and a long sleep are the best cures in the doctor’s book"</div>
          </div>
          <div className="carousel-item">
            <div className="background" style={{ backgroundImage: `url(${image2})` }}></div>
            <div className="quote">"He who has health, has hope; and he who has hope, has everything"</div>
          </div>
          <div className="carousel-item">
            <div className="background" style={{ backgroundImage: `url(${image3})` }}></div>
            <div className="quote">"Health is a state of complete physical, mental and social well-being and not merely the absence of disease or infirmity. – World Health Organization"</div>
          </div>
          <div className="carousel-item">
            <div className="background" style={{ backgroundImage: `url(${image4})` }}></div>
            <div className="quote">"The greatest health is wealth"</div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
