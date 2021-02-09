const key = '0b167504726008609315f09e5b4bd531';
const zip = '60605'
if(key=='') document.getElementById('temp').innerHTML = ('Remember to add your api key!');

function weatherBallon( ) {
	fetch('https://api.openweathermap.org/data/2.5/weather?zip=' + zip + ',us&appid=' + key)  
	.then(function(resp) { return resp.json() }) 
	.then(function(data) {
		drawWeather(data);
	})
	.catch(function() {
		// catch any errors
	});
}
function drawWeather( d ) {
  var celcius = Math.round(parseFloat(d.main.temp)-273.15);
  var fahrenheit = Math.round(((parseFloat(d.main.temp)-273.15)*1.8)+32);
  var main_description = d.weather[0].main; 
  var description = d.weather[0].description; 
	
  document.getElementById('location').innerHTML = d.name;
  
  if( main_description == 'Clear') {
    document.getElementById('temp').innerHTML = fahrenheit + '&deg;' + ' ☀️';
  } else if( main_description == 'Clouds' ) {
    document.getElementById('temp').innerHTML = fahrenheit + '&deg;' + ' ☁️';
  } else if( main_description == 'Drizzle' ) {
    document.getElementById('temp').innerHTML = fahrenheit + '&deg;' + ' 🌦️';
  } else if( main_description == 'Rain' ) {
    document.getElementById('temp').innerHTML = fahrenheit + '&deg;' + ' 🌧️';
  } else if( main_description == 'Thunderstorm' ) {
    document.getElementById('temp').innerHTML = fahrenheit + '&deg;' + ' ⛈️';
  } else if( main_description == 'Snow' ) {
    document.getElementById('temp').innerHTML = fahrenheit + '&deg;' + ' ❄️';
  } else if( main_description == 'Fog' ) {
    document.getElementById('temp').innerHTML = fahrenheit + '&deg;' + ' 🌫️';
  } else if( main_description == 'Mist' ) {
    document.getElementById('temp').innerHTML = fahrenheit + '&deg;' + ' 🌫️';
  } else if( main_description == 'Haze' ) {
    document.getElementById('temp').innerHTML = fahrenheit + '&deg;' + ' 🌫️';
  } else if( main_description == 'Tornado' ) {
    document.getElementById('temp').innerHTML = fahrenheit + '&deg;' + ' 🌫️';
  } else if( main_description == 'Dust' ) {
    document.getElementById('temp').innerHTML = fahrenheit + '&deg;' + ' 🌫️';
  } else {
    document.getElementById('temp').innerHTML = fahrenheit + '&deg;';
  }
}
window.onload = function() {
	weatherBallon( );
}