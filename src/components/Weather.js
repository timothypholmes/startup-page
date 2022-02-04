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

    let weather = [
      { weather: 'Clear', icon_day: '☀️', icon_night: '🌔' },
      { weather: 'Clouds', icon: '☁️' },
      { weather: 'Drizzle', icon: '🌦️' },
      { weather: 'Rain', icon: '🌧️' },
      { weather: 'Thunderstorm', icon: '⛈️' },
      { weather: 'Snow', icon: '❄️' },
      { weather: 'Fog', icon: '🌫️' },
      { weather: 'Mist', icon: '🌫️' },
      { weather: 'Haze', icon: '🌫️' },
      { weather: 'Tornado', icon: '🌫️' },
      { weather: 'Dust', icon: '🌫️' }
    ]
  
    let icon = '';
    weather.forEach(element => {
      if (data.weather[0].main === 'Clear') {
          icon = this.isDay() ? element.icon_day : element.icon_night
      } else if (data.weather[0].main === element.weather) {
          icon = element.icon;
      }
    });
    this.setState({ temperature: fahrenheit + '\xB0 ' + icon})
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