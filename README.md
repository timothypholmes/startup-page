<p align="center">
  <img width="100px" src="./src/assets/preview/icon.ico">
</p>

<div align="center">
    <h1>Modular Grid Page</h1>
    <b>modular grid start page for your browser</b>
</div>

#### Light Mode
![preview-light](https://github.com/timothypholmes/startup-page/blob/main/src/assets/preview/new-preview-light.png) 


#### Dark Mode
![preview-dark](https://github.com/timothypholmes/startup-page/blob/main/src/assets/preview/new-preview-dark.png?raw=true)


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

A minimal home page for a browser called Modular Grid Page. Modular Grid Page is designed to be a fast and efficient homepage that is easy to use. It has a clean and intuitive interface, and it comes with a number of useful features that make browsing the web a breeze. 

## Installation

1. Clone the repo in the directory of your choosing.
    ```sh
    git clone https://github.com/timothypholmes/startup-page.git
    ```
2. Navigate to the repos root and run the command
    ```sh
    ./setup.sh
    ```

This will copy the example configuration file and .env file. If the `setup.sh` script fails, try running each step manually:

1. Copy the enviorment file with:
```sh
cp .env.example .env
```
2. Copy the config file with:
```sh
cp src/config/index.example.js src/config/index.js
```
3. Install dependencies:
```sh
npm install
```
4. Build site:
```sh
npm run build
```
5. Serve site:
```sh
serve -s dist -p 8000
```

### Configure

This project will still need more input from the user before it is ready to be used. 

#### Env file

The `.env` folder is located in the root of the project. The site may not run without the correct API keys. This site uses the `.env.` file to store API keys. The weather box will not work unless `VITE_OPEN_WEATHER_MAP_API_KEY` is added in the enviorment folder. For the images to work a unsplashed api key is needed. In the enviorment file add `VITE_ACCESS_KEY` and `VITE_SECRET_KEY` for unsplashed access. 

#### Config file

The config file is located under `src/config/index.js` The config file is where the screen can be configured to the users preferences. Bookmarks can be added under bookmark and unsplashed categories can be added under unsplash. More configurations are being added and cleaned up (as of 12/31/2022).

## Usage

This start page was built with the reactJS framework. To test the page run the command:

```
npm start
```

To build the page run the command:

```
npm run build
```

To host the site run:

```
serve -s dist -p 8000
```

This calls the dist folder created by the `vite build` process. The `-p` flag runs the static site on port 8000.

## API features

- `openweather` - Temperature with weather
- `unsplash` - Random photo squares


## Tools

- [react](https://reactjs.org) frontend framework
- [tailwindcss](https://tailwindcss.com) css framework
- [vite](https://vitejs.dev) javascript build tool


## Old version

Includes the TDAmeritrade component:

#### Light Mode
![preview-light](https://github.com/timothypholmes/startup-page/blob/main/src/assets/preview/preview-light.png) 


#### Dark Mode
![preview-dark](https://github.com/timothypholmes/startup-page/blob/main/src/assets/preview/preview-dark.png?raw=true)

