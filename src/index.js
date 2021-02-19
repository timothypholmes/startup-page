import React, { Component } from "react";
import ReactDOM from 'react-dom';
import './Weather.js'
import { sendSearch } from './Search';


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


function NewsBox() {
    return (
        <div class="block">
            <ul>
                <li>news</li>
                <li><a href="https://news.ycombinator.com/">hacker news</a></li>
                <li><a href="https://medium.com">medium</a></li>
            </ul>
        </div>
      );
    };
ReactDOM.render(<NewsBox />, document.getElementById('box2'));


function SchoolBox() {
    return (
        <div class="block">
        <ul>
            <li>school</li>
            <li><a href="https://www.overleaf.com">$\LaTeX$</a></li>
            <li><a href="https://sts.is.depaul.edu/adfs/ls/?SAMLRequest=jdE9a8MwEAbgvdD%2fYLRbkhV%2fRMIOhHYJpEvSduhSJPmSGGzJ1cmlP792Q2jHbvfBCw939XaKF3eAjwkwJrvHhqAe%2bnDt340sSlOtcymNznXVmqLSpoBCWiOtzNckeYWAnXcNEZSTZIc4wc5h1C7OIy54yqtUlM%2fZWvGVyjIqJC9WRfZGki0ihDhnH7zDaYBwhPDZWXg57BtyiXFExVgretrCqKeeQjstLetHpmcz6%2f25c2zR7peKzjuSfA29w4ZMwSmvsUPl9ACoolXH7dNezUg1Bh%2b99T3Z3N8lSf1DDv8J6huYbG48vZLATxpSaXOR5jnXqclFlmZZyVtxqoq2BBrBzedAakJ3vkQctQVq%2ffBLr9kVMYNq9vcfm28%3d">d2l</a></li>
            <li><a href="http://campusconnect.depaul.edu">campus connect</a></li>
            <li><a href="https://www.wolframalpha.com">wolfram $\alpha$</a></li>
            <li><a href="https://d2l.depaul.edu/d2l/home/791293">phy 411</a></li>
        </ul>
    </div>
      );
    };
ReactDOM.render(<SchoolBox />, document.getElementById('box3'));
 

class SearchBox extends Component {

    constructor(props) {
        super(props);
        this.state = { disabled: "1" }
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
                            engine='google' address='https://www.google.com/?q=' ><img/></button>
                    <button id='search-button' disabled={this.state.disabled === "2"} id="2"
                            engine='duckduckgo' address='https://www.duckduckgo.com/?q=' ><img/></button>
                    <button id='search-button' disabled={this.state.disabled === "3"} id="3"
                            engine='wolfram' address='https://www.wolframalpha.com/input/?i='><img/></button>
                </div>
                <input  id='search-input' type='text' onKeyPress={sendSearch} autofocus/>
            </div>
        </div>
        )};
    };
ReactDOM.render(<SearchBox />, document.getElementById('long-box1'));


function WorkBox() {
    return (
        <div class="block">
        <ul>
            <li>work</li>
            <li><a href="https://stackoverflow.com">stackoverflow</a></li>
            <li><a href="https://github.com">github</a></li>
        </ul>
    </div>
      );
    };
ReactDOM.render(<WorkBox />, document.getElementById('box4'));


function FinanceBox() {
    return (
        <div class="block">
        <ul>
            <li>finance</li>
            <li><a href="https://secure.tdameritrade.com/">tdameritrade</a></li>
            <li><a href="https://secure.tdameritrade.com/trade/options">options</a></li>
            <li><a href="https://secure.tdameritrade.com/trade">stonks/etfs</a></li>
            <li><a href="https://robinhood.com">fuck robinhood</a></li>
            <li><a href="https://www.marketwatch.com">marketwatch</a></li>
        </ul>
    </div>
      );
    };
ReactDOM.render(<FinanceBox />, document.getElementById('box5'));


function SocialBox() {
    return (
        <div class="block">
        <ul>
            <li>social</li>
            <li><a href="https://www.reddit.com">reddit</a></li>
            <li><a href="https://www.youtube.com">youtube</a></li>
            <li><a href="https://www.linkedin.com">linkedin</a></li>
        </ul>
    </div>
      );
    };
ReactDOM.render(<SocialBox />, document.getElementById('box6'));


function RBox() {
    return (
        <div class="block">  
        <ul>
        <li>r/</li>
        <li><a href="https://www.reddit.com/r/startpages/">r/startpages</a></li>
        <li><a href="https://www.reddit.com/r/unixporn/">r/unixporn</a></li>
        <li><a href="https://www.reddit.com/r/stocks/">r/stonks</a></li>
        </ul>
    </div>
      );
    };
ReactDOM.render(<RBox />, document.getElementById('box7'));


function HomeBox() {
    return (
        <div class="block">  
        <ul>
        <li>home</li>
        <li><a href="http://10.0.0.182:8581/login">homebridge</a></li>
        <li><a href="https://pi-hole.net">pi-hole</a></li>
        </ul>
    </div>
      );
    };
ReactDOM.render(<HomeBox />, document.getElementById('box8'));


function DevBox() {
    return (
        <div class="block">  
        <ul>
            <li>dev</li>
            <li><a href="https://timothypholmes.github.io">personal website</a></li>
            <li><a href="http://localhost:8000">test site</a></li>
        </ul>
        </div>
      );
    };
ReactDOM.render(<DevBox />, document.getElementById('box9'));


function ImgBox() {
    return (
        <div class="block">
        <div class="image-container">
            <img src="./img/minimal.jpg" alt="A image" />
        </div>
    </div>
      );
    };
ReactDOM.render(<ImgBox />, document.getElementById('box10'));