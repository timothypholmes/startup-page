
import React from "react";
import * as THREE from "three";

// import shaders
/* eslint import/no-webpack-loader-syntax: off */
import vertexShader from 'raw-loader!../assets/shader/vertex.glsl'
import fragmentShader from 'raw-loader!../assets/shader/fragment.glsl'

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

        this.vert = `
            varying vec3 vertexNormal;
            void main() {
                vertexNormal = normal;
                gl_Position = projectionMatrix * modelViewMatrix  * vec4(position, 1.0);
            }
        `

        this.frag = `
            varying vec3 vertexNormal;
            void main() {
                vec4 horisonColor;
                vec4 skyColor = vec4(0.529411765, 0.807843137, 0.980392157, 1);
                vec4 sunlightColor = vec4(1.0, 1.0, 1.0, 1.0);
                vec4 sunriseColor = vec4(0.953, 0.906, 0.427, 1.0);
                vec4 sunsetColor = 1.2 * vec4(0.788, 0.106, 0.149, 1.0);

                float intensity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0));
                vec3 atmosphere = vec3(0.3, 0.6, 1.0) * pow(intensity, 0.5);
                gl_FragColor = vec4(atmosphere, 1.0);
            }
        `

        this.vert2 = `
        varying vec3 vertexNormal;
        void main() {
            vertexNormal = normal;
            gl_Position = projectionMatrix * modelViewMatrix  * vec4(position, 1.0);
        }
    `

        this.frag2 = `
        varying vec3 vertexNormal;
        void main() {
            //vec4 horisonColor;
            //vec4 skyColor = vec4(0.529411765, 0.807843137, 0.980392157, 1);
            //vec4 sunlightColor = vec4(1.0, 1.0, 1.0, 1.0);
            //vec4 sunriseColor = vec4(0.953, 0.906, 0.427, 1.0);
            //vec4 sunsetColor = 1.2 * vec4(0.788, 0.106, 0.149, 1.0);
            
            float intensity = pow(0.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
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

    createBackground() {
        // set black background
        /*
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
        */
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
        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.7, 32, 32), // geometry
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
        sphere.position.set(this.state.lst, this.rad2deg(this.state.solarElevationAngle * amplitudeScale), 0);
        this.sceneRender.scene.add(sphere);
        /*for (var i = 0; i < solarTime.length; i ++) {
            sphere.position.set(solarTime[i], this.rad2deg(solarAngle[i] * amplitudeScale), 0);
        }*/

        // atmosphere
        const sphere2 = new THREE.Mesh(
            new THREE.SphereGeometry(0.7, 32, 32), // geometry
            new THREE.ShaderMaterial({
                vertexShader: this.vert2,
                fragmentShader: this.frag2,
                blending: THREE.AdditiveBlending,
                side: THREE.BackSide,
            })
        )

        sphere2.position.set(this.state.lst, this.rad2deg(this.state.solarElevationAngle * amplitudeScale), 0);
        sphere2.scale.set(10, 10, 10)
        this.sceneRender.scene.add(sphere2);
    }

    componentDidMount() {
        this.calcCurrentSolarPosition() // get sun position
        this.calcSolarAngleArray()      // get sun trajectory 

        // Setup
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

        // create a white solar day angle chart
        var material = new THREE.LineBasicMaterial({ color: 0xf0ebd8, linewidth: 10, fog: true});
        var amplitudeScale = 0.15 // need to adjust the amplitude of solarElevationAngleArray (can also exclude this and change z-axis below)
        var points = [];
        for (var j = 0; j < this.state.lstArray.length; j++) {
            points.push( new THREE.Vector3(this.state.lstArray[j], this.rad2deg(this.state.solarElevationAngleArray[j] * amplitudeScale), 0));
        }
        var geometry = new THREE.BufferGeometry().setFromPoints(points);
        var line = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(points), 
            new THREE.LineBasicMaterial({ color: 0xf0ebd8, linewidth: 10, fog: true})
        );
        line.position.set(0, 0, 0);
        this.sceneRender.scene.add(line);


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