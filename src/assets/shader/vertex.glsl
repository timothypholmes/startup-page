attribute vec2 aPosition;
attribute vec3 aColor;

uniform vec2 sunPosition;

varying vec4 vertColor;
varying vec2 vertPosition;

void main() {

    gl_Position = projectionMatrix * modelViewMatrix  * vec4(position, 1.0);
    vertColor = vec4(aColor, 1.0);
    vertPosition = vec2(12.0, 6.0);
}