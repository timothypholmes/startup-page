varying vec3 vertexNormal;
uniform vec4 horizonColor;
void main() {
    float intensity = pow(0.025 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    gl_FragColor = horizonColor * intensity;
}