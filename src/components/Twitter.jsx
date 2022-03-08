import React from "react";

class Twitter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tweet: this.props.tweet,
      applications: null
    }
  }

  fetchData = () => {
    var user = "DeItaone"
    var maxResult = 1
    var url = `https://api.twitter.com/2/tweets/search/recent?query=from:${user}&max_results=${maxResult}`

    
    fetch('http://localhost:3001/api/tweet')
      .then((response) => response.json())
      .then(data => {
        console.log(data)
    })
    
  
    fetch('http://localhost:3001/api/tweet')
    .then(response => response.json())
    .then(data => this.setState({ applications: data }));
      //.then(body => {console.log(body)})

    console.log(this.state.applications)
  }

  //async componentDidMount() {
  componentDidMount() {
    this.fetchData()
  }

	render() {
    return (
      <>
      <div class="text-center items-center justify-center translate-x-0 translate-y-0">
        <h1 class="text-3xl pt-5 text-off-white1">{this.state.tweet}</h1>
      </div>
      </>
    );
  }
}

export default Twitter