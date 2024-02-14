import { readSettings } from '../components/readSettings';
const settings = readSettings();

export function getLocation() {

  if (navigator.geolocation) { // get location
    navigator.geolocation.getCurrentPosition((position) => {
      var currPosition = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
      return currPosition
    });
  } else if (settings.latitude) {
    var currPosition = {
      latitude: settings.latitude,
      longitude: settings.longitude
    }
    return currPosition
  } else {
    console.log('Geolocation is not supported by this browser.');
  }
}
