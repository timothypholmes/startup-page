import React from "react";

function sendSearch(e) {
  const input = document.querySelector('.search-input');

  if (e.key === 'Enter') {

    var buttons = document.querySelectorAll('button');

    for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].disabled === true) {

          const address = buttons[i].getAttribute("address")
          const input = encodeURIComponent(document.getElementById('search-input').value)
          const url = `${address}${input}`;

          window.open(url);
          document.getElementById('search-input').value='';
        }
    }
  }
}

class SearchBox extends React.Component {

  constructor(props) {
      super(props);
      this.state = { 
        disabled: "1",
     };
  }

  buttonToggle(e) {
    //should dictate the toggle logic
    const id = e.target.id
    this.setState({ disabled: id })
    this.refs.input.value = '';
  }
  render() {
    return (
      <div class="search">
          <div class="engine-buttons" onClick={this.buttonToggle.bind(this)}>
              <button class="m-50 bg-google-icon bg-no-repeat w-125 h-125 cursor-pointer"
                      id='search-button' disabled={this.state.disabled === "1"} id="1"
                      engine='google' address='http://www.google.com/search?q=' ><img/></button>
              <button class="m-50 bg-google-icon bg-no-repeat w-125 h-125 cursor-pointer"
                      id='search-button' disabled={this.state.disabled === "2"} id="2"
                      engine='duckduckgo' address='https://www.duckduckgo.com/?q=' ><img/></button>
              <button class="m-50 bg-google-icon bg-no-repeat w-125 h-125 cursor-pointer"
                      id='search-button' disabled={this.state.disabled === "3"} id="3"
                      engine='wolfram' address='https://www.wolframalpha.com/input/?i='><img/></button>
          </div>
          <input class="items-center border-b bg-transparent" autoFocus id='search-input' type='text' ref="input" onKeyPress={sendSearch}/>
      </div>
    )
  };
};

export default SearchBox