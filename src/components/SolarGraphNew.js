
import React from "react";
import * as THREE from "three";



//var vertexShader = require('../assets/shader/vertex.glsl')
/* eslint import/no-webpack-loader-syntax: off */
import vertexShader from '!!raw-loader!../assets/shader/vertex.glsl'
//import fragmentShader from '!!raw-loader!../assets/shader/fragment.glsl'

console.log(vertexShader)

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

        this.drawingConstructs = {
            gl: null,
            program: null,
            frame: null,
            colours: null,
            sun_altitude_curve: null,
            altitude_curve_colours: null,
            horison: null,
            horison_colours: null,
            width: 0,
            height: 0
        }
        this.vert = `
            void main() {
                gl_Position = projectionMatrix * modelViewMatrix  * vec4(position, 1.0);
            }
        `

        this.frag = `
        void main() {
            gl_FragColor = vec4(1, 0, 0, 1);
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
        camera.position.set(12, 2, 30); // [x: solar noon y: None z: camera zoom]

        //const pointLight = new THREE.PointLight(0xffffff);
        //pointLight.position.set(5, 5, 5);

        //const ambientLight = new THREE.AmbientLight(0xffffff);
        //scene.add(pointLight, ambientLight);

        // create a white solar day angle chart
        var material = new THREE.LineBasicMaterial({ color: 0xf0ebd8, linewidth: 10, fog: true});
        var amplitudeScale = 0.15 // need to adjust the amplitude of solarElevationAngleArray (can also exclude this and change z-axis below)
        var points = [];
        for (var j = 0; j < this.state.lstArray.length; j++) {
            points.push( new THREE.Vector3(this.state.lstArray[j], this.rad2deg(this.state.solarElevationAngleArray[j] * amplitudeScale), 0));
        }
        var geometry = new THREE.BufferGeometry().setFromPoints(points);
        var line = new THREE.Line(geometry, material);
        scene.add(line);


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
        if (this.rad2deg(this.state.solarElevationAngle) != 0) {
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

        console.log(this.frag)
        // plot sun position as as sphere
        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.7, 32, 32), // geometry
            //new THREE.MeshBasicMaterial({ 
                //color: 0xf0ebd8
                //map: new THREE.TextureLoader().load('../assets/img/sun_uv.jpeg')
            //}),
            //solarMaterial
            new THREE.ShaderMaterial({
                vertexShader: this.vert,
                fragmentShader: this.frag
            })
        )


        //vertexShader: fs.readFileSync(path.join(__dirname, 'vertex.glsl'), 'utf8'),
        //fragmentShader: fs.readFileSync(path.join(__dirname, 'fragment.glsl'), 'utf8'),
        
        //console.log(this.rad2deg(this.state.solarElevationAngle))
        //console.log(this.state.lst)
        var solarTime = this.linspace(0, this.state.lst, 100)
        var solarAngle = this.linspace(this.state.solarElevationAngleArray[0], this.state.solarElevationAngle , 100)
        sphere.position.set(this.state.lst, this.rad2deg(this.state.solarElevationAngle * amplitudeScale), 0);
        scene.add(sphere);
        ///for (var i = 0; i < solarTime.length; i ++) {
            //sphere.position.set(this.state.lst, this.rad2deg(this.state.solarElevationAngle * amplitudeScale), 0);
        //    sphere.position.set(solarTime[i], this.rad2deg(solarAngle[i] * amplitudeScale), 0);
        //}

        //vec4 horison_colour;
        //vec4 sky_colour = vec4(0.529411765, 0.807843137, 0.980392157, 1);
        //vec4 sunlight_colour = vec4(1.0, 1.0, 1.0, 1.0);
        //vec4 sunrise_colour = vec4(0.953, 0.906, 0.427, 1.0);
        //vec4 sunset_colour = 1.2 * vec4(0.788, 0.106, 0.149, 1.0);


        // // // //
        // WEB GL
        // // // // 
        /*
        var canvas = document.getElementById("canvas");
        
        // set size of canvas to be the size of viewport
        canvas.height = 318//window.innerHeight;
        canvas.width = 325//window.innerWidth;

        this.drawingConstructs.width = 10000//canvas.offsetWidth;
        this.drawingConstructs.height = 10000//canvas.offsetHeight;

        //var gl = canvas.getContext("webgl");
        //gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        //this.resizeCanvasToDisplaySize(gl.canvas);
        //gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        
        // clear canvas
        //gl.clearColor(0, 0, 0, 1);
        //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // compile shaders
        //var program = this.create_shaders(gl)
        //gl.useProgram(program);

        //this.drawingConstructs.program = program;
        this.drawingConstructs.gl = gl;

        // creates a black background for the scene to render on
        // consists of two black triangles
        this.drawingConstructs.frame = [-1, -1,    
                                         1, -1,    
                                         1,  1,
                                        -1, -1,  
                                        -1,  1,    
                                         1,  1 ];
        this.drawingConstructs.colors = [0, 0, 0,   
                                         0, 0, 0,   
                                         0, 0, 0,   
                                         0, 0, 0,   
                                         0, 0, 0,   
                                         0, 0, 0];

        // calculate sun's altitude curve (path in the sky) using day of year and longitude
        var xValues = this.linspace(-1, 1, this.state.solarElevationAngleArray.length)
        for (var i = 0; i < this.state.solarElevationAngleArray.length; i++) {
            this.state.xyValues.push(xValues[i]) // x axis values
            this.state.xyValues.push(this.state.solarElevationAngleArray[i]) // y axis values

            this.drawingConstructs.altitudeCurveColors.push(0.5)
            this.drawingConstructs.altitudeCurveColors.push(0.5)
            this.drawingConstructs.altitudeCurveColors.push(0.5)
        }

        // create a single line for horizon in the middle of the screen
        console.log('sunrise: ' + this.state.sunRise)
        console.log('sunset: ' + this.state.sunSet)
        this.drawingConstructs.horison = [-1, this.state.sunRise, 1, this.state.sunRise]
        this.drawingConstructs.horisonColors = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5]

        // clear canvas
        var gl = this.drawing_constructs.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        // set up attributes and uniforms for use with shaders
        let a_Position = gl.getAttribLocation(this.drawing_constructs.program, "a_Position");
        let a_Colour = gl.getAttribLocation(this.drawing_constructs.program, "a_Colour");
        let sun_position = gl.getUniformLocation(this.drawing_constructs.program, "sun_position");
        let aspect_ratio = gl.getUniformLocation(this.drawing_constructs.program, "aspect_ratio");
        let sun_altitude_scale = gl.getUniformLocation(this.drawing_constructs.program, "altitude_scale");
        
        // define buffers for blask background
        let vertex_buffer = this.create_buffer(gl, this.drawing_constructs.frame);
        let colour_buffer = this.create_buffer(gl, this.drawing_constructs.colours);
        
        // set altitude scale
        var altitude_scale = 0.8
        gl.uniform1f(sun_altitude_scale, altitude_scale);

        //set aspect ratio
        gl.uniform2f(aspect_ratio, this.drawing_constructs.width / this.drawing_constructs.height, 1.0);

        // set sun position
        //gl.uniform2f(sun_position, this.state.current_position[0], this.state.current_position[1]);

        // draw background
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.bindBuffer(gl.ARRAY_BUFFER, colour_buffer);
        gl.vertexAttribPointer(a_Colour, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Colour);
        
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        

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
        
        //console.log(sunlight_scale)
        */

        // render
        renderer.render(scene, camera)
        
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