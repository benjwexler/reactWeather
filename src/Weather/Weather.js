import React from 'react';

const weather = (props) => {

    

    return (

        <div className="Weather">
          <p> The current temp in {props.city} is {props.temp} 
          °<span>{props.unit}</span>
          </p>
          <p>Humidity: {props.humidity}%</p>
          <p> Sunrise: {props.sunrise}</p>
          <p> Sunrise: {props.sunset}</p>
          <p>Wind: {props.windDirection} {props.windspeed} mph</p>
          <p> Pressure: {props.pressure} inHg</p>
          <p>Current Time: {props.time}</p>
        </div>
    )
};

export default weather;