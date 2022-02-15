// fragment.glsl
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