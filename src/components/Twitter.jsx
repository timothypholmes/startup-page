import React from "react";
import axios from 'axios';


class Twitter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    };
  }

  //async componentDidMount() {
  componentDidMount() {
    fetch('http://localhost:3001/api/tweet')
      .then((response) => response.json())
      .then(data => {
        console.log(data)
      })
  }

	render() {
    return (
      <>
      <div class="text-center items-center justify-center translate-x-0 translate-y-0">
        <h1 class="text-3xl pt-5 text-off-white1">{this.state.posts}</h1>
      </div>
      </>
    );
  }
}

export default Twitter