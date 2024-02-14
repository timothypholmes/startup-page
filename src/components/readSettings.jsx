import Cookies from 'js-cookie';
import defaultSettings from "../config/settings.json"

export function readSettings() {
  var settings = Cookies.get('settings');

  if (settings) {
    return JSON.parse(settings);
  } else {
    return defaultSettings;
  }
}
