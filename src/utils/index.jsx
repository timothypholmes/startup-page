import config from "../config";

export function getLocation() {

  if (navigator.geolocation) { // get location
    navigator.geolocation.getCurrentPosition((position) => {
      var currPosition = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
      return currPosition
    });
  } else if (config.latitude) {
    var currPosition = {
      latitude: config.latitude,
      longitude: config.longitude
    }
    return currPosition
  } else {
    console.log('Geolocation is not supported by this browser.');
  }
}
