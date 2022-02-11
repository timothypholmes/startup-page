
import React from "react";

// https://solarsena.com/solar-elevation-angle-altitude/
// https://www.pveducation.org/pvcdrom/properties-of-sunlight/elevation-angle

class SolarGraph extends React.Component {
    constructor(props) {
        super(props);

        var now = new Date();

        // current state of the system
        this.state = {
            daysInYear: Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)), // current day #
            latitude: 41.881832,//this.deg2rad(41.881832),                    
            lst: (((now.getHours() * 60) + now.getMinutes()) / 60),
            lstArray: this.linspace(0, 24, 1440),
            declinationAngle: 0,
            hourAngle: 0,
            hourAngleArray: [],
            solarElevationAngle: 0,
            solarElevationAngleArray: []
        }
        //console.log(this.state)
    }
    
    calcCurrentSolarPosition() {
        this.state.declinationAngle = -0.4091 * Math.cos((360/365 * (this.state.daysInYear + 10)))
        this.state.hourAngle = 0.26 * (this.state.lst - 12)
        this.state.solarElevationAngle  = Math.asin(Math.sin(this.state.latitude) * Math.sin(this.state.declinationAngle) 
            + Math.cos(this.state.latitude) * Math.cos(this.state.declinationAngle) * Math.cos(this.state.hourAngle))
    }

    calcSolarAngleArray() {        
        this.state.declinationAngle = -0.4091 * Math.cos((360/365 * (this.state.daysInYear + 10)))
        for (var i = 0; i < this.state.lstArray.length; i++) {
            this.state.hourAngleArray.push(0.26 * (this.state.lstArray[i] - 12))
        }
        for (var i = 0; i < this.state.lstArray.length; i++) {
            this.state.solarElevationAngleArray.push(Math.asin(Math.sin(this.state.latitude) * Math.sin(this.state.declinationAngle) 
                + Math.cos(this.state.latitude) * Math.cos(this.state.declinationAngle) * Math.cos(this.state.hourAngleArray[i])))
        }
        
        console.log(this.state.solarElevationAngleArray)
    }
    
    getPosition() {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords['latitude']
            this.longitude = position.coords['longitude']
            return latitude
            //{ this.latitude, this.longitude } = position.coords[0];
            // Show a map centered at latitude / longitude.
            //return { latitude, longitude }
          });
    }

    linspace(start, stop, n) {
        var arr = [];
        var step = (stop - start) / (n - 1);
        for (var i = 0; i < n; i++) {
          arr.push(start + (step * i));
        }
        return arr;
    }

    
  
    componentDidMount() {
        this.calcCurrentSolarPosition() // get sun position
        this.calcSolarAngleArray()      // get sun tragectory 
        console.log(this.state)

    }

	render() {
        return (
          <>
            <body class="m-0 h-fill w-full">
                <canvas id="canvas"/>
            </body>
          </>
        );
      }
}

export default SolarGraph