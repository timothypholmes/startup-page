import React from "react";
import axios from 'axios';


class News extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      isLoaded: false,
    };
  }

  async fetchData() {
    /*
    await fetch(`https://newsdata.io/api/1/news?apikey=${import.meta.env.VITE_NEWS_DATA_API_KEY}&q=us&country=us&language=en&category=business,politics,world`)
    .then((response) => response.json())
    .then(data => {this.setState({posts: data.results})
      //for (var i = 0; i < data.results.length; i++) {
      //  this.setState({posts: data.results[i]})
      //}
      //console.log(data)
    })
    */
    await fetch(`https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`)
    .then((response) => response.json())
    .then(data => {this.setState({posts: data.articles})
      console.log(data)
    })
  }

  async componentDidMount() {
  //componentDidMount() {
    this.fetchData()
    this.state.isLoaded = true
  }

	render() {
    console.log(this.state.posts)
    if (this.state.isLoaded) {
      return (
        <>
        <div class="rounded-xl overflow-y-auto overflow-hidden h-80 w-[30.5rem] space-y-0">
            {this.state.posts.map((category, key) =>(
              <div class="rounded-xl h-24 w-full">
                  <div class="overflow-hidden h-full w-48 float-left">
                    <img class="w-full max-h-full" src={category.urlToImage}></img>
                  </div>
                  <div class="pl-4 overflow-hidden h-full w-72 float-left">
                    <a class="pt-1 float-right bg-red-600 text-white text-[14px]" href={category.url} key={key}>{category.title}</a>
                  </div>
              </div>
            ))}
        </div>
        </>
      );
    }
    else {
      return (
        <>
        <div class="text-center items-center justify-center translate-x-0 translate-y-0">
          <h1>No news.</h1>
        </div>
        </>
      );
    }
  }
}

export default News