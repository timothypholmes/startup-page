// vertex.glsl
//attribute vec2 aPosition;
//attribute vec3 aColor;
//uniform vec2 solarPosition;
//varying vec4 vert_colour;
//varying vec2 vert_position;
void main() {
    gl_Position = vec4(1, 0, 0, 1);//vec4(aPosition, 0.0, 1.0);
    //vert_colour = vec4(aColor, 1.0);
    //vert_position = aPosition;
}