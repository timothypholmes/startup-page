export type vertex = {
  `
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
  `
}