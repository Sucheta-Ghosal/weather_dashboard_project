import React, { useEffect, useState } from 'react';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';
import './ForecastCards.css'

const ForecastCards = ({ city }) => {
  const [forecastData, setForecastData] = useState([]);

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

  useEffect(() => {
    if (!city) return; 

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${import.meta.env.VITE_API5_ID}`;
    
    const fetchForecast = async () => {
      try {
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();
        
        if (!forecastResponse.ok) {
          alert(forecastData.message);
          return;
        }

        const dailyForecast = [];
        for (let i = 0; i < forecastData.list.length; i += 8) {
          const dayData = forecastData.list[i];
          dailyForecast.push({
            temperature: Math.floor(dayData.main.temp),
            wind: dayData.wind.speed,
            humidity: dayData.main.humidity,
            icon: allIcons[dayData.weather[0].icon] || clear_icon,
            date: new Date(dayData.dt * 1000).toLocaleDateString(),
          });
        }
        setForecastData(dailyForecast);
      } catch (error) {
        console.error("Error fetching forecast data:", error);
      }
    };

    fetchForecast();
  }, [city]); // Refetch forecast whenever the city changes

  return (
    <div className='forecast-container'>
      {forecastData.map((day, index) => (
        <div key={index} className='forecast-box'>
          <p className='date'>{day.date}</p>
          <img src={day.icon} alt="weather icon" />
          <p className='day_temp'>{day.temperature}°C</p>
          <div className="for">
            <img src={wind_icon} alt="" className="icon" />
            <div>
              <p>{day.wind} km/h</p>
              <span>Wind Speed</span>
            </div>
          </div>
          <div className="for">
            <img src={humidity_icon} alt="" className="icon" />
            <div>
              <p>{day.humidity} %</p>
              <span>Humidity</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ForecastCards;
