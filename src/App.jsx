import React, { useRef, useState, useEffect } from "react";
import SearchSection from "./components/SearchSection";
import CurrentWeather from "./components/CurrentWeather";
import HourlyWeatherItem from "./components/HourlyWeatherItem";
import { weatherCodes } from "./constants";
import GitHubCorner from "./components/GithubCorner";

const App = () => {
  const [currentWeather, setCurrentWeather] = useState({});
  const [hourlyForecasts, setHourlyForecasts] = useState([]);
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
    try {
      const response = await fetch(API_URL);
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
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

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
      </div>
    </div>
  );
};

export default App;
