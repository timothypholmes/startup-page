uniform vec3 color;
uniform float radius;
varying vec3 vertexNormal;

void main() {
    float ndcDepth = gl_FragCoord.z / gl_FragCoord.w;
    float distance = radius * sqrt(1.0 - ndcDepth * ndcDepth);
    float intensity = pow(0.025 - dot(vertexNormal, vec3(0.0, 0.0, 0.9)), 2.0);
    gl_FragColor = vec4(color, 1.0) * intensity;
}