import React, {useState, useEffect} from "react";
import { 
  WiRain, WiSprinkle, WiCloudy, WiThunderstorm, WiStars, WiDaySunny,
  WiSnowflakeCold, WiAlien, WiFog, WiRaindrops, WiDust, WiDayHaze,
  WiTornado, WiNightClear, WiDayCloudy, WiNightCloudy, WiCloud, WiMoonWaxingCrescent3
} from "react-icons/wi";

const key = import.meta.env.VITE_OPEN_WEATHER_MAP_API_KEY;
const zip = import.meta.env.VITE_OPEN_WEATHER_MAP_ZIP_CODE;

if (key==='') document.getElementById('temp').innerHTML = ('Remember to add your api key!');

class WeatherBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      temperature: this.props.temperature,
      location: this.props.location,
      icon: this.props.icon,
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
    var fahrenheit = Math.round(((parseFloat(data.main.temp) - 273.15) * 1.8) + 32);
    this.setState({ location: data.name})

    let weather = [
      { weather: 'Clear', icon_day: <WiDaySunny />, icon_night: <WiMoonWaxingCrescent3 /> },
      { weather: 'Clouds', icon_few_day: <WiDayCloudy />, icon_few_night: <WiNightCloudy />,
                           icon_scatter_day: <WiDayCloudy />, icon_scatter_night: <WiNightCloudy />,
                           icon_broken: <WiCloud />, icon_overcast: <WiCloudy />, icon: <WiCloud />},
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
    weather.forEach(element => {
      if (data.weather[0].main === 'Clear') {
          icon = this.isDay() ? element.icon_day : element.icon_night
      } 
      else if (data.weather[0].main === element.weather) {
          icon = element.icon;
      }
    });
    this.setState({ temperature: fahrenheit + '\xB0 ', icon: icon})
  }
  
  isDay() {
    return ((new Date()).getHours() >= 6 && (new Date()).getHours() < 18);
  }

  componentDidMount() {
    this.fetchData();
    console.log(this.state.icon)
  }

	render() {
    return (
      <>
      <div class="text-center items-center justify-center translate-x-0 translate-y-0">
        <h1 class="text-3xl pt-5 text-off-white1">{this.state.temperature}</h1>
        <p class="flex justify-center text-5xl text-off-white1">{this.state.icon}</p>
        <p class="text-xl text-off-white1">{this.state.location}</p>
      </div>
      </>
    );
  }
}

export default WeatherBox