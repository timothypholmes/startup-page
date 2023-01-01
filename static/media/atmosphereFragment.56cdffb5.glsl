varying vec3 vertexNormal;
void main() {
    float intensity = pow(0.025 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    gl_FragColor = vec4(0.529411765, 0.807843137, 0.980392157, 1) * intensity;
}