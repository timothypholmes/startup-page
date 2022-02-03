import React, {useState, useEffect} from "react";

const key = process.env.REACT_APP_OPEN_WEATHER_MAP_API_KEY;
const zip = process.env.REACT_APP_OPEN_WEATHER_MAP_ZIP_CODE;

if (key==='') document.getElementById('temp').innerHTML = ('Remember to add your api key!');

class WeatherBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      temperature: this.props.temperature,
      location: this.props.location
    }
  }

  fetchData() {
    return fetch('https://api.openweathermap.org/data/2.5/weather?zip=' + zip + ',us&appid=' + key)  
      .then(response => response.json())
      .then(data => {
        this.getWeather(data)
    });
  }

  getWeather(data) {
    var fahrenheit = Math.round(((parseFloat(data.main.temp)-273.15)*1.8)+32);
    this.setState({ location: data.name})
    
    if        ( data.weather[0].main === 'Clear' && this.isDay() === true) {
      this.setState({ temperature: fahrenheit + '\xB0' + ' ☀️'})
    } else if ( data.weather[0].main === 'Clear' && this.isDay() === false) {
      this.setState({ temperature: fahrenheit + '\xB0' + ' 🌔'})
    } else if ( data.weather[0].main === 'Clouds' ) {
      this.setState({ temperature: fahrenheit + '\xB0' + ' ☁️'})
    } else if ( data.weather[0].main === 'Drizzle' ) {
      this.setState({ temperature: fahrenheit + '\xB0' + ' 🌦️'})
    } else if ( data.weather[0].main === 'Rain' ) {
      this.setState({ temperature: fahrenheit + '\xB0' + ' 🌧️'})
    } else if ( data.weather[0].main === 'Thunderstorm' ) {
      this.setState({ temperature: fahrenheit + '\xB0' + ' ⛈️'})
    } else if ( data.weather[0].main === 'Snow' ) {
      this.setState({ temperature: fahrenheit + '\xB0' + ' ❄️'})
    } else if ( data.weather[0].main === 'Fog' ) {
      this.setState({ temperature: fahrenheit + '\xB0' + ' 🌫️'})
    } else if ( data.weather[0].main === 'Mist' ) {
      this.setState({ temperature: fahrenheit + '\xB0' + ' 🌫️'})
    } else if ( data.weather[0].main === 'Haze' ) {
      this.setState({ temperature: fahrenheit + '\xB0' + ' 🌫️'})
    } else if ( data.weather[0].main === 'Tornado' ) {
      this.setState({ temperature: fahrenheit + '\xB0' + ' 🌫️'})
    } else if ( data.weather[0].main === 'Dust' ) {
      this.setState({ temperature: (fahrenheit + '\xB0' + ' 🌫️')})
    } else {
      this.setState({ temperature: fahrenheit + '\xB0'})
    }
  }

  isDay() {
    return ((new Date()).getHours() >= 6 && (new Date()).getHours() < 18);
  }

  componentDidMount() {
    this.fetchData();
  }

	render() {
    return (
      <>
      <div class="text-center align-middle translate-x-0 translate-y-0">
        <h1 class="text-3xl m-5 text-off-white1">{this.state.temperature}</h1>
        <p class="text-xl text-off-white1">{this.state.location}</p>
      </div>
      </>
    );
  }
}

export default WeatherBox