varying vec3 vertexNormal;
uniform vec4 horizonColor;
uniform float sunriseTime; 
uniform float sunYPosition; 
uniform float fadeThreshold; // Store fade threshold (e.g., 0.2)

void main() {
  // Calculate distance from sunrise time
  float distanceFromSunrise = abs(sunYPosition - sunriseTime);

  // Calculate fade factor (0-1)
  float fadeFactor = smoothstep(fadeThreshold, fadeThreshold + 0.1, distanceFromSunrise);

  // Calculate intensity based on distance from sunrise
  float intensity = smoothstep(0.0, 0.2, distanceFromSunrise);

  // Adjust intensity based on vertex normal (optional)
  intensity *= pow(0.025 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 1.0);

  // Apply fade factor to opacity
  gl_FragColor = vec4(horizonColor.rgb * intensity, horizonColor.a * fadeFactor);
}