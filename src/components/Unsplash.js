import React, { Component } from "react";
import { render } from 'react-dom';
import axios from "axios";


class Unsplash extends Component {
    constructor(props) {
        super(props);
        this.state = {
            photos: [],
        }
    }

    componentDidMount() {

        const accessKey = process.env.REACT_APP_ACCESS_KEY; 
        //const category = 'chicago';//process.env.REACT_APP_UNSPLASH_PHOTO_CATEGORY;
        var categoryArray = ['chicago', 'glacier', 'alaska', 'minimal', 'miami', 
                             'ocean', 'sea', 'california', 'new york', 'seattle']
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
        })
        .then(res => {

            var totalFound = res.data.results.length;
            var randNum = Math.floor(Math.random() * totalFound)
            var full=res.data.results[randNum].urls.raw;

            this.setState({ photos: full });
        })
        .catch(err => {
            console.log(err);
        });
  
        }

    render() {
        console.log(this.photos);
        return (
                <img class="rounded-md col-span-1 shrink-0 h-36 w-36" src={this.state.photos}/>
        );
    }
}

export default Unsplash