# Start Page

A custom startup page for your browser. 

![preview-light](https://github.com/timothypholmes/startup-page/blob/master/preview-light.png) ![preview-dark](https://github.com/timothypholmes/startup-page/blob/master/preview-dark.png)

## Todo (future features)

- [x] Add light/dark mode
- [ ] Replace TDAmeritrade API with
- [ ] Fix solar chart axis (and other various bugs)
- [ ] Add CMS for bookmarks
- [ ] Make customizable on front end

## Getting started

The weather feature of this page requires you to add an API Key. First create a `.env` file
in the root of the project directory. Then add this variable to the file with the API Key. 

```
# open weather map API
REACT_APP_OPEN_WEATHER_MAP_API_KEY={YOUR_KEY}
REACT_APP_OPEN_WEATHER_MAP_ZIP_CODE={YOUR_ZIP_CODE (US ONLY)}

# TDA API
REACT_APP_TD_CONSUMER_KEY={YOUR_TD_AMERITRADE_API_KEY}

# unsplash API
REACT_APP_ACCESS_KEY={YOUR_UNPLASH_ACCESS_KEY}
REACT_APP_SECRET_KEY={YOUR_UNPLASH_SECRET_KEY}
REACT_APP_UNSPLASH_PHOTO_CATEGORY={PHOTO_CATEGORIES}

# browser preference 
BROWSER={PREF_BROWSER}
```

## Dependencies 

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
serve -s build
```

## API features

`TDAmeritrade` - stock charts, option chains, account balance
`openweather` - Temperature with weather emoji
`unsplash` - Random photo squares


## Old Start Page Design

![preview_old](https://github.com/timothypholmes/startup-page/blob/master/preview_old.png)