
import React from "react";
import * as THREE from 'three'

// https://solarsena.com/solar-elevation-angle-altitude/
// https://www.pveducation.org/pvcdrom/properties-of-sunlight/elevation-angle

class SolarGraphNew extends React.Component {
    constructor(props) {
        super(props);

        var now = new Date();
        
        // current state of the system
        this.state = {
            daysInYear: Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)), // current day #
            latitude: this.deg2rad(41.881832),                    
            lst: (((now.getHours() * 60) + now.getMinutes()) / 60),
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

        var LSTM = this.deg2rad(15) * this.deg2rad(105)
        var B = 360/365 * (this.state.daysInYear - 81)
        var EoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B)
        var TC = 4 * (this.state.latitude - LSTM) + EoT

        //var sunRiseTime = 12 - 1/0.26 * Math.acos((-Math.sin(this.state.latitude) * Math.sin(this.state.declinationAngle))/(Math.cos(this.state.latitude) * Math.cos(this.state.declinationAngle)))
        //var sunSetTime = 12 + (1/0.26) * Math.acos((-1 * Math.sin(this.state.latitude) * Math.sin(this.state.declinationAngle))/(Math.cos(this.state.latitude) * Math.cos(this.state.declinationAngle)))
        var sunRiseTime = 12 - (1/0.26) * Math.acos(-Math.tan(this.state.latitude) * Math.tan(this.state.declinationAngle)) - TC/60
        var sunSetTime = 12 + (1/0.26) * Math.acos(-Math.tan(this.state.latitude) * Math.tan(this.state.declinationAngle)) - TC/60

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

    deg2rad = deg => (deg * Math.PI) / 180.0;
    rad2deg = rad => (rad * 180.0) / Math.PI;
  
    componentDidMount() {
        this.calcCurrentSolarPosition() // get sun position
        this.calcSolarAngleArray()      // get sun trajectory 

        // Setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0d1321);

        const camera = new THREE.PerspectiveCamera(45, 326 / 316, 1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('canvas'),
            antialias: true,
        })
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(326, 316);
        camera.position.set(12, 5, 30); // [x: solar noon y: None z: camera zoom]

        //const pointLight = new THREE.PointLight(0xffffff);
        //pointLight.position.set(5, 5, 5);

        //const ambientLight = new THREE.AmbientLight(0xffffff);
        //scene.add(pointLight, ambientLight);

        // create a white solar day angle chart
        var material = new THREE.LineBasicMaterial( { color: 0xf0ebd8} );
        var amplitudeScale = 0.15 // need to adjust the amplitude of solarElevationAngleArray (can also exclude this and change z-axis below)
        var points = [];
        for (var j = 0; j < this.state.lstArray.length; j++) {
            points.push( new THREE.Vector3(this.state.lstArray[j], this.rad2deg(this.state.solarElevationAngleArray[j] * amplitudeScale), 0 ) );
        }
        var geometry = new THREE.BufferGeometry().setFromPoints( points );
        var line = new THREE.Line( geometry, material );
        scene.add( line );


        // create a white horizon line
        var solarLineMaterial = new THREE.LineBasicMaterial( { color: 0xf0ebd8} )
        const solarLinePoints = []
        solarLinePoints.push( new THREE.Vector3( 0, 0, 0 ) )
        solarLinePoints.push( new THREE.Vector3( 24, 0, 0 ) )
        var solarLineGeometry = new THREE.BufferGeometry().setFromPoints(solarLinePoints)
        var solarLine = new THREE.Line(solarLineGeometry, solarLineMaterial)
        scene.add(solarLine)

        // plot stars (only before sunrise or after sunset)
        //console.log(this.rad2deg(this.state.solarElevationAngle))
        //console.log(this.rad2deg(this.state.sunSet * amplitudeScale))
        if (this.rad2deg(this.state.solarElevationAngle) <= 0) {
            const starVertices = [];
            for (let i = 0; i < 10000; i ++) {

                const x = THREE.MathUtils.randFloatSpread(1000);
                const y = THREE.MathUtils.randFloatSpread(1000);
                const z = THREE.MathUtils.randFloatSpread(1000);

                starVertices.push(x, y, z);
            }

            const starGeometry = new THREE.BufferGeometry();
            starGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute(starVertices, 3 ));
            const starMaterial = new THREE.PointsMaterial( { color: 0x888888 } );
            const starPoints = new THREE.Points(starGeometry, starMaterial );
            scene.add(starPoints);
        }

        // plot sun position
        /*
        const geometry1 = new THREE.CircleGeometry(0.7, 32);
        const material1 = new THREE.MeshBasicMaterial( { color: 0xf0ebd8 } );
        const circle = new THREE.Mesh( geometry1, material1 );
        scene.add( circle );
        circle.position.set (this.state.lst, this.state.solarElevationAngle, 0);
        //circle.rotation.set (0,1.1,0);//or any other values
        */

        // plot sun position as as sphere
        const sphereGeometry = new THREE.SphereGeometry( 0.7, 32, 32 );
        const sphereMaterial = new THREE.MeshBasicMaterial( { color: 0xf0ebd8 } );
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(sphere);
        //console.log(this.rad2deg(this.state.solarElevationAngle))
        //console.log(this.state.lst)
        sphere.position.set(this.state.lst, this.rad2deg(this.state.solarElevationAngle * amplitudeScale), 0);


        var distance = 0.5
        var radius = 1
        var sunlight_scale = 0.6
        if (this.state.solarElevationAngle  < 0.0) {
            sunlight_scale = 0.0;
        }
        if (distance/radius < 0.08) {
            // constant scale close to sun
            sunlight_scale = 0.6;
        } else if(distance/radius < 0.9){
            // use cosine for smooth reduction in intensity
            sunlight_scale = 0.6 * (0.5 * Math.cos(3.9 * distance / radius - 0.39) + 0.5);
        } else {
            // no sky past defined radius
            sunlight_scale = 0.0;
        }
        console.log(sunlight_scale)

        // render
        renderer.render(scene, camera);
    }

	render() {
        return (
          <>
            <canvas class="absolute h-92 w-92 overflow-hidden rounded-xl" id="canvas"/>
          </>
        );
      }
}

export default SolarGraphNew