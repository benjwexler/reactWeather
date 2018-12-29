import React, { Component } from 'react';
import './App.css';
import './City/City.css';
import './Unit/Unit.css';
import './Form/Form.css';
import './Forecast/Forecast.css';
import Form from './Form/Form.js';
import Weather from './Weather/Weather.js';
import Unit from './Unit/Unit.js';
import City from './City/City.js';
import Forecast from './Forecast/Forecast.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

import { library } from '@fortawesome/fontawesome-svg-core'
import { windDirectionFunc, getDayofWeek  } from './Functions.js';


library.add(faSearch)

class App extends Component {

  constructor(props) {
    super(props)
    this.xAxisLocation = null
    this.yAxisLocation = null
  }

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
    listOfCities: [],
    showSearchScreen: false,
    displayCity: undefined,
    showForecast: false,
    displayCityCurrentTemp: undefined,
    displayCityMaxTemp: undefined,
    displayCityMinTemp: undefined
  }

  currentTemp = (lat, lon) => {
    let apiKey = process.env.REACT_APP_API_KEY
    let timeZoneAPIkey = process.env.REACT_APP_TIMEZONE_API_KEY
    let that = this
    let gmtOffset
    let listOfCities
    let city

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${apiKey}&units=imperial`)
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        listOfCities = [...that.state.listOfCities]
        city = {
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
            return response.json();
          })
          .then(function (myJson) {
            gmtOffset = myJson.gmtOffset
            gmtOffset /= 3600
            city.gmtOffset = gmtOffset
          })
      })

  }

  secondsInterval = setInterval(
    () => this.updateTime2(),
    1000)

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
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

  // setUnit = setUnit

  setUnit = (event) => {

    let currentUnit
    let setTemp

    let listOfCities = [...this.state.listOfCities]

    if (event.target.innerText === "°F") {
      currentUnit = "F"

      if (this.state.unit === "C") {
        setTemp = (this.state.temp * 9 / 5) + 32

        listOfCities = listOfCities.map((city) => {
          city.temp = (city.temp * 9 / 5) + 32
          city.minTemp = (city.minTemp * 9 / 5) + 32
          city.maxTemp = (city.maxTemp * 9 / 5) + 32
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
          city.minTemp = (city.minTemp - 32) * 5 / 9
          city.maxTemp = (city.maxTemp - 32) * 5 / 9
          return city

        })
      } else {
        setTemp = this.state.temp
      }

    }

    this.setState({
      listOfCities: listOfCities,
      unit: currentUnit,

    });
  }

  deleteCity = (cityIndex) => {
    if (cityIndex !== 0) {
      const cities = [...this.state.listOfCities];
      cities.splice(cityIndex, 1);
      this.setState({ listOfCities: cities });
    }
  }



  unify(e) { return e.changedTouches ? e.changedTouches[0] : e };

  lockY = (e) => {
    document.body.style.transition = "transform 0s";
    let unify = e.changedTouches ? e.changedTouches[0] : e
    this.yAxisLocation = unify.clientY
  }

  lock = (whichCity, e) => {
    let unify = e.changedTouches ? e.changedTouches[0] : e

    document.body.style.position = "fixed"

    this.xAxisLocation = unify.clientX

    document.getElementById(`city${whichCity}`).style.transform = "translate(0px)";
    document.body.style.overflow = "hidden"

  }

  moveY = (e) => {

    if (this.yAxisLocation || this.yAxisLocation === 0) {
      let unify = e.changedTouches ? e.changedTouches[0] : e
      let dy = unify.clientY - this.yAxisLocation, s = Math.sign(dy);
      this.yAxisLocation = null
    }


    document.body.style.transition = "transform .5s";
    document.body.style.transform = `translateY(0px)`

  }

  move = (whichCity, e) => {
    // document.querySelector('.App').style.position = "static"

    // document.querySelector('.App').style.overflow = "visible"
   

    let that = this

    let newListOfCities = this.state.listOfCities

    if (this.xAxisLocation || this.xAxisLocation === 0) {
      let unify = e.changedTouches ? e.changedTouches[0] : e
      let dx = unify.clientX - this.xAxisLocation, s = Math.sign(dx);

      let dragAmount = document.getElementById(`city${whichCity}`).style.transform;
      dragAmount = dragAmount.match(/\d+/g)[0]
      if (dragAmount < 80) {
        document.getElementById(`city${whichCity}`).style.transform = "translateX(0px)";
        //below function will trigger the screen to show a city's forecast
        if(dragAmount == 0) {
          this.displayCity(whichCity)
        }
        newListOfCities.forEach(function (city) {
          if (city.name === newListOfCities[whichCity].name) {
            city.deleteBtnDisplayed = false

          }
        });

      } else {


        newListOfCities.forEach(function (city) {
          if (city.name === newListOfCities[whichCity].name) {
            city.deleteBtnDisplayed = true
          }
        });
      }

      this.setState({
        listOfCities: newListOfCities
      },
      )
      this.xAxisLocation = null
    }
    
  }

  preventScroll = (whichCity, e) => {
    e.preventDefault();
  }

  dragY = (e) => {

    if (!this.xAxisLocation) {
      if (this.yAxisLocation || this.yAxisLocation === 0) {
        let unify = e.changedTouches ? e.changedTouches[0] : e
        let amount = Math.round(unify.clientY - this.yAxisLocation)

        if (this.state.showForecast === false) {

        document.body.style.transform = `translateY(${amount}px)`
        }
      }
    }
  }

  drag = (whichCity, e) => {
    // e.preventDefault();
    let newListOfCities

    // This isn't exactly working, but the idea is that user can only scroll if they aren't trying to swipe sideways
    if (this.xAxisLocation !== 0) {
      document.body.style.overflow = "hidden"
    }

    if (this.xAxisLocation || this.xAxisLocation === 0) {
      let unify = e.changedTouches ? e.changedTouches[0] : e
      let amount = Math.round(unify.clientX - this.xAxisLocation)


      // this ensures that the delete button is either fully shown or not shown at all (and it prevents from swiping indefintly)
      if (amount <= -80) {
        amount = -80




      }
      if (amount >= 0) {
        amount = 0
      }
      document.getElementById(`city${whichCity}`).style.transform = `translate(${amount}px)`
    }
  };

  displayCity = (cityIndex) => {
// Will only navigate to the showforecast screen is the delete button for the respective city isn't showing
    if (this.state.listOfCities[cityIndex].deleteBtnDisplayed) {
    } else {
      this.setState({
        showForecast: true,
        displayCity: this.state.listOfCities[cityIndex].name,
        displayCityCurrentTemp: this.state.listOfCities[cityIndex].temp,
        displayCityMaxTemp: this.state.listOfCities[cityIndex].maxTemp,
        displayCityMinTemp: this.state.listOfCities[cityIndex].minTemp,
      })
    }

  }

  updateCity = (cityObj) => {

    let newNonsense = this.state.nonsense
    newNonsense++

    let that = this

    let unit
    let setUnit
    let listOfCities = [...this.state.listOfCities]
    let apiKey = process.env.REACT_APP_API_KEY
    let cityId = cityObj.cityId

    if (this.state.unit === "F") {
      unit = 'imperial'
      setUnit = "F"
    } else {
      unit = 'metric'
      setUnit = "C"
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?id=${cityId}&APPID=${apiKey}&units=${unit}`)
      .then(function (response) {
        return response.json();
      }).then(function (myJson) {


        if (myJson.main !== undefined) {
          const currentTemp = myJson.main.temp
         

          for (let i = 0; i < listOfCities.length; i++) {

            if (listOfCities[i].cityId === cityId) {
              listOfCities[i].temp = currentTemp
              break
            }
          }

          that.setState({
            listOfCities: listOfCities,
            nonsense: newNonsense

          });


        }

      })

  }

  backToList = () => {
    this.setState({
      showForecast: false
    })
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
    let showSearchScreen = this.state.showSearchScreen

    fetch(`https://api.openweathermap.org/data/2.5/weather?${typeOfQuery}=${cityOrZipValue},${country}&APPID=${apiKey}&units=${unit}`)
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {

        console.log(myJson)


        if (myJson.main !== undefined) {
          showSearchScreen = !showSearchScreen

          const currentTemp = myJson.main.temp
          city = myJson.name
          humidity = myJson.main.humidity
          pressure = (myJson.main.pressure / 33.863886666667).toFixed(2)

          // cityObj = {
          //   name: city,
          //   temp: currentTemp,
          //   cityId: myJson.id
          // }

          fetch(`https://api.timezonedb.com/v2.1/get-time-zone?key=${timeZoneAPIkey}&format=json&by=position&lat=${myJson.coord.lat}&lng=${myJson.coord.lon}`)
            .then(function (response) {
              sun = myJson.sys.sunrise
              return response.json();
            })
            .then(function (myJson) {
              var t = new Date(sun * 1000);
              gmtOffset = myJson.gmtOffset
              gmtOffset /= 3600
              let hour = ('0' + t.getUTCHours()).slice(-2)
              hour = parseInt(hour)
              hour += gmtOffset
              cityObj.gmtOffset = gmtOffset
              that.setState({
                gmtOffset: gmtOffset
              });

              var formatted = hour + ':' + ('0' + t.getUTCMinutes()).slice(-2);
            })

          let cityAlreadyListed = false


          cityObj.name = city
          cityObj.temp = currentTemp
          cityObj.maxTemp = myJson.main.temp_max
          cityObj.minTemp = myJson.main.temp_min
          cityObj.cityId = myJson.id
          cityObj.sunrise = myJson.sys.sunrise
          cityObj.sunset = myJson.sys.sunset
          cityObj.windspeed = myJson.wind.speed
          cityObj.windDirection = myJson.wind.deg
          cityObj.pressure = pressure
          cityObj.deleteBtnDisplayed = false

          for (let i = 0; i < listOfCities.length; i++) {
            if (listOfCities[i].cityId === myJson.id) {
              cityAlreadyListed = true
              break
            }
          }

          if (cityAlreadyListed === false) {
            listOfCities.push(cityObj)
          }

          setInterval(
            () => that.updateCity(cityObj),
            60000)

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
            listOfCities: listOfCities,
            showSearchScreen: showSearchScreen
          });


        }
      })





  }

  showLocalTime = (time) => {
    var localUTC = new Date(this.state.currentTime);
    let localHour = ('0' + localUTC.getUTCHours()).slice(-2)
    localHour = parseInt(localHour)
    localHour += time
    let localAMorPM = "AM"
    if (localHour < 0) {
      localHour = 12 + localHour
      localAMorPM = "PM"
    }
    else if (localHour > 11) {
      localAMorPM = "PM"
      localHour -= 12



    }

    if (localHour === 0) {
      localHour = 12
    }


    var formattedlocalTime = localHour + ':' + ('0' + localUTC.getUTCMinutes()).slice(-2) + localAMorPM;

    return formattedlocalTime

  }

  clearInput = () => {

    if (document.getElementById('city')) {
      document.getElementById('city').value = ""
      document.getElementById('country').value = ""
    }

  }

  clicker = () => {

    this.setState({
      showSearchScreen: !this.state.showSearchScreen
    });
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
    let windDirection
    let windDegrees = this.state.windDirection

    windDirection = windDirectionFunc(windDegrees)

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
            id={index}
            deleteCity={() => this.deleteCity(index)}
            time={this.showLocalTime(city.gmtOffset)}
            lock={(e) => this.lock(index, e)}
            move={(e) => this.move(index, e)}
            drag={(e) => this.drag(index, e)}
            preventScroll={(e) => this.preventScroll(index, e)}


          />
        })}
      </div>
    );

    let showOrHide
    if (this.state.showSearchScreen === true) {
      showOrHide = "showScreen"

    } else {
      if (document.getElementById('city')) {
        document.getElementById('city').value = ""
        document.getElementById('country').value = ""
      }
      showOrHide = "hideScreen"
    }






    let searchScreen = (


      <div className={showOrHide} >
        <Form
          click={this.fetchWeather}
          hideSearchScreen={() => this.clicker()}
          clearInput={() => this.clearInput()}
          fontAwesome={faPlus}
        />



      </div>



    )

    let everything

    if(this.state.showForecast === false) {

    everything = (

      <div>

        <div className="cityListContainer">
          {cities}
        </div>
        <div className="plusBtn" onClick={() => this.clicker()} >
          <FontAwesomeIcon

            icon={faPlus} />
        </div>

        <Unit
          click={this.setUnit}
          currentUnit={this.state.unit}
        />

        {searchScreen}



        {temp}




      </div>

    )
  } else {
    everything = (
      <Forecast
        backToList = {() => this.backToList()}
        
        displayCity = {this.state.displayCity}
        displayCityCurrentTemp = {Math.round(this.state.displayCityCurrentTemp)}
        displayCityMaxTemp = {Math.round(this.state.displayCityMaxTemp)}
        displayCityMinTemp = {Math.round(this.state.displayCityMinTemp)}
      />
    
    
    )
  }

    return (
      <div className="App"
        onMouseDown={(e) => this.lockY(e)}
        onTouchStart={(e) => this.lockY(e)}
        onMouseUp={(e) => this.moveY(e)}
        onTouchEnd={(e) => this.moveY(e)}
        onMouseMove={(e) => this.dragY(e)}
        onTouchMove={(e) => this.dragY(e)}
      >
        {everything}
      </div>
    );
  }
}

export default App;
