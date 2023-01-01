import React, { Component } from "react";
import axios from "axios";
import config from "../config";

class Unsplash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
    }
  }
  
  componentDidMount() {
    
    const accessKey = config.unsplashCredential;
    var categoryArray = this.props.search;
    var categoryIndex = Math.floor(Math.random() * categoryArray.length); 
    var category = categoryArray[categoryIndex];
    
    // https://unsplash.com/documentation#get-a-random-photo
    axios.get("https://api.unsplash.com//search/photos?random", {
      params: { 
        query: category,
        per_page: 100,  
      },
      headers: {
        Authorization: "Client-ID " + accessKey,
      },
    }).then(res => {
      var totalFound = res.data.results.length;
      var randNum = Math.floor(Math.random() * totalFound)
      var full=res.data.results[randNum].urls.raw;
      this.setState({ photos: full });
    }).catch(err => {
      console.log(err);
    });
  }

  render() {
    return (
      <div class="relative rounded-xl overflow-hidden h-full bg-center bg-no-repeat border-0 dark:border-4 dark:border-off-white2">
      <img class="min-w-full min-h-full" src={this.state.photos}/>
      </div>
    );
  }
}

export default Unsplash;