import React, { Component } from 'react';
import './App.css';
import Form from './Form/Form.js';
import Weather from './Weather/Weather.js';
import Unit from './Unit/Unit.js';

class App extends Component {

  state = {
    temp: undefined,
    unit: "F",
    city: undefined,
    humidity: undefined,
    sunrise: undefined,
    sunset: undefined,
    windspeed: undefined,
    windDirection: undefined,
    precipitation: undefined,
  }

  setUnit = (event) => {

    let currentUnit
    let setTemp

    if(event.target.innerText === "Farenheit") {
        currentUnit = "F"

        if (this.state.unit === "C") {
        setTemp = (this.state.temp * 9/5) + 32
        } else {
          setTemp = this.state.temp
        }

    } else {
      currentUnit = "C"
      if (this.state.unit === "F") {
        setTemp = (this.state.temp - 32) * 5/9
      } else {
        setTemp = this.state.temp
      }

    }

    this.setState({
      temp: setTemp,
      unit: currentUnit,
     

    });
  }

  fetchWeather = () => {

   let that = this
   let cityOrZipValue = document.getElementById("city").value
   let typeOfQuery = 'q'
   let unit
   let setUnit
   let city 
   let humidity
   let pressure 

   if (/\d/.test(cityOrZipValue)) {
    typeOfQuery = 'zip'
   }
   let country = document.getElementById("country").value

   if (country.toLowerCase() === "united states") {
     country = 'us'
   }

   if(this.state.unit === "F") {
     unit = 'imperial'
     setUnit = "F"
   } else {
     unit = 'metric'
     setUnit = "C"
   }

   let apiKey = process.env.REACT_APP_API_KEY

   fetch(`http://api.openweathermap.org/data/2.5/weather?${typeOfQuery}=${cityOrZipValue},${country}&APPID=${apiKey}&units=${unit}`)
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {


    if(myJson.main !== undefined) {
      console.log(myJson)
      console.log(myJson.wind)
      const currentTemp = myJson.main.temp 
      city = myJson.name
      humidity = myJson.main.humidity 
      pressure = (myJson.main.pressure/33.863886666667).toFixed(2)

    that.setState({
      temp: currentTemp,
      unit: setUnit,
      city: city,
      humidity: humidity,
      sunrise: myJson.sys.sunrise,
      sunset: myJson.sys.sunset,
      windspeed: myJson.wind.speed,
      windDirection: myJson.wind.deg,
      pressure: pressure

    });
    }
  });

  fetch(`http://api.openweathermap.org/data/2.5/forecast?${typeOfQuery}=${cityOrZipValue},${country}&APPID=${apiKey}&units=${unit}`)
  .then(function(response) {
    console.log(response.json());
  })



  }

  render() {

    let temp = null
    let sunriseUnix = new Date(this.state.sunrise * 1000)
    let sunriseHour = sunriseUnix.getHours()
    let sunriseMinutes = sunriseUnix.getMinutes()

    sunriseMinutes = ("0" + sunriseMinutes).slice(-2);

    let sunriseAMorPM = "AM"

    if (sunriseHour > 11) {
      sunriseAMorPM = "PM"
      sunriseHour -= 12
    } 

  
    let sunsetUnix = new Date(this.state.sunset * 1000)
    let sunsetHour = sunsetUnix.getHours()
    let sunsetMinutes = sunsetUnix.getMinutes()
    sunsetMinutes = ("0" + sunsetMinutes).slice(-2);
    let sunsetAMorPM = "PM"

    let windDirection
    
    let windDegrees = this.state.windDirection

    if(windDegrees > 348.75 || windDegrees <= 11.25 ) {
      windDirection = "E"
    } else if(windDegrees > 11.25 || windDegrees <= 33.75) {
      windDirection = "NNE"
    } else if(windDegrees > 33.75 || windDegrees <= 56.25) {
      windDirection = "NE"
    } else if(windDegrees > 56.25 || windDegrees <= 78.75) {
      windDirection = "ENE"
    } else if(windDegrees > 78.75 || windDegrees <= 101.25) {
      windDirection = "E"
    } else if(windDegrees > 101.25 || windDegrees <= 123.75) {
      windDirection = "ESE"
    } else if(windDegrees > 123.75 || windDegrees <= 146.25) {
      windDirection = "SE"
    } else if(windDegrees > 146.25 || windDegrees <= 168.75) {
      windDirection = "SSE"
    } else if(windDegrees > 168.75 || windDegrees <= 191.25) {
      windDirection = "S"
    } else if(windDegrees > 191.25 || windDegrees <= 213.75) {
      windDirection = "SSW"
    } else if(windDegrees > 213.75 || windDegrees <= 236.25) {
      windDirection = "SW"
    } else if(windDegrees > 236.25 || windDegrees <= 258.75) {
      windDirection = "WSW"
    } else if(windDegrees > 258.75 || windDegrees <= 281.25) {
      windDirection = "W"
    } else if(windDegrees > 281.25 || windDegrees <= 303.75) {
      windDirection = "WNW"
    } else if(windDegrees > 303.75 || windDegrees <= 326.25) {
      windDirection = "NW"
    } else  {
      windDirection = "NNW"
    } 

  

    if (sunsetHour < 12) {
      sunsetAMorPM = "PM"
    } else {
      sunsetHour -= 12 
    }

    if (this.state.temp) {

      temp = (
        <div>
      <Weather temp={Math.round(this.state.temp)} unit={this.state.unit} city={this.state.city} humidity={this.state.humidity}
        sunrise={`${sunriseHour}:${sunriseMinutes} ${sunriseAMorPM}`}
        sunset={`${sunsetHour}:${sunsetMinutes} ${sunsetAMorPM}`}
        windspeed={Math.round(this.state.windspeed)}
        windDirection={windDirection}
        pressure={this.state.pressure}
      />
      </div>
      )
    }

    return (
      <div className="App">

      <Unit
        click={this.setUnit}
      />
        <Form
          click={this.fetchWeather}
        />
          {temp}
        
      </div>
    );
  }
}

export default App;
