import React, { Component } from "react";
import ReactDOM from 'react-dom';
import './Weather.js'
import { SearchBox } from './Search';
import TDMarketData from './TDMarketData'
import Unsplash from './Unsplash.js'
import { NewsBox, SchoolBox, WorkBox, FinanceBox,
         SocialBox, RBox, HomeBox, DevBox, ImgBox, VidBox} from './Bookmarks.js'
import { Clock } from './Clock'

class WeatherBox extends React.Component {
  render() {
    return (
        <div class="block">
            <div class="image-container">
                <img src="./img/snow.jpg"/>   
                    <div id="weather">
                    <h1 id="temp"></h1>
                    <h3 id="location"></h3>
                </div>
            </div>
        </div>
    );
  }
}
ReactDOM.render(<WeatherBox />, document.getElementById("box1"));
ReactDOM.render(<NewsBox />, document.getElementById('box2'));
ReactDOM.render(<SchoolBox />, document.getElementById('box3'));
ReactDOM.render(<SearchBox />, document.getElementById('long-box1'));
ReactDOM.render(<WorkBox />, document.getElementById('box4'));
ReactDOM.render(<TDMarketData />, document.getElementById('square-box1'));
ReactDOM.render(<FinanceBox />, document.getElementById('box5'));
ReactDOM.render(<SocialBox />, document.getElementById('box6'));
ReactDOM.render(<RBox />, document.getElementById('box7'));
ReactDOM.render(<HomeBox />, document.getElementById('box8'));
ReactDOM.render(<DevBox />, document.getElementById('box9'));
ReactDOM.render(<Unsplash />, document.getElementById('box10'));
ReactDOM.render(<Unsplash />, document.getElementById('box11'));
ReactDOM.render(<Unsplash />, document.getElementById('box12'));
ReactDOM.render(<Unsplash />, document.getElementById('box13'));
ReactDOM.render(<Unsplash />, document.getElementById('box14'));
ReactDOM.render(<Unsplash />, document.getElementById('box15'));
ReactDOM.render(<Clock />, document.getElementById('box16'));