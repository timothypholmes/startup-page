import React, {useState, useEffect} from "react";
import { 
  WiRain, WiSprinkle, WiCloudy, WiThunderstorm, WiStars, WiDaySunny,
  WiSnowflakeCold, WiAlien, WiFog, WiRaindrops, WiDust, WiDayHaze,
  WiTornado, WiNightClear, WiDayCloudy, WiNightCloudy, WiCloud, WiMoonWaxingCrescent3
} from "react-icons/wi";

const key = import.meta.env.VITE_OPEN_WEATHER_MAP_API_KEY;
const unit = import.meta.env.VITE_OPEN_WEATHER_MAP_UNIT;

if (key==='') document.getElementById('temp').innerHTML = ('Remember to add your api key!');

class WeatherBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      temperature: this.props.temperature,
      location: this.props.location,
      icon: this.props.icon,
      desc: this.props.desc,
    }
  }

  fetchData(lat, lon) {
    return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=${unit}`)
      .then(response => response.json())
      .then(data => {
        this.getWeather(data)
    });
  }

  getWeather(data) {
    this.setState({ location: data.name})

    let weather = [
      { weather: 'Clear', icon_day: <WiDaySunny />, icon_night: <WiMoonWaxingCrescent3 /> },
      { weather: 'Clouds', icon_few_day: <WiDayCloudy />, icon_few_night: <WiNightCloudy />,
                           icon_scatter_day: <WiDayCloudy />, icon_scatter_night: <WiNightCloudy />,
                           icon_broken: <WiCloud />, icon_overcast: <WiCloudy /> },
      { weather: 'Drizzle', icon: <WiSprinkle /> },
      { weather: 'Rain', icon: <WiRain /> },
      { weather: 'Thunderstorm', icon: <WiThunderstorm /> },
      { weather: 'Snow', icon: <WiSnowflakeCold /> },
      { weather: 'Fog', icon: <WiFog /> },
      { weather: 'Mist', icon: <WiRaindrops /> },
      { weather: 'Haze', icon: <WiDayHaze /> },
      { weather: 'Tornado', icon: <WiTornado /> },
      { weather: 'Dust', icon: <WiDust /> }
    ]

    let icon = '';
    let weatherIcon = weather.find(element => element.weather === data.weather[0].main);
    
    if (weatherIcon.weather === 'Clear') {
      icon = this.isDay() ? weatherIcon.icon_day : weatherIcon.icon_night
    }
    else if (weatherIcon.weather === 'Clouds') {
      if (data.weather[0].id === 801) {
        icon = this.isDay() ? weatherIcon.icon_few_day : weatherIcon.icon_few_night
      }
      else if (data.weather[0].id === 802) {
        icon = this.isDay() ? weatherIcon.icon_scatter_day : weatherIcon.icon_scatter_night
      }
      else if (data.weather[0].id === 803) {
        icon = weatherIcon.icon_broken
      }
      else if (data.weather[0].id === 804) {
        icon = weatherIcon.icon_overcast
      }
    }
    else {
      icon = weatherIcon.icon
    }

    if (! import.meta.env.VITE_OPEN_WEATHER_MAP_UNIT) { 
      if (data.sys.country === "US") {
        var temperature = String(Math.round(data.main.temp * 9 / 5 - 459.67)) + '\xB0 F'
      }
      else {
        var temperature = String(Math.round(data.main.temp - 273.15)) + '\xB0 C'
      }
    }
    this.setState({ temperature: temperature, icon: icon, desc: data.main.description})
  }
  
  isDay() {
    return ((new Date()).getHours() >= 6 && (new Date()).getHours() < 18);
  }

  componentDidMount() {
    if (import.meta.env.VITE_LAT) {
      this.fetchData(import.meta.env.VITE_LAT, import.meta.env.VITE_LON);
    } else if(navigator.geolocation) { // get location
      navigator.geolocation.getCurrentPosition((position) => {
          this.fetchData(position.coords.latitude, position.coords.longitude);
      });
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }

	render() {
    return (
      <>
      <div class="text-center items-center justify-center translate-x-0 translate-y-0">
        <h1 title={this.state.desc} class="text-3xl pt-5 text-off-white1">{this.state.temperature}</h1>
        <a class="flex justify-center text-5xl text-off-white1">
          <span class="text-grey group-hover:text-blue-500">{this.state.icon}</span>
        </a>
        <p class="text-xl text-off-white1">{this.state.location}</p>
      </div>
      </>
    );
  }
}

export default WeatherBox