import React, { Component } from "react";
import ReactDOM from 'react-dom';
import './Weather.js'
import { sendSearch } from './Search';
import { displayClock } from './Clock';
import TDMarketData from './TDMarketData'
import { NewsBox, SchoolBox, WorkBox, FinanceBox,
         SocialBox, RBox, HomeBox, DevBox, ImgBox } from './Bookmarks.js'
import Chart from "react-apexcharts";
import axios from "axios";

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
 

class SearchBox extends Component {

    constructor(props) {
        super(props);
        this.state = { disabled: "1" };
    }

    buttonToggle(e) {
      //should dictate the toggle logic
      const id = e.target.id
      this.setState({ disabled: id })
    }
    render() {
        return (
        <div class="block">
            <div class="search">
                <div class="engine-buttons" onClick={this.buttonToggle.bind(this)}>
                    <button id='search-button' disabled={this.state.disabled === "1"} id="1"
                            engine='google' address='http://www.google.com/search?q=' ><img/></button>
                    <button id='search-button' disabled={this.state.disabled === "2"} id="2"
                            engine='duckduckgo' address='https://www.duckduckgo.com/?q=' ><img/></button>
                    <button id='search-button' disabled={this.state.disabled === "3"} id="3"
                            engine='wolfram' address='https://www.wolframalpha.com/input/?i='><img/></button>
                </div>
                <input autoFocus id='search-input' type='text' onKeyPress={sendSearch}/>
            </div>
        </div>
        )};
    };
ReactDOM.render(<SearchBox />, document.getElementById('long-box1'));
ReactDOM.render(<WorkBox />, document.getElementById('box4'));
ReactDOM.render(<TDMarketData />, document.getElementById('square-box1'));
ReactDOM.render(<FinanceBox />, document.getElementById('box5'));
ReactDOM.render(<SocialBox />, document.getElementById('box6'));
ReactDOM.render(<RBox />, document.getElementById('box7'));
ReactDOM.render(<HomeBox />, document.getElementById('box8'));
ReactDOM.render(<DevBox />, document.getElementById('box9'));
ReactDOM.render(<ImgBox />, document.getElementById('box10'));
ReactDOM.render(<ImgBox />, document.getElementById('box11'));
ReactDOM.render(<ImgBox />, document.getElementById('box12'));
ReactDOM.render(<ImgBox />, document.getElementById('box13'));
ReactDOM.render(<ImgBox />, document.getElementById('box14'));
ReactDOM.render(<ImgBox />, document.getElementById('box15'));