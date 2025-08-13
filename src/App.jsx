import React, { useRef, useState } from "react";
import SearchSection from "./components/SearchSection";
import CurrentWeather from "./components/CurrentWeather";
import HourlyWeatherItem from "./components/HourlyWeatherItem";
import { weatherCodes } from "./constants";

const App = () => {
  const [currentWeather, setCurrentWeather] = useState({});
  const [hourlyForecasts, setHourlyForecasts] = useState([]);
  const searchInputRef = useRef(null);

  const filterHourlyForecast = (hourlyData) => {
    const currentHour = new Date().setMinutes(0, 0, 0);
    const next24Hours = currentHour + 24 * 60 * 60 * 1000;
    const next24HoursData = hourlyData.filter(({ time }) => {
      const forecastTime = new Date(time).getTime();
      return forecastTime >= currentHour && forecastTime <= next24Hours;
    });
    setHourlyForecasts(next24HoursData);
  };

  //fetches weather details based on the API URL
  const getWeatherDetails = async (API_URL) => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      //extracting current weather data
      const temperature = data.current.temp_c;
      const description = data.current.condition.text;
      const weatherIcon = Object.keys(weatherCodes).find((icon) => {
        return weatherCodes[icon].includes(data.current.condition.code);
      });

      setCurrentWeather({ temperature, description, weatherIcon });

      //combining hourly data from both forecast days
      const combinedHourlyData = [
        ...data.forecast.forecastday[0].hour,
        ...data.forecast.forecastday[1].hour,
      ];

      searchInputRef.current.value = data.location.name;
      filterHourlyForecast(combinedHourlyData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <SearchSection
        getWeatherDetails={getWeatherDetails}
        searchInputRef={searchInputRef}
      />

      <div className="weather-section">
        <CurrentWeather currentWeather={currentWeather} />
        {/* hourly weather forecast list */}
        <div className="hourly-forecast">
          <ul className="weather-list">
            {hourlyForecasts.map((hourlyWeather) => (
              <HourlyWeatherItem
                key={hourlyWeather.time_epoch}
                hourlyWeather={hourlyWeather}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
