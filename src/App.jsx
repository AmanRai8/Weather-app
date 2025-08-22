import React, { useRef, useState, useEffect } from "react";
import SearchSection from "./components/SearchSection";
import CurrentWeather from "./components/CurrentWeather";
import HourlyWeatherItem from "./components/HourlyWeatherItem";
import { weatherCodes } from "./constants";
import GitHubCorner from "./components/GitHubCorner";
import NoResultsDiv from "./components/NoResultsDiv";

const App = () => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const [currentWeather, setCurrentWeather] = useState({});
  const [hourlyForecasts, setHourlyForecasts] = useState([]);
  const [hasNoResults, setHasNoResults] = useState(false);
  const searchInputRef = useRef(null);
  const scrollRef = useRef(null);

  // Enabling sideways scroll with the mouse
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const onWheel = (evt) => {
      evt.preventDefault();
      scrollContainer.scrollLeft += evt.deltaY;
    };

    scrollContainer.addEventListener("wheel", onWheel);
    return () => scrollContainer.removeEventListener("wheel", onWheel);
  }, []);

  const filterHourlyForecast = (hourlyData) => {
    const currentHour = new Date().setMinutes(0, 0, 0);
    const next24Hours = currentHour + 24 * 60 * 60 * 1000;
    const next24HoursData = hourlyData.filter(({ time }) => {
      const forecastTime = new Date(time).getTime();
      return forecastTime >= currentHour && forecastTime <= next24Hours;
    });
    setHourlyForecasts(next24HoursData);
  };

  // Fetches weather details based on the API URL
  const getWeatherDetails = async (API_URL) => {
    setHasNoResults(false);
    window.innerWidth <= 768 && searchInputRef.current.focus();
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error();
      const data = await response.json();

      // Extract current weather data
      const temperature = `${Math.floor(data.current.temp_c)}\u00B0C`;
      const description = data.current.condition.text;
      const weatherIcon = Object.keys(weatherCodes).find((icon) =>
        weatherCodes[icon].includes(data.current.condition.code)
      );

      setCurrentWeather({ temperature, description, weatherIcon });

      // Combine hourly data from both forecast days
      const combinedHourlyData = [
        ...data.forecast.forecastday[0].hour,
        ...data.forecast.forecastday[1].hour,
      ];

      searchInputRef.current.value = data.location.name;
      filterHourlyForecast(combinedHourlyData);
    } catch {
      //setting setHasNoResults state if there's an error
      setHasNoResults(true);
    }
  };

  //default city as tokyo
  useEffect(() => {
    const defaultCity = "Tokyo";
    const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${defaultCity}&days=2`;
    getWeatherDetails(API_URL);
  }, []);

  return (
    <div>
      {/* Github corner button */}
      <GitHubCorner
        repoUrl="https://github.com/AmanRai8/Weather-app"
        position="left" // or "right"
      />

      <div className="container">
        <SearchSection
          getWeatherDetails={getWeatherDetails}
          searchInputRef={searchInputRef}
        />
        {/* conditionally rendering based on hasNoResults state */}
        {hasNoResults ? (
          <NoResultsDiv />
        ) : (
          <div className="weather-section">
            <CurrentWeather currentWeather={currentWeather} />
            {/* Hourly weather forecast list */}
            <div className="hourly-forecast">
              <ul ref={scrollRef} className="weather-list">
                {hourlyForecasts.map((hourlyWeather) => (
                  <HourlyWeatherItem
                    key={hourlyWeather.time_epoch}
                    hourlyWeather={hourlyWeather}
                  />
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
