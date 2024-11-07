import React, { useEffect, useState } from 'react';
import Weather from './components/Weather.jsx';
import Navbar from './components/Navbar.jsx';
import './App.css'; 

const App = () => {
  const [recentCities, setRecentCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(""); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 

  // get recent cities from localStorage and set the state
  useEffect(() => {
    const data = window.localStorage.getItem("recent");
    const recent = data === null ? [] : JSON.parse(data);
    setRecentCities(recent);
  }, []);

  // Function to handle city selection from the dropdown
  const handleCitySelect = (city) => {
    setSelectedCity(city); 
    setIsDropdownOpen(false);
  };

  return (
    <div className="app">
      <Navbar 
        recentCities={recentCities} 
        toggleDropdown={() => setIsDropdownOpen(!isDropdownOpen)} 
        isDropdownOpen={isDropdownOpen} 
        onCitySelect={handleCitySelect}
      />
      
      <Weather 
        recentCities={recentCities} 
        addDataToRecent={setRecentCities} 
        selectedCity={selectedCity} // Providing the selected city for Weather component
      />
    </div>
  );
};

export default App;
