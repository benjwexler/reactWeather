import React, { Component } from 'react';
import './App.css';
import Form from './Form/Form.js';
import Weather from './Weather/Weather.js';
import Unit from './Unit/Unit.js';
import City from './City/City';

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
    currentTime: undefined,
    gmtOffset: undefined,
    listOfCities: []
  }

  currentTemp = (lat, lon) => {
    let apiKey = process.env.REACT_APP_API_KEY
    let timeZoneAPIkey = process.env.REACT_APP_TIMEZONE_API_KEY
    let that = this

    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${apiKey}&units=imperial`)
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        console.log(myJson)
        console.log(myJson.name)
        console.log(myJson.coord.lat)
        let listOfCities = [...that.state.listOfCities]
        let city = {
          name: myJson.name,
          temp: myJson.main.temp,
          cityId: myJson.id
        }
        // city.name = myJson.name
        listOfCities.push(city)
        that.setState({
          listOfCities: listOfCities
        });

        fetch(`https://api.timezonedb.com/v2.1/get-time-zone?key=${timeZoneAPIkey}&format=json&by=position&lat=${myJson.coord.lat}&lng=${myJson.coord.lon}`)
          .then(function (response) {
            console.log(response)
            console.log("timezone")
            return response.json();
          })
          .then(function (myJson) {
            console.log(myJson)
          })
      })






  }

  secondsInterval = setInterval(
    () => this.updateTime2(),
    1000)

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position.coords.latitude)
        console.log(position.coords.longitude)
        this.currentTemp(position.coords.latitude, position.coords.longitude)
      })

    setTimeout(
      () =>
        setInterval(
          () => this.updateTime(),
          60000)

      , (60000 - ((new Date().getSeconds()) * 1000))
    )
  }

  updateTime() {
    this.setState({
      currentTime: new Date()
    });
  }

  updateTime2() {

    if (new Date().getSeconds() === 0) {
      clearInterval(this.secondsInterval)
    }
    this.setState({
      currentTime: new Date()
    });
  }

  setUnit = (event) => {

    let currentUnit
    let setTemp

    let listOfCities = [...this.state.listOfCities]

    if (event.target.innerText === "Farenheit") {
      currentUnit = "F"

      if (this.state.unit === "C") {
        setTemp = (this.state.temp * 9 / 5) + 32

        listOfCities = listOfCities.map((city) => {
          city.temp = (city.temp * 9 / 5) + 32
          return city

        })

      } else {
        setTemp = this.state.temp
      }

    } else {
      currentUnit = "C"
      if (this.state.unit === "F") {
        setTemp = (this.state.temp - 32) * 5 / 9
        listOfCities = listOfCities.map((city) => {
          city.temp = (city.temp - 32) * 5 / 9
          return city

        })
      } else {
        setTemp = this.state.temp
      }

    }

    this.setState({
      temp: setTemp,
      unit: currentUnit,
      listOfCities: listOfCities

    });
  }

  deleteCity = (cityIndex) => {
    if (cityIndex !== 0) {
      const cities = [...this.state.listOfCities];
      cities.splice(cityIndex, 1);
      this.setState({ listOfCities: cities });
    }
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
    let listOfCities = [...this.state.listOfCities]
    let cityObj = {}
    let sun
    let gmtOffset

    if (/\d/.test(cityOrZipValue)) {
      typeOfQuery = 'zip'
    }
    let country = document.getElementById("country").value

    if (country.toLowerCase() === "united states") {
      country = 'us'
    }

    if (this.state.unit === "F") {
      unit = 'imperial'
      setUnit = "F"
    } else {
      unit = 'metric'
      setUnit = "C"
    }

    let apiKey = process.env.REACT_APP_API_KEY
    let timeZoneAPIkey = process.env.REACT_APP_TIMEZONE_API_KEY

    fetch(`http://api.openweathermap.org/data/2.5/weather?${typeOfQuery}=${cityOrZipValue},${country}&APPID=${apiKey}&units=${unit}`)
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {


        if (myJson.main !== undefined) {
          const currentTemp = myJson.main.temp
          city = myJson.name
          humidity = myJson.main.humidity
          pressure = (myJson.main.pressure / 33.863886666667).toFixed(2)

          cityObj = {
            name: city,
            temp: currentTemp,
            cityId: myJson.id
          }

          fetch(`https://api.timezonedb.com/v2.1/get-time-zone?key=${timeZoneAPIkey}&format=json&by=position&lat=${myJson.coord.lat}&lng=${myJson.coord.lon}`)
            .then(function (response) {
              sun = myJson.sys.sunrise

              console.log(response)
              console.log("timezone")
              return response.json();
            })
            .then(function (myJson) {
              var t = new Date(sun * 1000);
              gmtOffset = myJson.gmtOffset
              gmtOffset /= 3600
              console.log(t)
              let hour = ('0' + t.getUTCHours()).slice(-2)
              hour = parseInt(hour)
              hour += gmtOffset
              console.log(`The GMTOFFSET is ${gmtOffset}`)
              that.setState({
                gmtOffset: gmtOffset
              });

              var formatted = hour + ':' + ('0' + t.getUTCMinutes()).slice(-2);
              console.log(formatted)
            })

          let cityAlreadyListed = false

          for (let i = 0; i < listOfCities.length; i++) {
            console.log(`cityId just search is ${myJson.id}`)
            console.log("blahBlah")
            console.log(listOfCities[i].cityId)
            if (listOfCities[i].cityId === myJson.id) {
              cityAlreadyListed = true
              break
            }
          }

          if (cityAlreadyListed === false) {
            listOfCities.push(cityObj)
          }

          that.setState({
            temp: currentTemp,
            unit: setUnit,
            city: city,
            humidity: humidity,
            sunrise: myJson.sys.sunrise,
            sunset: myJson.sys.sunset,
            windspeed: myJson.wind.speed,
            windDirection: myJson.wind.deg,
            pressure: pressure,
            listOfCities: listOfCities
          });
        }
      })





  }

  render() {

    var sunriseUTC = new Date(this.state.sunrise * 1000);
    let sunriseHour = ('0' + sunriseUTC.getUTCHours()).slice(-2)
    sunriseHour = parseInt(sunriseHour)
    sunriseHour += this.state.gmtOffset

    let newSunriseAMorPM = "AM"
    if (sunriseHour > 11) {
      newSunriseAMorPM = "PM"
      sunriseHour -= 12
    }
    var formattedSunrise = sunriseHour + ':' + ('0' + sunriseUTC.getUTCMinutes()).slice(-2);

    

    var sunsetUTC = new Date(this.state.sunset * 1000);
    let sunsetHour = ('0' + sunsetUTC.getUTCHours()).slice(-2)
    sunsetHour = parseInt(sunsetHour)
    sunsetHour += this.state.gmtOffset
    let newSunsetAMorPM = "PM"
    if (sunsetHour < 12) {
      newSunsetAMorPM = "AM"
    } else {
      sunsetHour -= 12
    }
      
    var formattedSunset = sunsetHour + ':' + ('0' + sunsetUTC.getUTCMinutes()).slice(-2);

    
   

    let temp = null



    // let sunsetUnix = new Date(this.state.sunset * 1000)
    // let sunsetHour = sunsetUnix.getHours()
    // let sunsetMinutes = sunsetUnix.getMinutes()
    // sunsetMinutes = ("0" + sunsetMinutes).slice(-2);
    // let sunsetAMorPM = "PM"

    let windDirection

    let windDegrees = this.state.windDirection

    if (windDegrees > 348.75 || windDegrees <= 11.25) {
      windDirection = "E"
    } else if (windDegrees > 11.25 || windDegrees <= 33.75) {
      windDirection = "NNE"
    } else if (windDegrees > 33.75 || windDegrees <= 56.25) {
      windDirection = "NE"
    } else if (windDegrees > 56.25 || windDegrees <= 78.75) {
      windDirection = "ENE"
    } else if (windDegrees > 78.75 || windDegrees <= 101.25) {
      windDirection = "E"
    } else if (windDegrees > 101.25 || windDegrees <= 123.75) {
      windDirection = "ESE"
    } else if (windDegrees > 123.75 || windDegrees <= 146.25) {
      windDirection = "SE"
    } else if (windDegrees > 146.25 || windDegrees <= 168.75) {
      windDirection = "SSE"
    } else if (windDegrees > 168.75 || windDegrees <= 191.25) {
      windDirection = "S"
    } else if (windDegrees > 191.25 || windDegrees <= 213.75) {
      windDirection = "SSW"
    } else if (windDegrees > 213.75 || windDegrees <= 236.25) {
      windDirection = "SW"
    } else if (windDegrees > 236.25 || windDegrees <= 258.75) {
      windDirection = "WSW"
    } else if (windDegrees > 258.75 || windDegrees <= 281.25) {
      windDirection = "W"
    } else if (windDegrees > 281.25 || windDegrees <= 303.75) {
      windDirection = "WNW"
    } else if (windDegrees > 303.75 || windDegrees <= 326.25) {
      windDirection = "NW"
    } else {
      windDirection = "NNW"
    }

    // if (sunsetHour < 12) {
    //   sunsetAMorPM = "PM"
    // } else {
    //   sunsetHour -= 12
    // }

    if (this.state.temp) {

      temp = (
        <div>
          <Weather temp={Math.round(this.state.temp)} unit={this.state.unit} city={this.state.city} humidity={this.state.humidity}
            sunrise={`${formattedSunrise} ${newSunriseAMorPM}`}
            sunset={`${formattedSunset} ${newSunsetAMorPM}`}
            windspeed={Math.round(this.state.windspeed)}
            windDirection={windDirection}
            pressure={this.state.pressure}
            time={this.state.currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          />
        </div>
      )
    }

    let cities = (
      <div>

        {this.state.listOfCities.map((city, index) => {
          return <City
            city={city.name}
            temp={Math.round(city.temp)}
            unit={this.state.unit}
            key={index}
            click={() => this.deleteCity(index)}
          />
        })}
      </div>
    );

    return (
      <div className="App">

        <Unit
          click={this.setUnit}
        />
        <Form
          click={this.fetchWeather}
        />
        {temp}
        {cities}
      </div>
    );
  }
}

export default App;
