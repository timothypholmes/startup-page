# Start Page

A custom startup page for your browser. 

![preview](https://github.com/timothypholmes/startup-page/blob/master/preview.png)

## Getting started

The weather feature of this page requires you to add an API Key. First create a `.env` file
in the root of the project directory. Then add this variable to the file with the API Key. 

```
REACT_APP_OPEN_WEATHER_MAP_API_KEY={YOUR_KEY}
REACT_APP_OPEN_WEATHER_MAP_ZIP_CODE={YOUR_ZIP_CODE (US ONLY)}
```

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