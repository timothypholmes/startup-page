
import React from "react";
import * as THREE from "three";
import { useFrame } from '@react-three/fiber'

// import shaders
import atmosphereVertex from '../assets/shader/atmosphereVertex.glsl'
import atmosphereFragment from '../assets/shader/atmosphereFragment.glsl'
import horizonVertex from '../assets/shader/horizonVertex.glsl'
import horizonFragment from '../assets/shader/horizonFragment.glsl'
import sunVertex from '../assets/shader/sunVertex.glsl'
import sunFragment from '../assets/shader/sunFragment.glsl'

// Useful documents
// https://solarsena.com/solar-elevation-angle-altitude/
// https://www.pveducation.org/pvcdrom/properties-of-sunlight/elevation-angle

var BACKGOUND = 0x000000

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
            daysInYear: 1,//Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)), // current day # 
            currentlst: (((now.getHours() * 60) + now.getMinutes()) / 60),              
            lst: 0,
            lstArray: this.linspace(0, 24, 1000),//1440),
            declinationAngle: 0,
            hourAngle: 0,
            hourAngleArray: [],
            solarElevationAngle: 0,
            solarElevationAngleArray: [],
            sunRise: 0,
            sunSet: 0,
            xyValues: []
        }

        this.sceneRender = {
            camera: null,
            scene: null,
            renderer: null
        }
    }

    animatePosition(lst, startTime, amplitudeScale) {
        if (lst < startTime) {
            this.calcCurrentSolarPosition(lst) 
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
        this.calcCurrentSolarPosition(this.state.currentlst) 
        this.setSun(amplitudeScale)
    }

    getCurrentlst() {
        var now = new Date();
        this.currentlst = (((now.getHours() * 60) + now.getMinutes()) / 60)
    }
    
    calcCurrentSolarPosition(lst) {
        this.state.declinationAngle = this.deg2rad(-23.44) * Math.cos(this.deg2rad(360/365 * (this.state.daysInYear + 10)))
        this.state.hourAngle = this.deg2rad(15 * (lst - 12)) // in degrees

        var LSTM = this.deg2rad(15) * this.deg2rad(105)
        var B = 360/365 * (this.state.daysInYear - 81)
        var EoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B)
        var TC = 4 * (this.state.latitude - LSTM) + EoT

        var sunRiseTime = 12 - (1/23.44) * Math.acos(-Math.tan(this.state.latitude) * Math.tan(this.state.declinationAngle)) - TC/60
        var sunSetTime = 12 + (1/23.44) * Math.acos(-Math.tan(this.state.latitude) * Math.tan(this.state.declinationAngle)) - TC/60

        var hourAngleSunRise = 23.44 * (sunRiseTime - 12)
        var hourAngleSunSet = 23.44 * (sunSetTime - 12)

        this.state.sunRise = Math.asin(Math.sin(this.state.latitude) * Math.sin(this.state.declinationAngle) 
            + Math.cos(this.state.latitude) * Math.cos(this.state.declinationAngle) * Math.cos(hourAngleSunRise))
        this.state.sunSet = Math.asin(Math.sin(this.state.latitude) * Math.sin(this.state.declinationAngle) 
            + Math.cos(this.state.latitude) * Math.cos(this.state.declinationAngle) * Math.cos(hourAngleSunSet))

        this.state.solarElevationAngle = Math.asin(Math.sin(this.state.latitude) * Math.sin(this.state.declinationAngle) 
            + Math.cos(this.state.latitude) * Math.cos(this.state.declinationAngle) * Math.cos(this.state.hourAngle))

        console.log(this.state)
    }

    calcSolarAngleArray() {        
        this.state.declinationAngle = this.deg2rad(-23.44) * Math.cos(this.deg2rad(360/365 * (this.state.daysInYear + 10)))
        for (var i = 0; i < this.state.lstArray.length; i++) {
            this.state.hourAngleArray.push(this.deg2rad(15 * (this.state.lstArray[i] - 12)))
        }
        for (var j = 0; j < this.state.lstArray.length; j++) {
            this.state.solarElevationAngleArray.push(Math.asin((Math.sin(this.state.latitude) * Math.sin(this.state.declinationAngle))
                + (Math.cos(this.state.latitude) * Math.cos(this.state.declinationAngle) * Math.cos(this.state.hourAngleArray[j]))))
        }
        console.log(this.state.solarElevationAngleArray)
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

        const canvasContainer = document.querySelector('canvas')

        this.sceneRender.scene = new THREE.Scene();
        this.sceneRender.scene.background = new THREE.Color(BACKGOUND);

        this.sceneRender.camera = new THREE.PerspectiveCamera(
            75, 
            canvasContainer.offsetWidth / canvasContainer.offsetHeight,
            0.1, 
            1000);
        this.sceneRender.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('canvas'),
            antialias: true,
        })

        this.sceneRender.renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
        this.sceneRender.renderer.setPixelRatio(window.devicePixelRatio);

        //this.sceneRender.renderer.setPixelRatio(window.devicePixelRatio);
        //this.sceneRender.renderer.setSize(326, 316);
        this.sceneRender.camera.position.set(12, 0, 15); // [x: solar noon y: None z: camera zoom]

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
            points.push( new THREE.Vector3(this.state.lstArray[j], this.rad2deg(this.state.solarElevationAngleArray[j] * amplitudeScale), 0));
        }
        var line = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(points), 
            new THREE.LineBasicMaterial({ color: 0xf0ebd8, fog: true})
        );
        line.position.set(0, 0, 0);
        this.sceneRender.scene.add(line);
    }

    setHorizon() {
        // set horizon block
        const cube = new THREE.Mesh(
            new THREE.BoxGeometry( 100, 20, 0 ),
            new THREE.MeshBasicMaterial( {color: BACKGOUND} )
        )
        cube.position.set(0, -10, -1);
        this.sceneRender.scene.add(cube);


        // create a white horizon line
        var solarLineMaterial = new THREE.LineBasicMaterial( { color: 0xf0ebd8} )
        const solarLinePoints = []
        solarLinePoints.push( new THREE.Vector3( 0, 0, 0 ) )
        solarLinePoints.push( new THREE.Vector3( 24, 0, 0 ) )
        var solarLineGeometry = new THREE.BufferGeometry().setFromPoints(solarLinePoints)
        var solarLine = new THREE.Line(solarLineGeometry, solarLineMaterial)
        this.sceneRender.scene.add(solarLine)
    }

    setStars() {
        // plot stars (only before sunrise or after sunset)    
        
        const starVertices = [];
        for (let i = 0; i < 10000; i ++) {

            const x = THREE.MathUtils.randFloatSpread(1000);
            const y = THREE.MathUtils.randFloatSpread(1000);
            const z = THREE.MathUtils.randFloatSpread(1000);

            starVertices.push(x, y, -1 * Math.abs(z));
        }

        //const starGeometry = new THREE.BufferGeometry();
        const starGeometry = new THREE.BufferGeometry();
        starGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute(starVertices, 3 ));
        const starMaterial = new THREE.PointsMaterial( { color: 0xDDDDDD } );
        const starPoints = new THREE.Points(starGeometry, starMaterial);
        this.sceneRender.scene.add(starPoints); 

    }

    setSun(amplitudeScale) {

        // parameters
        var radius = 1
        var sunScale = 0.5
        //var sunYPosition = this.rad2deg(this.state.solarElevationAngle * amplitudeScale)
        //var sunXPosition = this.state.lst
        //var sunXPosition = x
        var sunYPosition = this.rad2deg(this.state.solarElevationAngle * amplitudeScale)
        

        // set sun fill
        if (sunYPosition < 0) {
            var sunGeometry = new THREE.TorusGeometry(radius, 0.1, 16, 100)
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
                        value: [this.state.lst, sunYPosition]
                    },
                }
            })
        )
        sun.position.set(this.state.lst, sunYPosition, 0);
        sun.scale.set(radius * sunScale, radius * sunScale, radius * sunScale)
        this.sceneRender.scene.add(sun);
        

        // atmosphere
        var atmosphereScale = 8
        const atmosphere = new THREE.Mesh(
            new THREE.SphereGeometry(radius, 32, 32), // geometry
            new THREE.ShaderMaterial({
                vertexShader: atmosphereVertex,
                fragmentShader: atmosphereFragment,
                blending: THREE.AdditiveBlending,
                side: THREE.BackSide,
            })
        )
        atmosphere.position.set(this.state.lst, sunYPosition, -3);
        atmosphere.scale.set(radius * atmosphereScale, radius * atmosphereScale, 0)
        this.sceneRender.scene.add(atmosphere);


        // horison       
        if (this.state.lst < 12) {
            var horizonColor = new THREE.Vector4(0.953, 0.906, 0.427, 1.0);
        }
        else {
            var horizonColor = new THREE.Vector4(0.788, 0.106, 0.149, 1.0);
        }

        const horizon = new THREE.Mesh(
            new THREE.SphereGeometry(radius, 32, 32), // geometry
            new THREE.ShaderMaterial({
                vertexShader: horizonVertex,
                fragmentShader: horizonFragment,
                blending: THREE.AdditiveBlending,
                //side: THREE.BackSide,
                uniforms: {horizonColor: {value: horizonColor}}
            })
        )

        if (sunYPosition > - 1.5 & sunYPosition < 1.5) {
            var diffuse = 2/(2 * Math.pi)^(1/2) * Math.exp(-2 * Math.abs(sunYPosition)^2) 
            horizon.position.set(this.state.lst, 0, -3);
            horizon.scale.set(10, 1.5, 0)
            this.sceneRender.scene.add(horizon);
        }
        
        // render
        this.sceneRender.renderer.render(this.sceneRender.scene, this.sceneRender.camera)   

        // remove previous scene
        this.sceneRender.scene.remove(sun);
        this.sceneRender.scene.remove(atmosphere);
        if (sunYPosition > - 1.5 & sunYPosition < 2.5) {
            this.sceneRender.scene.remove(horizon);
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        clearInterval(this.position);
    }

    componentDidMount() {  
        if (navigator.geolocation) { // get location
            navigator.geolocation.getCurrentPosition((position) => {
                this.getLocation(position.coords.latitude, position.coords.longitude);
            });
        }
        
        var amplitudeScale = 0.1
        var animateFlag = 0

        this.calcSolarAngleArray()      // get sun trajectory 
        
        this.init()
        this.setSolarElevationPlot(amplitudeScale)
        this.setHorizon()
        this.setStars()
        
        // animate and render
        const startTime = this.state.currentlst // current time
        var i = 0 
        this.animate = setInterval(() => {
            this.animatePosition(i += 0.1, startTime, amplitudeScale)
        }, 30);

        // update position every minute
        this.position = setInterval(() => {
            this.updatePosition(amplitudeScale)
        }, 60000);
    }

	render() {
        return (
          <>
            <canvas class="w-full h-full rounded-xl" id="canvas"/>
          </>
        );
      }
}

export default SolarGraph