import React from "react";

const CurrentWeather = ({ currentWeather }) => {
  return (
    <div className="current-weather">
      <img
        src={`/icons/${currentWeather.weatherIcon}.svg`}
        className="weather-icon"
      />
      <h2 className="temperature">{currentWeather.temperature}</h2>
      <p className="description">{currentWeather.description}</p>
    </div>
  );
};

export default CurrentWeather;
