import React from 'react';
import { Link } from 'react-router-dom';
import './FindDoctor.css'; // Import corresponding CSS file
import { FaSearch } from 'react-icons/fa'; // Import the search icon from react-icons

class FindDoctor extends React.Component {
  componentDidMount() {
    this.rotateImageAndQuote(); // Initial rotation on component mount
    setInterval(this.rotateImageAndQuote, 5000); // Rotate every 5 seconds
  }

  state = {
    doctorData: [
      { image: require("./images/1.jpg"), quote: "Your health is our priority." },
      { image: require("./images/2.jpg"), quote: "We care for your well-being." },
      { image: require("./images/3.jpg"), quote: "Trust our experienced doctors." },
      { image: require("./images/4.jpg"), quote: "Making healthcare accessible." }
    ],
    index: 0,
    specializations: [
      "Cardiologist",
      "Psychiatrist",
      "Pediatrician",
      "Dermatologist",
      "Family Medicine Physician",
      "Gynecologist"
    ]
  };

  rotateImageAndQuote = () => {
    const { doctorData, index } = this.state;
    this.setState({
      index: (index + 1) % doctorData.length
    });
  };

  suggestSpecializations = () => {
    const selectElement = document.getElementById('specializations');
    const selectedValue = selectElement.value.toLowerCase();

    if (selectedValue) {
      const filteredSpecializations = this.state.specializations.filter(spec =>
        spec.toLowerCase().includes(selectedValue)
      );
      const suggestions = document.getElementById('suggestions');
      suggestions.innerHTML = '';
      if (filteredSpecializations.length > 0) {
        suggestions.style.display = 'block';
        filteredSpecializations.forEach(spec => {
          const suggestionItem = document.createElement('div');
          suggestionItem.textContent = spec;
          suggestionItem.onclick = () => {
            selectElement.value = spec;
            suggestions.style.display = 'none';
          };
          suggestions.appendChild(suggestionItem);
        });
      } else {
        suggestions.style.display = 'none';
      }
    }
  };

  searchSpecialization = () => {
    const selectElement = document.getElementById('specializations');
    const selectedValue = selectElement.value.toLowerCase();
    // Redirect based on selected specialization
    if (selectedValue === 'cardiologist') {
      window.location.href = 'cardio.html'; // Redirect to cardio.html
    } else if (selectedValue === 'psychiatrist') {
      window.location.href = 'psy.html';
    } else if (selectedValue === 'pediatrician') {
      window.location.href = 'pedia.html';
    } else if (selectedValue === 'dermatologist') {
      window.location.href = 'derma.html';
    } else if (selectedValue === 'family medicine physician') {
      window.location.href = 'physician.html';
    } else if (selectedValue === 'gynecologist') {
      window.location.href = 'gyno.html';
    }
  };

  render() {
    const { doctorData, index } = this.state;
    return (
      <div className="find-doctor-container">
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
        <div className="find-doctor-search-container">
          <div className="find-doctor-image-container">
            <img src={doctorData[index].image} alt="Doctor" className="doctor-image" />
            <p className="quotes">{doctorData[index].quote}</p>
          </div>
          <div className="find-doctor-search-box">
            <select id="specializations" onChange={this.suggestSpecializations}>
              <option value="">Select specialization</option>
              {this.state.specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
            <button className="search-button" onClick={this.searchSpecialization}>
              <FaSearch className="search-icon" />
            </button>
            <div id="suggestions" className="find-doctor-suggestions"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default FindDoctor;
