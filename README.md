<p align="center">
  <img width="100px" src="./src/assets/preview/icon.ico">
</p>

<div align="center">
    <h1>Modular Grid Page</h1>
    <b>modular grid start page for your browser</b>
</div>

#### Light Mode
![preview-light](https://github.com/timothypholmes/startup-page/blob/main/src/assets/preview/preview-light.png) 


#### Dark Mode
![preview-dark](https://github.com/timothypholmes/startup-page/blob/main/src/assets/preview/preview-dark.png?raw=true)


## Index
- [Modular Grid Page](#)
  - [About](#about)
  - [Features](#features)
  - [Todo Features](#Built-with)
  - [Tech Stack](#Tech-Stack)
  - [Getting Started](#Getting-started)
  - [Installation](#Installation)
  - [Usage](#Usage)
  - [Modules](#Modules)
  - [API features](#API-features)

## About

A side project I created to use everyday. Started with just needing a search bar to quickly search on different sites and unfolded to experimenting with many different modules.

## Features

## Todo Features

- [x] Add light/dark mode
- [ ] Replace TDAmeritrade API with other financial API
- [x] Fix solar chart axis (and other various bugs)
- [ ] Add CMS for bookmarks
- [ ] Make customizable on front end

## Tools

- [react](https://reactjs.org) frontend framework
- [tailwindcss](https://tailwindcss.com) css framework
- [vite](https://vitejs.dev) javascript build tool

## Getting started

The weather feature of this page requires you to add an API Key. See how a `.env` key is created below. To setup try running the `setup.sh` script. If this script does not work trying working through the instructions below.

### Setting credentials and info

Run the command 

```
cp .env.example .env
```

to copy the .env template and add your credentials. Or copy the following below into your local .env file:

```
# open weather map API
VITE_OPEN_WEATHER_MAP_API_KEY={YOUR_KEY}
VITE_OPEN_WEATHER_MAP_UNIT={imperial_OR_metric}

# TDA API
VITE_TD_CONSUMER_KEY={YOUR_TD_AMERITRADE_API_KEY}

# unsplash API
VITE_ACCESS_KEY={YOUR_UNPLASH_ACCESS_KEY}
VITE_SECRET_KEY={YOUR_UNPLASH_SECRET_KEY}
VITE_UNSPLASH_PHOTO_CATEGORY={PHOTO_CATEGORIES}

# location, leave empty to use the browser Geolocation API
VITE_LAT={YOUR_LATITUDE}
VITE_LON={YOUR_LONGITUDE}

# API key for news api https://newsapi.org
VITE_NEWS_API_KEY={YOUR_NEWS_API_KEY}

# browser preference 
BROWSER={PREF_BROWSER}
```

### Setting bookmark lists

Run the command 

```
for i in {1..5}; echo "import React from \"react\"; 

class List$i extends React.Component {
  render() {
    return(
      <>
        <ul class=\" text-left text-off-white1 m-0 pl-5 pt-1 before:block before:absolute left-0 w-1 h-3 border-solid border-teal-600 relative list-none mb-2\">
            <li class=\"font-black text-lg underline underline-offset-4 decoration-2 decoration-off-white1 text-center\">example</li>
            <li class=\"\"><a href=\"https://news.ycombinator.com/\">example</a></li>
        </ul>
      </>
    );
  }
}

export default List$i" > src/assets/lists/list$i.jsx
```

to copy down the example into the 5 different bookmark boxes. From here import the lists under the example list in the `Index.js` file as shown:

```
// list
import Example from "../assets/lists/list.example";
import List1 from "../assets/lists/list1.jsx";
import List2 from "../assets/lists/list2.jsx";
import List3 from "../assets/lists/list3.jsx";
import List4 from "../assets/lists/list4.jsx";
import List5 from "../assets/lists/list5.jsx";
```

and finally replace the `<Example />` with the appropriate list component in each row of the `Index.js` file.

## Installation

1. Clone the repo in the directory of your choosing.
    ```sh
    git clone https://github.com/timothypholmes/startup-page.git
    ```
2. Navigate to the root of the directory and run the following command.
    ```sh
    npm install
    ```
3. To compile the site run the following npm command.
    ```sh
    npm run build
    ```

## Usage

This start page was built with the reactJS framework. To test the page run the command:

```
npm start
```

To build the page run the command:

```
npm run build
```

and link the static index.html local file to your browser preferences (open on new tab and 
open on new window)

Or run it using:

```
serve -s dist -p 8000
```

This calls the dist folder created by the `vite build` process. The `-p` flag runs the static site on port 8000.

## Modules

- **solar graph** displays suns angular elevation, animated to show sunset and sunrise
- **clock** displays time and day
- **weather** current weather conditions and temperature using [openweather](https://openweathermap.org/api)
- **images** displays a random sort of pictures using [unsplash](https://unsplash.com/developers)
- **stockprice** displays intraday stock data using [tdameritrade](https://developer.tdameritrade.com/apis)
- **bookmarks** displays list of bookmarks

## API features

- `tdameritrade` - stock charts, option chains, account balance
- `openweather` - Temperature with weather emoji
- `unsplash` - Random photo squares
