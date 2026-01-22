import React from "react";
import BlogPostLayout from "@/components/BlogPostLayout";

const ImmersiveWebGLLandingPage: React.FC = () => {
  return (
    <BlogPostLayout
      title="Immersive WebGL Landing Page"
      date="January 20, 2024"
      category="Portfolio"
      tags={["WebGL", "Three.js", "Animation", "Creative"]}
    >
      <h2>The Vision</h2>
      <p>
        Creating an unforgettable first impression through a fully immersive 3D web
        experience. This landing page pushes the boundaries of what's possible in
        the browser.
      </p>

      <h2>Technical Implementation</h2>
      <h3>Three.js Scene Setup</h3>
      <p>
        The foundation of this project is a carefully optimized Three.js scene that
        runs smoothly across devices:
      </p>

      <pre>
        <code>{`// Scene initialization with performance optimizations
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'high-performance'
});

// Adaptive quality based on device capabilities
const quality = detectDeviceCapabilities();
renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality.maxPixelRatio));`}</code>
      </pre>

      <h3>Shader Magic</h3>
      <p>Custom GLSL shaders bring the visuals to life:</p>

      <pre>
        <code>{`// Fragment shader for fluid effect
uniform float uTime;
uniform vec2 uMouse;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  float distortion = sin(uv.x * 10.0 + uTime) * 0.1;
  vec3 color = vec3(uv.x + distortion, uv.y, 1.0 - uv.x);
  gl_FragColor = vec4(color, 1.0);
}`}</code>
      </pre>

      <h2>Performance Optimization</h2>
      <ul>
        <li><strong>LOD System:</strong> Dynamic level-of-detail based on camera distance</li>
        <li><strong>Frustum Culling:</strong> Only render objects in view</li>
        <li><strong>Texture Compression:</strong> KTX2 format for 70% smaller textures</li>
        <li><strong>Lazy Loading:</strong> Progressive asset loading with skeleton states</li>
      </ul>

      <h2>User Interaction</h2>
      <p>The experience responds to user input in multiple ways:</p>
      <ul>
        <li>Mouse movement affects particle flow</li>
        <li>Scroll depth reveals new content layers</li>
        <li>Click interactions trigger micro-animations</li>
      </ul>

      <h2>Results</h2>
      <ul>
        <li>Average session duration: 4.2 minutes</li>
        <li>Bounce rate: 15% (industry average: 45%)</li>
        <li>Performance score: 92/100 on Lighthouse</li>
      </ul>
    </BlogPostLayout>
  );
};

export default ImmersiveWebGLLandingPage;
