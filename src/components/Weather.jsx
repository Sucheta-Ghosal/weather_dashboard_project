import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search_icon.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';
import sunnyVideo from '../assets/sunny_video.mp4';
import rainyVideo from '../assets/rain_video.mp4';
import drizzleVideo from '../assets/drizzle_video.mp4';
import cloudyVideo from '../assets/cloudy_video.mp4';
import snowyVideo from '../assets/snowy_video.mp4';
import empty_star from '../assets/fav1.png';
import filled_star from '../assets/fav2.png';
import ForecastCards from './ForecastCards';  

const Weather = ({ recentCities, addDataToRecent, selectedCity }) => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [cityName, setCityName] = useState(""); // State for city name

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  const videoMap = {
    "Clear": sunnyVideo,
    "Rain": rainyVideo,
    "Clouds": cloudyVideo,
    "Snow": snowyVideo,
    "Drizzle": drizzleVideo,
  };

  // Fetch weather data based on city
  const fetchWeatherData = async (city) => {
    if (city === "") {
      alert("Enter City Name");
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      const icon = allIcons[data.weather[0].icon] || clear_icon;

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
        condition: data.weather[0].main,
      });

      setCityName(data.name);

      // Check if the city is already in favorites
      setIsFavorite(recentCities.includes(data.name));

    } catch (error) {
      setWeatherData(false);
      console.error("Error in fetching weather data");
    }
  };

  // If selectedCity exists, fetch its weather, else wait for search
  useEffect(() => {
    if (selectedCity) {
      fetchWeatherData(selectedCity); 
    }
  }, [selectedCity]);

  const handleAddToFavorites = (city) => {
    let updatedCities;
    if (!recentCities.includes(city)) {
      updatedCities = [...recentCities, city];
      setIsFavorite(true); // Set as favorite
    } else {
      updatedCities = recentCities.filter(c => c !== city);
      setIsFavorite(false); // Remove from favorites
    }
    addDataToRecent(updatedCities);
    window.localStorage.setItem("recent", JSON.stringify(updatedCities));
  };

  const search = async (city) => {
    if (city === "") {
      alert("Please enter a city name");
      return;
    }
    fetchWeatherData(city);
  };

  return (
    <div className='weather'>
      {weatherData && (
        <video autoPlay loop muted className='background-video' src={videoMap[weatherData.condition] || sunnyVideo} />
      )}
      
      {/* Search Bar */}
      <div className="search-bar">
        <input 
          ref={inputRef} 
          type="text" 
          placeholder="Search for a City" 
          onKeyDown={(e) => e.key === 'Enter' && search(inputRef.current.value)} 
        />
        <img 
          src={search_icon} 
          alt="Search" 
          onClick={() => search(inputRef.current.value)} 
        />
      </div>

      <div className="weather-box">
        {weatherData ? (
          <div className="current-weather">
            <img src={weatherData.icon} alt={weatherData.condition} className='weather-icon' />
            <p className='temperature'>{weatherData.temperature}°C</p>
            <p className='location'>{weatherData.location}</p>
            <div className='favorite'>
              <img 
                src={isFavorite ? filled_star : empty_star} 
                alt="Favorite" 
                onClick={() => handleAddToFavorites(weatherData.location)} 
              />
            </div>
            <div className='weather-data'>
              <div className="col">
                <img src={humidity_icon} alt="Humidity" />
                <div>
                  <p>{weatherData.humidity} %</p>
                  <span>Humidity</span>
                </div>
              </div>
              <div className="col">
                <img src={wind_icon} alt="Wind Speed" />
                <div>
                  <p>{weatherData.windSpeed} km/h</p>
                  <span>Wind Speed</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Search for a city to see the weather details!</p>
        )}
      </div>

      <div className='Forecast'>
        {cityName && <ForecastCards city={cityName} />}
      </div>
    </div>
  );
};

export default Weather;
