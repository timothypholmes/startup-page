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

- [About](#about)
- [Installation](#installation)
  * [Configure](#configure)
    + [Config file](#config-file)
- [Usage](#usage)
- [API features](#api-features)
- [Tools](#tools)
- [Old version](#old-version)
    + [Light Mode](#light-mode-1)
    + [Dark Mode](#dark-mode-1)
- [Developer](#developer)

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

This will copy the example configuration file where api and preferences are stored. If the `setup.sh` script fails, try running each step manually:

1. Copy the config file with:
```sh
cp src/config/index.example.js src/config/index.js
```
2. Install dependencies:
```sh
npm install
```
3. Build site:
```sh
npm run build
```
4. Serve site:
```sh
serve -s dist -p 8000
```

### Configure

This project will still need more input from the user before it is ready to be used. 


#### Config file

The config file is located under `src/config/index.js`. There are two required credentials needed for APIs. The config file is where the screen can be configured to the users preferences. Bookmarks can be added under bookmark and unsplashed categories can be added under unsplash. More configurations are being added and cleaned up (as of 1/1/2023).

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
npm run serve
```

This will rebuild ans serve the site or

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

Includes the old TDAmeritrade component:

#### Light Mode
![preview-light](https://github.com/timothypholmes/startup-page/blob/main/src/assets/preview/preview-light.png) 


#### Dark Mode
![preview-dark](https://github.com/timothypholmes/startup-page/blob/main/src/assets/preview/preview-dark.png?raw=true)


## Developer

To deploy to github pages update the `base` in the `vite.config.js` file. Then run the command:

```sh
npm run deploy
```

Additional notes:
- 