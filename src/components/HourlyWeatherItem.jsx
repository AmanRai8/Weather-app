import React from "react";
import { weatherCodes } from "../constants";

const HourlyWeatherItem = ({ hourlyWeather }) => {
  const temperature = Math.floor(hourlyWeather.temp_c);
  const time = hourlyWeather.time.split(" ")[1].substring(0, 5);
  const weatherIcon = Object.keys(weatherCodes).find((icon) => {
    return weatherCodes[icon].includes(hourlyWeather.condition.code);
  });
  return (
    <li className="weather-item">
      <p className="time">{time}</p>
      <img src={`/icons/${weatherIcon}.svg`} className="weather-icon" />
      <p className="temperature">{temperature}°</p>
    </li>
  );
};

export default HourlyWeatherItem;
