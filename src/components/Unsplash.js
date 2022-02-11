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
                             'ocean', 'sea', 'california', 'new york', 'seattle',
                             'olympic national park', 'mt. rainier national park']
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

            //console.log(res);

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
        return (
            <div class="relative rounded-xl overflow-hidden h-full w-36 bg-center bg-no-repeat">
                <img class="min-w-full min-h-full" src={this.state.photos}/>
            </div>
        );
    }
}

export default Unsplash