import React from "react";
import BlogPostLayout from "@/components/BlogPostLayout";

const GenerativeArtExperiments: React.FC = () => {
  return (
    <BlogPostLayout
      title="Generative Art Experiments"
      date="February 10, 2024"
      category="Canvas"
      tags={["Generative Art", "p5.js", "Creative Coding", "Algorithms"]}
    >
      <p>
        A collection of experiments in generative art, exploring how algorithms
        can create beautiful and unexpected visual outcomes.
      </p>

      <h2>Philosophy</h2>
      <p>
        Generative art sits at the intersection of intention and emergence. We
        write the rules, but the artwork creates itself.
      </p>

      <h2>Experiment 1: Flow Fields</h2>
      <p>
        Flow fields create organic, natural-looking patterns by having particles
        follow a noise-based direction field.
      </p>

      <pre>
        <code>{`// p5.js Flow Field
const particles = [];
const scale = 20;
const cols = floor(width / scale);
const rows = floor(height / scale);

function draw() {
  for (let p of particles) {
    const x = floor(p.pos.x / scale);
    const y = floor(p.pos.y / scale);
    const angle = noise(x * 0.1, y * 0.1, frameCount * 0.01) * TWO_PI * 2;
    
    p.vel = p5.Vector.fromAngle(angle);
    p.pos.add(p.vel);
    
    stroke(255, 10);
    point(p.pos.x, p.pos.y);
  }
}`}</code>
      </pre>

      <h2>Experiment 2: Recursive Patterns</h2>
      <p>Using recursion to create infinitely complex patterns from simple rules.</p>

      <pre>
        <code>{`function drawBranch(len, angle, depth) {
  if (depth === 0) return;
  
  stroke(255, 255 - depth * 20);
  strokeWeight(depth * 0.5);
  
  line(0, 0, 0, -len);
  translate(0, -len);
  
  push();
  rotate(angle);
  drawBranch(len * 0.7, angle, depth - 1);
  pop();
  
  push();
  rotate(-angle);
  drawBranch(len * 0.7, angle, depth - 1);
  pop();
}`}</code>
      </pre>

      <h2>Experiment 3: Cellular Automata</h2>
      <p>Simple rules, complex emergent behavior.</p>

      <h2>Tools & Technologies</h2>
      <ul>
        <li><strong>p5.js:</strong> For quick sketches and prototypes</li>
        <li><strong>Three.js:</strong> For 3D generative work</li>
        <li><strong>GLSL Shaders:</strong> For GPU-accelerated patterns</li>
        <li><strong>Canvas API:</strong> For performance-critical applications</li>
      </ul>

      <h2>Gallery</h2>
      <p>
        Each piece in this series is unique, generated from the same algorithm
        but with different random seeds. The beauty lies in the exploration of
        possibility space.
      </p>

      <h2>Resources</h2>
      <ul>
        <li>The Nature of Code by Daniel Shiffman</li>
        <li>Generative Design by Benedikt Gross</li>
        <li>The Coding Train YouTube channel</li>
      </ul>

      <h2>Conclusion</h2>
      <p>
        Generative art teaches us that complexity can emerge from simplicity, and
        that some of the most beautiful things are discovered rather than designed.
      </p>
    </BlogPostLayout>
  );
};

export default GenerativeArtExperiments;
