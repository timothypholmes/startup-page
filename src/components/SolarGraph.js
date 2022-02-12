
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
        
        // everything required to draw the scene
        this.drawingConstructs = {
            gl: null,
            program: null,
            frame: null,
            colors: [],
            altitudeCurveColors: [],
            horison: null,
            horisonColors: null,
            width: 0,
            height: 0
        }
        
        this.vert_source = `
            attribute vec2 aPosition;
            attribute vec3 aColor;
            uniform vec2 solarPosition;
            varying vec4 vert_colour;
            varying vec2 vert_position;
            void main(void){
                gl_Position = vec4(aPosition, 0.0, 1.0);
                vert_colour = vec4(aColor, 1.0);
                vert_position = aPosition;
            }
        `;

        this.frag_source = `
            precision mediump int;
            precision highp float;
            uniform float altitude_scale;
            uniform vec2 aspectRatio;
            uniform vec2 solarPosition;
            varying vec4 vert_colour;
            varying vec2 vert_position;
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
            float sun_scale(float distance, vec2 position){
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
            float sun_fill(float distance, vec2 position){
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
                    
                    return (c / pow(distance, 2.0)) * horison_sunlight_scale(length(position - sun), 0.75 / aspectRatio.x, position);
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
            void main(void){
                vec4 horison_colour;
                vec4 sky_colour = vec4(0.529411765, 0.807843137, 0.980392157, 1);
                vec4 sunlight_colour = vec4(1.0, 1.0, 1.0, 1.0);
                vec4 sunrise_colour = vec4(0.953, 0.906, 0.427, 1.0);
                vec4 sunset_colour = 1.2 * vec4(0.788, 0.106, 0.149, 1.0);
                
                // distance from current pixel to sun's centre
                float distance = length(solarPosition * aspectRatio - vert_position * aspectRatio);
                
                // adjust sunlight radius: default above horizon, shrinks as sun gets lower below horizon
                // completely invisible above horizon when the sun is 18 degreees delow horizon (night time)
                // 0.8 is default radius
                float radius = adjust_sunlight_radius(0.8, solarPosition.y / altitude_scale); 
                
                // change horizon colour to sunrise (before solar noon), sunset (after solar noon)
                if(solarPosition.x < 0.0){
                    horison_colour = sunrise_colour;
                } else {
                    horison_colour = sunset_colour;
                }
                // fill sun above horizon
                vec3 background = vert_colour.rgb * sun_fill(distance, vert_position * aspectRatio);
                // blue outline around the sun representing sky
                vec3 sky = 1.0 * sky_colour.rgb * sunlight_scale(distance, radius, vert_position * aspectRatio);
                // main sun
                vec3 sun = sunlight_colour.rgb * sun_scale(distance, vert_position * aspectRatio);
                // combine all colors to get final colour for this fragment
                gl_FragColor = vec4(background + 0.8 * sky + 0.4 * sun + horison_scale(vert_position, solarPosition, radius) * horison_colour.rgb * 0.3, 1.0);
            }
        `;
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

    // 2d render
    create_shaders(gl) {
        // create shaders
        var vert = gl.createShader(gl.VERTEX_SHADER);
        var frag = gl.createShader(gl.FRAGMENT_SHADER);
        var program = gl.createProgram();
    
        gl.shaderSource(vert, this.vert_source);
        gl.shaderSource(frag, this.frag_source);
    
        // compile shaders
        gl.compileShader(vert);
        gl.compileShader(frag);
    
        // shader error handling
        if(!gl.getShaderParameter(vert, gl.COMPILE_STATUS) || !gl.getShaderParameter(frag, gl.COMPILE_STATUS)){
            console.error(gl.getShaderInfoLog(vert));
            console.error(gl.getShaderInfoLog(frag));
            throw new Error("Failed to compile shader");
        }
    
        // attach shaders to a program
        gl.attachShader(program, vert);
        gl.attachShader(program, frag);
        gl.linkProgram(program);
    
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(program))
            throw new Error('Failed to link program')
        }
    
        return program;
    }

    // init with the default canvas size
    


    resizeCanvasToDisplaySize(canvas) {
        const canvasToDisplaySizeMap = new Map([[canvas, [318, 325]]]);
        // Get the size the browser is displaying the canvas in device pixels.
        const [displayWidth, displayHeight] = canvasToDisplaySizeMap.get(canvas);
        
        // Check if the canvas is not the same size.
        const needResize = canvas.width  !== displayWidth || 
                            canvas.height !== displayHeight;
        
        if (needResize) {
            // Make the canvas the same size
            canvas.width  = displayWidth;
            canvas.height = displayHeight;
        }
        
        return needResize;
    }

    setup() {

        var canvas = document.getElementById("canvas");
        
        // set size of canvas to be the size of viewport
        canvas.height = 318//window.innerHeight;
        canvas.width = 325//window.innerWidth;

        this.drawingConstructs.width = 10000//canvas.offsetWidth;
        this.drawingConstructs.height = 10000//canvas.offsetHeight;

        let gl = canvas.getContext("webgl");
        //gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        //this.resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        
        // clear canvas
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // compile shaders
        var program = this.create_shaders(gl)
        gl.useProgram(program);

        this.drawingConstructs.program = program;
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
    }

    create_buffer(gl, data){
        // initialise buffer for drawing
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        return buffer;
    }

    draw() {

        // clear canvas
        let gl = this.drawingConstructs.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        // set up attributes and uniforms for use with shaders
        let aPosition = gl.getAttribLocation(this.drawingConstructs.program, "aPosition");
        let aColor = gl.getAttribLocation(this.drawingConstructs.program, "aColor");
        let solarPosition = gl.getUniformLocation(this.drawingConstructs.program, "solarPosition");
        let aspectRatio = gl.getUniformLocation(this.drawingConstructs.program, "aspectRatio");
        let solarAltitudeScale = gl.getUniformLocation(this.drawingConstructs.program, "altitude_scale");
        
        // define buffers for black background
        let vertex_buffer = this.create_buffer(gl, this.drawingConstructs.frame);
        let colour_buffer = this.create_buffer(gl, this.drawingConstructs.colors);
        
        // set altitude scale
        gl.uniform1f(solarAltitudeScale, 1);
    
        //set aspect ratio
        gl.uniform2f(aspectRatio, this.drawingConstructs.width / this.drawingConstructs.height, 1.0)
    
        // set sun position 
        gl.uniform2f(solarPosition, (this.state.lst - 12)/12, this.state.solarElevationAngle)
    
        // draw background
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aPosition);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, colour_buffer);
        gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aColor);
        
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    
        // draw altitude curve
        gl.bindBuffer(gl.ARRAY_BUFFER, this.create_buffer(gl, this.state.xyValues));
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aPosition);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, this.create_buffer(gl, this.drawingConstructs.altitudeCurveColors))
        gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aColor);
    
        //gl.drawArrays(gl.LINE_STRIP, 0, this.drawingConstructs.sun_altitude_curve.length / 2);
        gl.drawArrays(gl.LINE_STRIP, 0,  this.state.xyValues.length / 2)
    
        // draw horison
        gl.bindBuffer(gl.ARRAY_BUFFER, this.create_buffer(gl, this.drawingConstructs.horison))
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aPosition);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, this.create_buffer(gl, this.drawingConstructs.horisonColors));
        gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aColor);
    
        gl.drawArrays(this.drawingConstructs.gl.LINES, 0, 2);
    }
  
    componentDidMount() {
        this.calcCurrentSolarPosition() // get sun position
        this.calcSolarAngleArray()      // get sun trajectory 

        this.setup() // setup plot
        this.draw()  // draw plot
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