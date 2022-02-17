
import React from "react";
import * as THREE from "three";

// import shaders
//import glsl from '../assets/shader/glsl.js'
//import vertex from '../assets/shader/vertex.glsl'
//import fragmentShader from '../assets/shader/fragment.glsl'

//loader.load('../assets/shader/vertex.glsl',function ( data ) {vertex =  data;},);
//loader.load('plaid.vert',function ( data ) {avertex =  data;},);

// Useful documents
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

        this.sceneRender = {
            camera: null,
            scene: null,
            renderer: null
        }

        const glsl = x => x.toString();

        this.vert = glsl`
            varying vec3 vertexNormal;
            varying vec3 sunPosition;
            varying vec2 vertPosition;

            void main() {
                vertexNormal = normal;
                sunPosition = vec3(position);
                vertPosition = vec2(position);
                gl_Position = projectionMatrix * modelViewMatrix  * vec4(position, 1.0);
            }
        `

        this.frag = glsl`
            precision mediump int;
            precision highp float;

            varying vec3 vertexNormal;
            varying vec3 sunPosition;
            varying vec2 vertPosition;

            void main() {
                vec4 background = vec4(1.0, 1.0, 1.0, 1.0);
                gl_FragColor = background;
            }
        `
        

    this.vert2 = glsl`
        attribute vec2 a_Position;
        attribute vec3 a_Colour;

        uniform vec2 solarPosition;
        varying vec4 vertColor;
        varying vec2 vertPosition;

        void main() {
            gl_Position = vec4(a_Position, 0.0, 1.0);
            vertColor = vec4(a_Colour, 1.0);
            vertPosition = a_Position;
        }
    `

    this.frag2 = glsl`
        precision mediump int;
        precision highp float;
        
        uniform vec2 solarPosition;
        varying vec4 vertColor;
        varying vec2 vertPosition;

        float sunlight_scale(float distance, float radius, vec2 position){
            // blue surrounding around the sun
            // only above horizon
            if(position.y < 0.0){
                return 0.0;
            }
            if(distance/radius < 0.08){
                // constant scale close to sun
                return 0.6;
            } else if(distance/radius < 0.9){
                // use cosine for smooth reduction in intensity
                return 0.6 * (0.5 * cos(3.9 * distance / radius - 0.39) + 0.5);
            } else {
                // no sky past defined radius
                return 0.0;
            }
        }
        
        float sunScale(float distance, vec2 position){
            // intensity scale of main sun body
            if(position.y >= 0.0){
                // inverse square reduction
                return 0.003 / (distance * distance);
            } else if(distance >= 0.035 && distance <= 0.04){
                // sun's outline (only visible below horizon)
                return 1.0;
            } else {
                return 0.0;
            }
        }
        
        float sunFill(float distance, vec2 position){
            // remove sun's fill when below horizon leaving only circular outline
            if(position.y < 0.0 && distance <= 0.035){
                return 0.0;
            } else {
                return 1.0;
            }
        }

        float horison_sun_elevation_scale(vec2 sun){
            // lifts and drops horizon glow based on sun's altitude
            if(sun.y > -0.3 && sun.y <= 0.025){
                return 0.15 * pow(sun.y + 0.3, 2.0);
            } else if(sun.y > 0.025 && sun.y < 0.15){
                return 0.8 * pow(sun.y - 0.1705, 2.0);
            } else {
                return 0.0;
            }
        }
        
        float bell_curve(float x, float b, float c){
            // compute bell curve shape (subtract -0.04 to move it slightly below horison)
            return c * pow(2.718, - pow(x, 2.0) / b) - 0.04;
        }

        float horison_sunlight_scale(float distance, float radius, vec2 position){
            // provides smooth-ish glow on sunrise and sunset
            if(position.y < 0.0){
                return 0.0;
            }
            if(distance/radius < 0.01){
                return 1.0;
            } else if(distance/radius < 0.9){
                // use cosine similar to sunlight_scale
                return 1.0 * (0.5 * cos(3.9 * distance / radius - 0.2) + 0.5);
            } else {
                return 0.0;
            }
        }

        float horison_scale(vec2 position, vec2 sun, float radius){
            // uses bell curve create shape of horison's glow
            if(position.y < 0.0){
                return 0.0;
            }
            float b = 0.01;
            float c = horison_sun_elevation_scale(sun);
            float y = bell_curve(position.x - sun.x, b, c);
            
            if(position.y <= y){
                return 0.0;
            } else {
                float x;
                float newDistance;
                float distance = 0.2;
                // compute closest point to the bell curve
                for(int i = -100; i <= 100; ++i){
                    x = float(i) / 100.0;
                    y = bell_curve(x - sun.x, b, c);
                    
                    newDistance = length(position - vec2(x, y));
                    if(newDistance < distance){
                        distance = newDistance;
                    }
                }
                
                return (c / pow(distance, 2.0)) * horison_sunlight_scale(length(position - sun), 0.75, position);
            }
        }

        float adjust_sunlight_radius(float default_radius, float sun_altitude){
            float night_cutoff_altitude = 0.3090169943749474; // represents 18 degrees below horizon
            
            if(sun_altitude < 0.0 - night_cutoff_altitude){
                // no sunlight below 18 degrees
                return 0.0;
            }
            else if(sun_altitude < 0.0){
                // linearly interpolate so that sunlight is smoothly reducend until we reach 18 degrees below horizon
                return default_radius + (night_cutoff_altitude - default_radius) * abs(sun_altitude) / night_cutoff_altitude;
            }
            return default_radius;
        }
        

        void main() {
            //  vec4 oldSkyColor = vec4(0.30, 0.60, 1.0, 1);
            vec4 horisonColor;
            vec4 skyColor = vec4(0.529411765, 0.807843137, 0.980392157, 1);
            vec4 sunriseColor = vec4(0.953, 0.906, 0.427, 1.0);
            vec4 sunlightColor = vec4(1.0, 1.0, 1.0, 1.0);
            vec4 sunsetColor = 1.2 * vec4(0.788, 0.106, 0.149, 1.0);

            // distance from current pixel to sun's centre
            float distance = length(solarPosition - vertPosition);
            
            // adjust sunlight radius: default above horizon, shrinks as sun gets lower below horizon
            // completely invisible above horizon when the sun is 18 degreees delow horizon (night time)
            // 0.8 is default radius
            float radius = adjust_sunlight_radius(0.8, solarPosition.y); 

            if(solarPosition.x < 12.0){
                horisonColor = sunriseColor;
            } else {
                horisonColor = sunsetColor;
            }

            // fill sun above horizon
            vec3 background = vertColor.rgb * sunFill(distance, vertPosition);
            // blue outline around the sun representing sky
            vec3 sky = 1.0 * skyColor.rgb * sunlight_scale(distance, radius, vertPosition);
            // main sun
            vec3 sun = sunlightColor.rgb * sunScale(distance, vertPosition);
            // combine all colors to get final colour for this fragment
            
            //float intensity = pow(0.025 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            gl_FragColor = vec4(background +0.8 * sky + 0.4 * sun + horison_scale(vertPosition, solarPosition, radius)  * horisonColor.rgb * 0.3, 1.0);
        }
    `
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

    init() {
        this.sceneRender.scene = new THREE.Scene();
        this.sceneRender.scene.background = new THREE.Color(0x0d1321);

        this.sceneRender.camera = new THREE.PerspectiveCamera(45, 326 / 316, 1, 1000);
        this.sceneRender.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('canvas'),
            antialias: true,
        })
        this.sceneRender.renderer.setPixelRatio(window.devicePixelRatio);
        this.sceneRender.renderer.setSize(326, 316);
        this.sceneRender.camera.position.set(12, 2, 30); // [x: solar noon y: None z: camera zoom]

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
                uniforms: {
                    sunPosition: {
                        //value: [this.state.lst, this.rad2deg(this.state.solarElevationAngle * amplitudeScale)]
                        value: [12, 6]
                    },
                    //vertColor: {
                    //    value: let aColor = gl.getAttribLocation(drawing_constructs.program, "aColor");
                    //},
                }
            })
        )
        
        //const cubeGeometry = new THREE.BoxGeometry( 50, 50, 0 );
        //const cubeMaterial = new THREE.MeshBasicMaterial( {color: 0x000000} );
        cube.position.set(0, 0, -0.1);
        scene.add(cube);
    }

    setSolarElevationPlot() {
        // create a white solar day angle chart
        var amplitudeScale = 0.15 // need to adjust the amplitude of solarElevationAngleArray (can also exclude this and change z-axis below)
        var points = [];
        for (var j = 0; j < this.state.lstArray.length; j++) {
            points.push( new THREE.Vector3(this.state.lstArray[j], this.rad2deg(this.state.solarElevationAngleArray[j] * amplitudeScale), 0));
        }
        var line = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(points), 
            new THREE.LineBasicMaterial({ color: 0xf0ebd8, linewidth: 10, fog: true})
        );
        line.position.set(0, 0, 0);
        this.sceneRender.scene.add(line);
    }

    setHorizon() {
        // set horizon block
        const cube = new THREE.Mesh(
            new THREE.BoxGeometry( 100, 20, 0 ),
            new THREE.MeshBasicMaterial( {color: 0x0d1321} )
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

            starVertices.push(x, y, z);
        }

        const starGeometry = new THREE.BufferGeometry();
        starGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute(starVertices, 3 ));
        const starMaterial = new THREE.PointsMaterial( { color: 0x888888 } );
        const starPoints = new THREE.Points(starGeometry, starMaterial );
        this.sceneRender.scene.add(starPoints); 
    }

    setSun() {
        var amplitudeScale = 0.15 // need to adjust the amplitude of solarElevationAngleArray (can also exclude this and change z-axis below)
        // plot sun position as as sphere
        const sun = new THREE.Mesh(
            new THREE.SphereGeometry(0.35, 32, 32), // geometry
            new THREE.ShaderMaterial({
                vertexShader: this.vert,
                fragmentShader: this.frag,
                uniforms: {
                    sunPosition: {
                        value: [this.state.lst, this.rad2deg(this.state.solarElevationAngle * amplitudeScale)]
                    },
                }
            })
        )

        var solarTime = this.linspace(0, this.state.lst, 100)
        var solarAngle = this.linspace(this.state.solarElevationAngleArray[0], this.state.solarElevationAngle , 100)
        sun.position.set(this.state.lst, this.rad2deg(this.state.solarElevationAngle * amplitudeScale), 0);
        sun.scale.set(1, 1, 1)
        this.sceneRender.scene.add(sun);
        //for (var i = 0; i < solarTime.length; i ++) {
        //    sun.position.set(solarTime[i], this.rad2deg(solarAngle[i] * amplitudeScale), 0);
        //    this.sceneRender.scene.add(sun);
        //}

        // atmosphere
        const atmosphere = new THREE.Mesh(
            new THREE.SphereGeometry(1, 32, 32), // geometry
            new THREE.ShaderMaterial({
                vertexShader: this.vert2,
                fragmentShader: this.frag2,
                blending: THREE.AdditiveBlending,
                side: THREE.BackSide,
            })
        )

        atmosphere.position.set(this.state.lst, this.rad2deg(this.state.solarElevationAngle * amplitudeScale), 0);
        atmosphere.scale.set(8, 8, 8)
        this.sceneRender.scene.add(atmosphere);
    }

    componentDidMount() {
        this.calcCurrentSolarPosition() // get sun position
        this.calcSolarAngleArray()      // get sun trajectory 

        // Setup
        this.init()

        this.setSolarElevationPlot()
        this.setHorizon()
        if (this.rad2deg(this.state.solarElevationAngle) != 0) {
            this.setStars()
        }
        this.setSun()

        // render
        this.sceneRender.renderer.render(this.sceneRender.scene, this.sceneRender.camera)   
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