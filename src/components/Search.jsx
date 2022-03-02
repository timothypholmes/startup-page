import React from "react";

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

  sendSearch(e) {
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
  
  render() {
    return (
      <div class="flex justify-center ">
        <div>
          <div class="flex space-x-8 justify-center pt-8 pb-8" onClick={this.buttonToggle.bind(this)}>
              <button class="bg-google-icon bg-no-repeat w-8 h-8 outline-inherit cursor-pointer border-none disabled:opacity-100 opacity-50" 
                      id='search-button' disabled={this.state.disabled === "1"} id="1" 
                      engine='google' address='http://www.google.com/search?q=' >
              </button>
              <button class="bg-duck-icon bg-no-repeat w-8 h-8 outline-inherit cursor-pointer border-none disabled:opacity-100 opacity-50" 
                      id='search-button' disabled={this.state.disabled === "2"} id="2" 
                      engine='duckduckgo' address='https://www.duckduckgo.com/?q=' ></button>
              <button class="bg-wolfram-icon bg-no-repeat w-8 h-8 outline-inherit cursor-pointer border-none disabled:opacity-100 opacity-50" 
                      id='search-button' disabled={this.state.disabled === "3"} id="3"
                      engine='wolfram' address='https://www.wolframalpha.com/input/?i='></button>
              <button class="bg-stack-icon bg-no-repeat w-8 h-8 outline-inherit cursor-pointer border-none disabled:opacity-100 opacity-50" 
                      id='search-button' disabled={this.state.disabled === "4"} id="4"
                      engine='stack' address='https://stackoverflow.com/?q='></button>
          </div>
          <input class="items-center w-60 h-5 boarder-none bg-off-white1 border-white border border-solid border-gray-300 rounded-xl focus:border-red2 focus:outline-none"
           autoFocus id='search-input' type='text' ref="input" onKeyPress={this.sendSearch}/>
        </div>
      </div>
    )
  };
};

export default SearchBox