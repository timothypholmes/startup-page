import { render } from "@testing-library/react";
import React, {useEffect} from "react";

class SolarGraph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photos: [],
        }
        this.DEBUG = false;
        this.animate = true;
        this.XENhtml = false;
        this.altitude_scale = 0.8;
    
        // location
        this.longitude = 0;
        this.latitude = 0;
    
        // current state of the system
        this.current_state = {
            now: null,
            current_position: [0, 0], // sun's current position
            longitude: 0,
            latitude: 0,
            prev_latitude: 0,
            day_of_year: 0,
            prev_day_of_year: 0,
            animation_in_progress: false
        }
    
        // everything required to draw the scene
        this.drawing_constructs = {
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

        this.vert_source = `
            attribute vec2 a_Position;
            attribute vec3 a_Colour;
            uniform vec2 sun_position;
            varying vec4 vert_colour;
            varying vec2 vert_position;
            void main(void){
                gl_Position = vec4(a_Position, 0.0, 1.0);
                vert_colour = vec4(a_Colour, 1.0);
                vert_position = a_Position;
            }
    `;

    this.frag_source = `
        precision mediump int;
        precision highp float;
        uniform float altitude_scale;
        uniform vec2 aspect_ratio;
        uniform vec2 sun_position;
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
                
                return (c / pow(distance, 2.0)) * horison_sunlight_scale(length(position - sun), 0.75 / aspect_ratio.x, position);
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
            float distance = length(sun_position * aspect_ratio - vert_position * aspect_ratio);
            
            // adjust sunlight radius: default above horizon, shrinks as sun gets lower below horizon
            // completely invisible above horizon when the sun is 18 degreees delow horizon (night time)
            // 0.8 is default radius
            float radius = adjust_sunlight_radius(0.8, sun_position.y / altitude_scale); 
            
            // change horizon colour to sunrise (before solar noon), sunset (after solar noon)
            if(sun_position.x < 0.0){
                horison_colour = sunrise_colour;
            } else {
                horison_colour = sunset_colour;
            }
            // fill sun above horizon
            vec3 background = vert_colour.rgb * sun_fill(distance, vert_position * aspect_ratio);
            // blue outline around the sun representing sky
            vec3 sky = 1.0 * sky_colour.rgb * sunlight_scale(distance, radius, vert_position * aspect_ratio);
            // main sun
            vec3 sun = sunlight_colour.rgb * sun_scale(distance, vert_position * aspect_ratio);
            // combine all colours to get final colour for this fragment
            gl_FragColor = vec4(background + 0.8 * sky + 0.4 * sun + horison_scale(vert_position, sun_position, radius) * horison_colour.rgb * 0.3, 1.0);
        }
    `;

    }


    // useful Datetime functions
    stdTimezoneOffset() {
        // from https://stackoverflow.com/questions/11887934/how-to-check-if-the-dst-daylight-saving-time-is-in-effect-and-if-it-is-whats
        
        var jan = new Date(this.getFullYear(), 0, 1);
        var jul = new Date(this.getFullYear(), 6, 1);
        return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    }

    isDstObserved(){
        // from https://stackoverflow.com/questions/11887934/how-to-check-if-the-dst-daylight-saving-time-is-in-effect-and-if-it-is-whats
        return this.getTimezoneOffset() < this.stdTimezoneOffset();
    }

    isLeap(){
        // check whether or not given year is leap
        return ((this.year % 4 == 0) && !(this.year % 100 == 0)) || (this.year % 400 == 0);
    }

    dayOfYear(){
        // get current day of year
        
        var days_per_month = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var current_day = 0;

        // sum up days until beginning of current month
        for(var i = 0; i <= this.getMonth(); i++){
            current_day += days_per_month[i];
        }

        // add current day in the month
        current_day += this.getDate();

        // adjust for leap year
        if (this.getMonth() > 1 && this.isLeap()){
            current_day++;
        }

        return current_day;
    }

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

    create_buffer(gl, data){
        // initialise buffer for drawing
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        return buffer;
    }

    to_degrees(radians){
        // convert radians to degrees

        return radians * 180 / Math.PI;
    }

    to_radians(degrees){
        // convert degrees to radians

        return degrees * Math.PI / 180;
    }

    get_declination(day_of_year){
        // get sun's declination given current day of year
        // calculation is from http://mypages.iit.edu/~maslanka/SolarGeo.pdf

        return Math.asin(0.39795 * Math.cos(this.to_radians(0.98563 * (day_of_year - 173))));
    }

    altitude_curve(day_of_year, latitude, hour_angle){
        // sin of sun's altitude given day, latitude, and hour angle, scaled by a factor to decrease displayed amplitude

        var declination = this.get_declination(day_of_year);
        return this.altitude_scale * (Math.sin(declination) * Math.sin(latitude) + Math.cos(declination) * Math.cos(latitude) * Math.cos(hour_angle));
    }

    equation_of_time(day_of_year){
        // solar noon offset in minutes given day of year using analemma
        // we use alternative calculation from https://en.wikipedia.org/wiki/Equation_of_time

        var deg_per_day = 360 / 365.24;
        var orbital_angle = deg_per_day * (day_of_year + 10);
        
        var corrected_orbital_angle = orbital_angle + 1.914 * Math.sin(this.to_radians(deg_per_day) * (day_of_year - 2));
        var C = (orbital_angle - this.to_degrees(Math.atan(Math.tan(this.to_radians(corrected_orbital_angle)) / Math.cos(this.to_radians(23.44))))) / 180;

        return 720 * (C - Math.floor(C + 0.5));
    }

    get_altitude_curve(day_of_year, latitude){
        // compute altitude curve for given day at given latitude
        
        let arr = [];
        let colours = [];

        for(var i = -1; i <= 1 + 0.01; i = i + 0.01){
            arr.push(i);
            //arr.push(amplitude * Math.cos(i * Math.PI) + shift);
            arr.push(this.altitude_curve(day_of_year, latitude, i * Math.PI))

            // give each point gray colour (half way through each colour channel)
            colours.push(0.5);
            colours.push(0.5);
            colours.push(0.5);
        }

        return {sun_altitude_curve:arr, altitude_curve_colours:colours};
    }

    get_hour_angle(date, longitude){
        // get our angle in degrees for given datetime including longitude offset

        var eot = this.equation_of_time(date.dayOfYear()); // offset in minutes using analemma
        var longitude_offset = (longitude / 180) * 720; // offset in minutes due to longitude
        //var solar_noon_offset = 0 - (eot + longitude_offset + date.getTimezoneOffset()); // offset has to be negative
        
        // combine effects of equation of time, longitude, and timezone to get solar noon adjustment
        var solar_noon_offset = 0 - (eot + longitude_offset + date.getTimezoneOffset()); 

        // offset noon by calculated number of minutes 
        var solar_noon = new Date(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0).getTime() + solar_noon_offset * 60 * 1000);

        // calculate difference in in seconds between today's solar noon and current time
        var diff = (date.getTime() - solar_noon.getTime()) / 1000;
        
        // return hour angle in degrees (720*60 is 12 hours so that the range is -180-180)
        return 180 * (diff / (720 * 60));
    }

    initialise(drawing_constructs, state, animate){
        // obtain webgl context
        var canvas = document.getElementById("canvas");
        
        // set size of canvas to be the size of viewport
        canvas.height = 80;//window.innerHeight;
        canvas.width = 80;//window.innerWidth;

        drawing_constructs.width = canvas.offsetWidth;
        drawing_constructs.height = canvas.offsetHeight;

        let gl = canvas.getContext("webgl");
        
        // clear canvas
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // compile shaders
        var program = this.create_shaders(gl)
        gl.useProgram(program);

        drawing_constructs.program = program;
        drawing_constructs.gl = gl;

        // location
        state.longitude = this.longitude;
        state.latitude = this.latitude;

        state.now = new Date();
        state.day_of_year = state.now.dayOfYear();

        var hour_angle = -180;

        // set system up for animation and debug
        if(!this.DEBUG){
            if(animate){
                // start animation at the left side of the screen
                hour_angle = -180;
            } else {
                hour_angle = ((this.get_hour_angle(state.now, state.longitude) + 540) % 360) - 180;
            }
        }

        // set sun's starting position position: left edge if animating, otherwise put it in its current position using time of day
        this.current_state.current_position = [hour_angle / 180, this.altitude_curve(state.day_of_year, this.to_radians(state.latitude), this.to_radians(hour_angle))];
        
        // creates a black backgroung for the scene to render on
        // consists of two black triangles
        this.drawing_constructs.frame = [-1, -1,    1, -1,    1, 1,
                                        -1, -1,    -1, 1,    1, 1 ];
        this.drawing_constructs.colours = [0, 0, 0,   0, 0, 0,   0, 0, 0,
                                        0, 0, 0,   0, 0, 0,   0, 0, 0];

        // calculate sun's altitude curve (path in the sky) using day of year and longitude
        var {sun_altitude_curve, altitude_curve_colours} = this.get_altitude_curve(this.current_state.day_of_year, this.to_radians(this.current_state.latitude));
        this.drawing_constructs.sun_altitude_curve = sun_altitude_curve;
        this.drawing_constructs.altitude_curve_colours = altitude_curve_colours;

        // create a single line for horizon in the middle of the screen
        this.drawing_constructs.horison = [-1, 0, 1, 0];
        this.drawing_constructs.horison_colours = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
    }

    draw(drawing_constructs, state, animate, target_hour_angle){
        // draw to canvas using current sun's location, user coordinates, and target position for the sun to move to
        
        // skip animation and put the sun in the final position
        if(!animate){
            state.current_position = [target_hour_angle / 180, this.altitude_curve(state.day_of_year, this.to_radians(state.latitude), this.to_radians(target_hour_angle))];

            state.animation_in_progress = false;
        }

        // clear canvas
        let gl = drawing_constructs.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        // set up attributes and uniforms for use with shaders
        let a_Position = gl.getAttribLocation(drawing_constructs.program, "a_Position");
        let a_Colour = gl.getAttribLocation(drawing_constructs.program, "a_Colour");
        let sun_position = gl.getUniformLocation(drawing_constructs.program, "sun_position");
        let aspect_ratio = gl.getUniformLocation(drawing_constructs.program, "aspect_ratio");
        let sun_altitude_scale = gl.getUniformLocation(drawing_constructs.program, "altitude_scale");
        
        // define buffers for blask background
        let vertex_buffer = this.create_buffer(gl, drawing_constructs.frame);
        let colour_buffer = this.create_buffer(gl, drawing_constructs.colours);
        
        // set altitude scale
        gl.uniform1f(sun_altitude_scale, this.altitude_scale);

        //set aspect ratio
        gl.uniform2f(aspect_ratio, drawing_constructs.width / drawing_constructs.height, 1.0);

        // set sun position
        gl.uniform2f(sun_position, state.current_position[0], state.current_position[1]);

        // draw background
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.bindBuffer(gl.ARRAY_BUFFER, colour_buffer);
        gl.vertexAttribPointer(a_Colour, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Colour);
        
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        // draw altitude curve
        var altitude_curve_buffer = this.create_buffer(gl, drawing_constructs.sun_altitude_curve);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.altitude_curve_buffer);
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        var altitude_curve_colour_buffer = this.create_buffer(gl, drawing_constructs.altitude_curve_colours)
        gl.bindBuffer(gl.ARRAY_BUFFER, altitude_curve_colour_buffer);
        gl.vertexAttribPointer(a_Colour, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Colour);

        gl.drawArrays(gl.LINE_STRIP, 0, drawing_constructs.sun_altitude_curve.length / 2);

        // draw horison
        var horison_buffer = this.create_buffer(gl, drawing_constructs.horison);
        gl.bindBuffer(gl.ARRAY_BUFFER, horison_buffer);
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        var horison_colour_buffer = this.create_buffer(gl, drawing_constructs.horison_colours)
        gl.bindBuffer(gl.ARRAY_BUFFER, horison_colour_buffer);
        gl.vertexAttribPointer(a_Colour, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Colour);

        gl.drawArrays(drawing_constructs.gl.LINES, 0, 2);

        // animation routine
        if (animate){
            window.requestAnimationFrame(function(){
                // get current hour angle in range 0-360 for easier manipulation
                let current_angle = state.current_position[0] * 180 + 180;
                
                // hour angle is between -180 and 180 (most of the time), depending on difference between solar noons on consecutive days
                let limit = (target_hour_angle + 540) % 360;
            
                
                // animation stopping condition: sun is sufficiently close to target
                // TODO: find a better way to do animation with limiting condition
                if (Math.abs(current_angle - limit) <= 0.1){
                    //if (current_angle > limit){
                    // begin countdown to screen refresh
                    if(!this.XENhtml){
                        // don't refresh automatically if running within XENhtml
                        setTimeout(this.refresh, 2000, drawing_constructs, state, animate);
                    }
                    
                    // stop animation from continuing
                    animate = false;
                    console.log("End. Starting refresh timer");
                }
                
                // if target hour angle is less than current hour angle subtract 360
                // happens when animation has to cross midnight
                if(limit < current_angle){
                    limit += 360;
                }
                
                // + 360 then % 360 to get in range 0-360
                current_angle = (current_angle + Math.pow(Math.cos(Math.abs(current_angle / limit) * Math.PI) + 1, 0.25)) % 360;
                
                // update current position
                state.current_position = [(current_angle - 180) / 180, this.altitude_curve(state.day_of_year, this.to_radians(state.latitude), this.to_radians(current_angle - 180))];
                
                // draw next frame
                this.draw(drawing_constructs, state, animate, target_hour_angle);
            });
        }
    }

    refresh(drawing_constructs, state, animate) {
        // refresh canvas

        if(state.animation_in_progress){
            // stop if animation is currently running
            return;
        }

        state.animation_in_progress = true;
        
        // update state
        state.now = new Date();
        state.day_of_year = state.now.dayOfYear();
        state.latitude = this.latitude;
        state.longitude = this.longitude;

        // check whether or not we need to redraw altitude curve
        if(state.day_of_year != state.prev_day_of_year || state.latitude != state.prev_latitude){
            let {sun_altitude_curve, altitude_curve_colours} = this.get_altitude_curve(state.day_of_year, this.to_radians(state.latitude));
            drawing_constructs.sun_altitude_curve = sun_altitude_curve;
            drawing_constructs.altitude_curve_colours = altitude_curve_colours;

            state.prev_day_of_year = state.day_of_year;
            state.prev_latitude = state.latitude;
        }

        // compute target hour angle and draw
        let target_hour_angle = ((this.get_hour_angle(state.now, state.longitude) + 540) % 360) - 180;
        this.draw(drawing_constructs, state, animate, target_hour_angle);
    }

    /*
    window.onload = function(){
        // initialise current state and drawing constructs
        this.initialise(this.drawing_constructs, this.current_state, this.animate);
        
        // draw to canvas
        this.refresh(this.drawing_constructs, this.current_state, this.animate);

        // XENhtml function, unused in browsers, should run when the screen is woken up
        // For use only with XENhtml on iPhone
        // Works ok-ish on iPhone 5S, can be a bit slow, crashes on iPad 2
        window.onresume = function(){
            this.refresh(this.drawing_constructs, this.current_state, this.animate);
        };
    }
    */

    componentDidMount() {
        //this.initialise(this.drawing_constructs, this.current_state, this.animate)
        //this.refresh(this.drawing_constructs, this.current_state, this.animate)
    }
    //useEffect(() => {
    //    this.initialise(this.drawing_constructs, this.current_state, this.animate);
    //  })


    //componentDidMount() {
    //    a=1;
    //}

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