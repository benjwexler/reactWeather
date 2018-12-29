export const setUnit = (event, ) => {

    let currentUnit
    let setTemp

    let listOfCities = [...this.state.listOfCities]

    if (event.target.innerText === "°F") {
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
      listOfCities: listOfCities,
      unit: currentUnit,

    });
  }

export const getDayofWeek = (gmtOffset) => {
    let gmtMilliseconds = (gmtOffset * 3600000)
    let currentTime = new Date 

    currentTime = currentTime.getTime()

    let localDay = (gmtMilliseconds * currentTime).getDay()

    let daysOfWeekObj=  {
      0: "Sunday",
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday"
    }

    return daysOfWeekObj[localDay]
}


export const windDirectionFunc = (windDegrees) => {
let windDirection
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

  return windDirection
}

 
