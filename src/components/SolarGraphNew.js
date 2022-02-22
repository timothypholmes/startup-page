
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
            void main() {
                gl_Position = projectionMatrix * modelViewMatrix  * vec4(position, 1.0);
            }
        `
        this.frag = glsl`
            void main() {
                vec4 background = vec4(1.0, 1.0, 1.0, 1.0);
                gl_FragColor = background;
            }
        ` 

        this.vert2 = glsl`
            varying vec3 vertexNormal;
            void main() {
                vertexNormal = normal;
                gl_Position = projectionMatrix * modelViewMatrix  * vec4(position, 1.0);
            }
        `

        this.frag2 = glsl`
            varying vec3 vertexNormal;
            void main() {
                float intensity = pow(0.025 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                gl_FragColor = vec4(0.529411765, 0.807843137, 0.980392157, 1) * intensity;
            }
        `

        this.vert3 = glsl`
        varying vec3 vertexNormal;
        void main() {
            vertexNormal = normal;
            gl_Position = projectionMatrix * modelViewMatrix  * vec4(position, 1.0);
        }
    `

        this.frag3 = glsl`
            varying vec3 vertexNormal;
            uniform vec4 horizonColor;
            void main() {
                float intensity = pow(0.025 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                gl_FragColor = horizonColor * intensity;
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
        this.sceneRender.camera.position.set(12, -2, 28); // [x: solar noon y: None z: camera zoom]

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

        // parameters
        var amplitudeScale = 0.15 // need to adjust the amplitude of solarElevationAngleArray (can also exclude this and change z-axis below)
        var radius = 1
        var sunScale = 0.5

        // set sun fill
        if (this.rad2deg(this.state.solarElevationAngle * amplitudeScale) < 0) {
            var sunGeometry = new THREE.TorusGeometry(radius, 0.1, 16, 100)
        }
        else {
            var sunGeometry = new THREE.SphereGeometry(radius, 32, 32)
        }
    
        // plot sun position as as sphere
        const sun = new THREE.Mesh(
            sunGeometry, // geometry
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
        sun.scale.set(radius * sunScale, radius * sunScale, radius * sunScale)
        this.sceneRender.scene.add(sun);
        //for (var i = 0; i < solarTime.length; i ++) {
        //    sun.position.set(solarTime[i], this.rad2deg(solarAngle[i] * amplitudeScale), 0);
        //    this.sceneRender.scene.add(sun);
        //}

        // atmosphere
        var atmosphereScale = 8
        const atmosphere = new THREE.Mesh(
            new THREE.SphereGeometry(radius, 32, 32), // geometry
            new THREE.ShaderMaterial({
                vertexShader: this.vert2,
                fragmentShader: this.frag2,
                blending: THREE.AdditiveBlending,
                side: THREE.BackSide,
            })
        )
        atmosphere.position.set(this.state.lst, this.rad2deg(this.state.solarElevationAngle * amplitudeScale), 0);
        atmosphere.scale.set(radius * atmosphereScale, radius * atmosphereScale, -radius * atmosphereScale)
        this.sceneRender.scene.add(atmosphere);

        console.log(this.rad2deg(this.state.solarElevationAngle * amplitudeScale))
        //horison
        if (this.rad2deg(this.state.solarElevationAngle * amplitudeScale) > - 1.5 & this.rad2deg(this.state.solarElevationAngle * amplitudeScale) < 1.5) {
            if (this.state.lst < 12) {
                var horizonColor = new THREE.Vector4(0.953, 0.906, 0.427, 1.0);
            }
            else {
                var horizonColor = new THREE.Vector4(0.788, 0.106, 0.149, 1.0);
            }

            const horizon = new THREE.Mesh(
                new THREE.SphereGeometry(radius, 32, 32), // geometry
                new THREE.ShaderMaterial({
                    vertexShader: this.vert3,
                    fragmentShader: this.frag3,
                    blending: THREE.AdditiveBlending,
                    side: THREE.BackSide,
                    uniforms: {horizonColor: {value: horizonColor}}
                })
            )
            horizon.position.set(this.state.lst, 0, -5);
            horizon.scale.set(7.5, 1.5, 0)
            this.sceneRender.scene.add(horizon);
        }
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