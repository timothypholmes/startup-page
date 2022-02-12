
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
            latitude: 0.73097,//41.881832,//this.deg2rad(41.881832),                    
            lst: (((now.getHours() * 60) + now.getMinutes() - 120) / 60),
            lstArray: this.linspace(0, 24, 10000),//1440),
            declinationAngle: 0,
            hourAngle: 0,
            hourAngleArray: [],
            solarElevationAngle: 0,
            solarElevationAngleArray: [],
            sunRise: 0,
            sunSet: 0,
            xyValues: []
        }
    }
    
    calcCurrentSolarPosition() {

        this.state.declinationAngle = -0.4091 * Math.cos(360/365 * (this.state.daysInYear + 10))
        this.state.hourAngle = 0.26 * (this.state.lst - 12)

        var sunRiseTime = 12 - 1/0.26 * Math.acos((-Math.sin(this.state.latitude) * Math.sin(this.state.declinationAngle))/(Math.cos(this.state.latitude) * Math.cos(this.state.declinationAngle)))
        var sunSetTime = 12 + 1/0.26 * Math.acos((-Math.sin(this.state.latitude) * Math.sin(this.state.declinationAngle))/(Math.cos(this.state.latitude) * Math.cos(this.state.declinationAngle)))
        
        var hourAngleSunRise = 0.26 * (sunRiseTime - 12)
        var hourAngleSunSet = 0.26 * (sunSetTime - 12)

        this.state.sunRise = Math.asin(Math.sin(this.state.latitude) * Math.sin(this.state.declinationAngle) 
            + Math.cos(this.state.latitude) * Math.cos(this.state.declinationAngle) * Math.cos(hourAngleSunRise))
        this.state.sunSet = Math.asin(Math.sin(this.state.latitude) * Math.sin(this.state.declinationAngle) 
            + Math.cos(this.state.latitude) * Math.cos(this.state.declinationAngle) * Math.cos(hourAngleSunSet))

        this.state.solarElevationAngle = Math.asin(Math.sin(this.state.latitude) * Math.sin(this.state.declinationAngle) 
            + Math.cos(this.state.latitude) * Math.cos(this.state.declinationAngle) * Math.cos(this.state.hourAngle))
    }

    calcSolarAngleArray() {        

        this.state.declinationAngle = -0.4091 * Math.cos(360/365 * (this.state.daysInYear + 10))
        for (var i = 0; i < this.state.lstArray.length; i++) {
            this.state.hourAngleArray.push(0.26 * (this.state.lstArray[i] - 12))
        }
        for (var j = 0; j < this.state.lstArray.length; j++) {
            this.state.solarElevationAngleArray.push(Math.asin(Math.sin(this.state.latitude) * Math.sin(this.state.declinationAngle) 
                + Math.cos(this.state.latitude) * Math.cos(this.state.declinationAngle) * Math.cos(this.state.hourAngleArray[j])))
        }
    }
    
    getLocation() {
        navigator.geolocation.getCurrentPosition(position => {
            //const { this.state.latitude, this.longitude } = position.coords
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
        this.calcSolarAngleArray()      // get sun trajectory 

        //this.setup() // setup plot
        //this.draw()  // draw plot
    }

	render() {
        return (
          <>
            <canvas class="absolute h-92 w-92 overflow-hidden rounded-xl" id="canvas"/>
          </>
        );
      }
}

export default SolarGraph