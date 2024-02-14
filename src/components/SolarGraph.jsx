
import React from "react";
import * as THREE from "three";

// import shaders
import atmosphereVertex from '../assets/shader/atmosphereVertex.glsl'
import atmosphereFragment from '../assets/shader/atmosphereFragment.glsl'
import horizonVertex from '../assets/shader/horizonVertex.glsl'
import horizonFragment from '../assets/shader/horizonFragment.glsl'
import sunVertex from '../assets/shader/sunVertex.glsl'
import sunFragment from '../assets/shader/sunFragment.glsl'

import { readSettings } from './readSettings';
const settings = readSettings();

// Useful documents
// https://solarsena.com/solar-elevation-angle-altitude/
// https://www.pveducation.org/pvcdrom/properties-of-sunlight/elevation-angle
// https://planetcalc.com/4270/

var BACKGOUND = 0x000000
import { getLocation } from '../utils/index.jsx'
const location = getLocation();

class SolarGraph extends React.Component {
  constructor(props) {
    super(props);
    this.animatePosition = this.animatePosition.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
    
    var now = new Date();
    
    // current state of the system
    this.state = {
      latitude: 0,  
      longitude: 0,  
      currentlst: (((now.getHours() * 60) + now.getMinutes()) / 60),              
      lst: 0,
      lstArray: this.linspace(0, 24, 1000),
      currentTime: 0,
      maxSunYPosition: 0,
      sunrise: 0,
      sunset: 0,
      sunrise_civil_twilight: 0,
      starField: 0
    }

    if ( settings.latitude ) {
      this.getLocation(settings.latitude, settings.longitude);
    } else if (navigator.geolocation) { // get location
      navigator.geolocation.getCurrentPosition((position) => {
        this.getLocation(position.coords.latitude, position.coords.longitude);
      });
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
    
    this.sceneRender = {
      camera: null,
      scene: null,
      renderer: null
    }
  }
  
  animatePosition(lst, startTime, amplitudeScale) {
    if (lst < startTime) {
      this.setState({
        lst: lst
      })
      this.setSun(amplitudeScale)
    }
    else {
      clearInterval(this.animate);
    }
  }
  
  updatePosition(amplitudeScale) {
    this.getCurrentlst() 
    this.gaussian_distribution(this.state.currentlst) * amplitudeScale
    this.setSun(amplitudeScale)
  }
  
  getCurrentlst() {
    var now = new Date();
    this.currentlst = (((now.getHours() * 60) + now.getMinutes()) / 60)
  }

  force_range(v, max) {
    // force v to be >= 0 and < max
    if (v < 0) {
        return v + max;
    } else if (v >= max) {
        return v - max;
    }

    return v;
  }

  event_time(date, before_noon=true, zenith=90.8) {
    let day = date.getDate();
    let month = date.getMonth() + 1; // JavaScript months are 0-11
    let year = date.getFullYear();

    const TO_RAD = Math.PI / 180.0;

    let N1 = Math.floor(275 * month / 9);
    let N2 = Math.floor((month + 9) / 12);
    let N3 = (1 + Math.floor((year - 4 * Math.floor(year / 4) + 2) / 3));
    let N = N1 - (N2 * N3) + day - 30;

    let lngHour = this.state.longitude / 15;

    let t;
    if (before_noon) {
        t = N + ((6 - lngHour) / 24);
    } else { //sunset
        t = N + ((18 - lngHour) / 24);
    }

    let M = (0.9856 * t) - 3.289;
    let L = M + (1.916 * Math.sin(TO_RAD*M)) + (0.020 * Math.sin(TO_RAD * 2 * M)) + 282.634;
    L = this.force_range(L, 360);

    let RA = (1/TO_RAD) * Math.atan(0.91764 * Math.tan(TO_RAD*L));
    RA = this.force_range(RA, 360);

    let Lquadrant  = (Math.floor( L/90)) * 90;
    let RAquadrant = (Math.floor(RA/90)) * 90;
    RA = RA + (Lquadrant - RAquadrant);
    RA = RA / 15;

    let sinDec = 0.39782 * Math.sin(TO_RAD*L);
    let cosDec = Math.cos(Math.asin(sinDec));

    let cosH = (Math.cos(TO_RAD*zenith) - (sinDec * Math.sin(TO_RAD*this.state.latitude))) / (cosDec * Math.cos(TO_RAD*this.state.latitude));

    if (cosH > 1) {
        return null;
    }
    if (cosH < -1) {
        return null;
    }

    let H;
    if (before_noon) {
        H = 360 - (1/TO_RAD) * Math.acos(cosH);
    } else { //setting
        H = (1/TO_RAD) * Math.acos(cosH);
    }

    H = H / 15;
    let T = H + RA - (0.06571 * t) - 6.622;

    let UT = T - lngHour;
    UT = this.force_range(UT, 24);

    let hr = this.force_range(Math.floor(UT), 24);
    let min = +(((UT - Math.floor(UT)) * 60).toFixed(2));
    if (min === 60) {
        hr += 1;
        min = 0;
    }

    if (hr === 24) {
        hr = 0;
        day += 1;

        if (day > new Date(year, month, 0).getDate()) {
            day = 1;
            month += 1;

            if (month > 12) {
                month = 1;
                year += 1;
            }
        }
    }

    return new Date(Date.UTC(year, month - 1, day, hr, min));
  }

  gaussian_distribution(x, mean=12, std=5) {
    return Math.exp(-1 * (x - mean)**2 / (2 * std**2)) / (std * Math.sqrt(2 * Math.PI));
  }

  calculateSolarSettings() {
    let date = new Date();
    let local_time_zone = date.getTimezoneOffset() / 60;
    this.state.currentTime = date.getHours() + (date.getMinutes() / 60);

    // sunrise
    let sunrise = this.event_time(date, true, 90.8);
    this.state.sunrise = +((sunrise.getUTCHours() + (sunrise.getUTCMinutes() / 60)).toFixed(0));
    let sunrise_civil_twilight = this.event_time(date, true, 96);
    this.state.sunrise_civil_twilight = Math.round(
      sunrise_civil_twilight.getUTCHours() + (sunrise_civil_twilight.getUTCMinutes() / 60)
    );
    let sunrise_nautical_twilight = this.event_time(date, true, 102);
    this.state.sunrise_nautical_twilight = Math.round(
      sunrise_nautical_twilight.getUTCHours() + (sunrise_nautical_twilight.getUTCMinutes() / 60)
    );
    let sunrise_astronomical_twilight = this.event_time(date, true, 108);
    this.state.sunrise_astronomical_twilight = Math.round(
      sunrise_astronomical_twilight.getUTCHours() + (sunrise_astronomical_twilight.getUTCMinutes() / 60)
    );
  
    // sunset
    let sunset = this.event_time(date, false, 90.8);
    this.state.sunset = +((sunset.getUTCHours() + (sunset.getUTCMinutes() / 60)).toFixed(0));
    let sunset_civil_twilight = this.event_time(date, false, 96);
    this.state.sunset_civil_twilight = Math.round(
      sunset_civil_twilight.getUTCHours() + (sunset_civil_twilight.getUTCMinutes() / 60)
    );
    let sunset_nautical_twilight = this.event_time(date, false, 102);
    this.state.sunset_nautical_twilight = Math.round(
      sunset_nautical_twilight.getUTCHours() + (sunset_nautical_twilight.getUTCMinutes() / 60)
    );
    let sunset_astronomical_twilight = this.event_time(date, false, 108);
    this.state.sunset_astronomical_twilight = Math.round(
      sunset_astronomical_twilight.getUTCHours() + (sunset_astronomical_twilight.getUTCMinutes() / 60)
    );
  }
  
  linspace(start, stop, n) {
    var arr = [];
    var step = (stop - start) / (n - 1);
    for (var i = 0; i < n; i++) {
      arr.push(start + (step * i));
    }
    return arr;
  }
  
  getLocation(latitude, longitude) {
    this.state.latitude = this.deg2rad(latitude)
    this.state.longitude = this.deg2rad(longitude)
  }
  
  deg2rad = deg => (deg * Math.PI) / 180.0;
  rad2deg = rad => (rad * 180.0) / Math.PI;
  
  init() {
    
    const canvasContainer = document.getElementById('canvas')
    
    this.sceneRender.scene = new THREE.Scene();
    this.sceneRender.scene.background = new THREE.Color(BACKGOUND);
    
    this.sceneRender.camera = new THREE.PerspectiveCamera(
      108, 
      canvasContainer.clientWidth / canvasContainer.clientHeight,
      0.01, 
      500
    );
    this.sceneRender.renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('canvas'),
      antialias: true,
    })
      
    this.sceneRender.renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    this.sceneRender.renderer.setPixelRatio(window.devicePixelRatio);
    this.sceneRender.camera.position.set(12, 7, 8.8); // [x: solar noon y: None z: camera zoom]
    
    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(5, 5, 5);
    
    const ambientLight = new THREE.AmbientLight(0xffffff);
    this.sceneRender.scene.add(pointLight, ambientLight);
  }
    
  createBackground() {
    // set black background
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry( 50, 50, 0 ),
      new THREE.ShaderMaterial({
        vertexShader: this.vert,
        fragmentShader: this.frag,
      })
    )
    cube.position.set(0, 0, -0.1);
    this.sceneRender.scene.add(cube);
  }
    
  setSolarElevationPlot(amplitudeScale) {
      
    // create a white solar day angle chart
    var points = [];
    for (var j = 0; j < this.state.lstArray.length; j++) {
      points.push( new THREE.Vector3(
        this.state.lstArray[j], // x
        this.gaussian_distribution(this.state.lstArray[j]) * amplitudeScale, // y
        0 // z
      ));
    }
    var line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points), 
      new THREE.LineBasicMaterial({ color: 0xf0ebd8, fog: true})
    );
    line.position.set(0, 0, 0);
    this.sceneRender.scene.add(line);
  }

  setHorizon(amplitudeScale) {
    // set horizon block
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry( 100, 20, 0 ),
      new THREE.MeshBasicMaterial( {color: BACKGOUND} )
    )
    cube.position.set(0, -2.1, -1);
    this.sceneRender.scene.add(cube);
    
    // create a white horizon line
    var solarLineMaterial = new THREE.LineBasicMaterial( { color: 0xf0ebd8} )
    const solarLinePoints = []
    solarLinePoints.push( new THREE.Vector3( 
      0, this.gaussian_distribution(this.state.sunrise) * amplitudeScale, 0 
    ))
    solarLinePoints.push( new THREE.Vector3( 
      24, this.gaussian_distribution(this.state.sunset) * amplitudeScale, 0 
    ))
    var solarLineGeometry = new THREE.BufferGeometry().setFromPoints(solarLinePoints)
    var solarLine = new THREE.Line(solarLineGeometry, solarLineMaterial)
    this.sceneRender.scene.add(solarLine)
  }
        
  setStars() {
    var starsGeometry = new THREE.BufferGeometry();
    var starsMaterial = new THREE.PointsMaterial({ 
      color: 0xffffff, 
      size: 1, 
      sizeAttenuation: false,
      opacity: 1,
      depthTest: false,
      depthWrite: false
    });
    
    var starPositions = [];
    var starColors = [];
    for (var i = 0; i < 10000; i++) {
        var x = Math.random() * 2000 - 1000;
        var y = Math.random() * 2000 - 1000;
        var z = Math.random() * 2000 - 1000;
        starPositions.push(x, y, z);
        starColors.push(1, 1, 1);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
    this.starField = new THREE.Points(starsGeometry, starsMaterial);
    
    this.sceneRender.scene.add(this.starField);
  }

  animateStars(amplitudeScale) {

    var sunYPosition = this.gaussian_distribution(this.state.lst) * amplitudeScale
    var opacity = 1;

    // Fade stars around sunrise
    if (sunYPosition >= this.state.sunrise) {
      const diff = sunYPosition - this.state.sunrise;
      const range = 18 - this.state.sunrise;
      opacity = 1 - (diff / range) * 0.99;
    }

    this.starField.material.transparent = true;
    this.starField.material.opacity = opacity;
    this.starField.position.x += 1;
    this.starField.position.y += 1;
  }

  setSun(amplitudeScale) {
        
    // parameters
    var radius = 0.5
    var sunScale = 2
    var sunXPosition = this.state.lst
    var sunYPosition = this.gaussian_distribution(this.state.lst) * amplitudeScale
    this.setState({
      maxSunYPosition: Math.max(this.state.maxSunYPosition, sunYPosition)
    })
    var sunriseYPosition = this.gaussian_distribution(this.state.sunrise) * amplitudeScale
    var sunsetYPosition = this.gaussian_distribution(this.state.sunset) * amplitudeScale
        
    // set sun fill
    if (sunYPosition < this.gaussian_distribution(this.state.sunset) * amplitudeScale) {
      var sunGeometry = new THREE.TorusGeometry(radius, 0.035, 10, 100)
    }
    else {
      var sunGeometry = new THREE.SphereGeometry(radius, 32, 32)
    }
        
    // plot sun position as as sphere
    const sun = new THREE.Mesh(
      sunGeometry, // geometry
      new THREE.ShaderMaterial({
        vertexShader: sunVertex,
        fragmentShader: sunFragment,
        uniforms: {
          sunPosition: {
            value: [sunXPosition, sunYPosition]
          },
        }
      })
    )

    sun.position.set(sunXPosition, sunYPosition, 0);
    sun.scale.set(radius * sunScale, radius * sunScale, 0)
    this.sceneRender.scene.add(sun);
          

    var atmosphereColor1 = new THREE.Color(0.32, 0.34, 0.34);
    var atmosphereColor2 = new THREE.Color(0.46, 0.71, 0.94);
    var atmosphereColor3 = new THREE.Color(0.25, 0.32, 0.45);

    var currentColor = new THREE.Color();

    if (sunXPosition <= 12) {
      var factor = sunXPosition / 12;
      var atmosphereColor = currentColor.lerpColors(atmosphereColor1, atmosphereColor2, factor);
    } else {
        var factor = (sunXPosition - 12) / 12;
        var atmosphereColor = currentColor.lerpColors(atmosphereColor2, atmosphereColor3, factor);
    }


    var atmosphereScale = 5
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 32, 32),
      new THREE.ShaderMaterial({
        uniforms: {
          color: { value: atmosphereColor },
          radius: { value: 0.5 },
        },
        vertexShader: atmosphereVertex,
        fragmentShader: atmosphereFragment,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      })
    )
    atmosphere.material.transparent = true;
    atmosphere.position.set(sunXPosition, sunYPosition, -1);
    if (sunYPosition >= 3) {
      atmosphere.scale.set(
        (radius * atmosphereScale) + (sunYPosition), 
        (radius * atmosphereScale) + (sunYPosition),
        0.1
      )
    }
    this.sceneRender.scene.add(atmosphere);
                    
    // horison       
    if (sunXPosition < 12) {
      var horizonColor = new THREE.Vector4(0.953, 0.906, 0.427, 1 * Math.abs(sunXPosition));
      var time = this.state.sunrise;
    }
    else {
      var horizonColor = new THREE.Vector4(0.788, 0.106, 0.149, 1 * Math.abs(sunXPosition));
      var time = this.state.sunset;
    }
    
    const horizon = new THREE.Mesh(
      new THREE.SphereGeometry(0.6 * Math.abs(sunYPosition), 32, 1), // geometry
      new THREE.ShaderMaterial({
        vertexShader: horizonVertex,
        fragmentShader: horizonFragment,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        uniforms: {
          horizonColor: { value: horizonColor },
          sunriseTime: { value: time },
          sunYPosition: { value: sunYPosition },
          fadeThreshold: { value: 0.2 } 
        }
      })
    )
    horizon.material.transparent = true;
                
    // sunrise and sunset
    if (sunYPosition >= (sunriseYPosition - 2) & sunYPosition < (sunsetYPosition + 2)) {
      horizon.position.set(sunXPosition, 0, -2);
      // sunrise fade in
      if (sunYPosition >= this.state.sunrise & sunXPosition < 12) {
        var diffuse = Math.log(10 - sunYPosition ) + 1;
      }
      // sunset fade out
      if (sunYPosition <= this.state.sunset & sunXPosition > 12) {
        var diffuse = Math.log(10 - sunYPosition) + 1;
      }
      horizon.scale.set(8, diffuse * 1.3, 0)
      this.sceneRender.scene.add(horizon);
    }
                  
    // render
    this.sceneRender.renderer.render(
      this.sceneRender.scene, 
      this.sceneRender.camera
    )   
    
    // remove previous scene
    this.sceneRender.scene.remove(sun);
    this.sceneRender.scene.remove(atmosphere);
    //this.sceneRender.scene.remove(horizon);
    if (sunYPosition >= this.state.sunrise - 0.2 & sunYPosition <= this.state.sunset - 0.2) {
      this.sceneRender.scene.remove(horizon);
    }
  }
                
  componentWillUnmount() {
    clearInterval(this.animate);
    clearInterval(this.position);
  }
                
  componentDidMount() {  
    
    var amplitudeScale = 200
    var animateFlag = 1
    
    this.init()
    this.calculateSolarSettings()
    this.setSolarElevationPlot(amplitudeScale)
    this.setHorizon(amplitudeScale)
    this.setStars()
    
    // animate and render
    const startTime = this.state.currentTime // current time
    if ( animateFlag ) {
      var i = 0 
      this.animate = setInterval(() => {
        this.animatePosition(i += 0.1, startTime, amplitudeScale)
      }, 22);

      this.animate = setInterval(() => {
        this.animateStars(amplitudeScale)
      }, 10);
      
      // update position every minute
      this.position = setInterval(() => {
        this.updatePosition(amplitudeScale)
      }, 60000);
    } else {
      this.setState({
        lst: this.state.currentTime
      })
      this.setSun(amplitudeScale)
    }
  }
    
  render() {
    return (
      <>
        <div id="container" class="w-full h-full rounded-xl">
          <canvas height="300" width="300" class="w-full h-full rounded-xl" id="canvas"/>
        </div>
      </>
    );
  }
}
export default SolarGraph
