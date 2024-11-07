import React from 'react';
import menu from '../assets/menu_icon.png';
import './Navbar.css';

const Navbar = ({ recentCities, toggleDropdown, isDropdownOpen, onCitySelect }) => {
  return (
    <div className="navbar">
      <div className="logo">
        <h2>Weather Dashboard</h2>
      </div>

      {/* Menu button for mobile view */}
      <button className="toggler-btn" onClick={toggleDropdown}>
        <img src={menu} alt="menu icon" />
      </button>

      {/* Navigation options */}
      <div className={`options ${isDropdownOpen ? 'show' : ''}`}>
        {/* Favorite Cities Button */}
        <button className="nav-button" onClick={toggleDropdown}>
          Favorite Cities
        </button>

        {/* Dropdown for recent cities */}
        {isDropdownOpen && (
          <div className="dropdown">
            {recentCities.length > 0 ? (
              <ul>
                {recentCities.map((city, index) => (
                  <li key={index} onClick={() => onCitySelect(city)}>
                    {city}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No Favorite cities added yet.</p>
            )}
          </div>
        )}

        <a href="https://edition.cnn.com/weather" className="nav-button">
          Weather News
        </a>
      </div>
    </div>
  );
};

export default Navbar;
