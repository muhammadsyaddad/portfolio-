import React, { useEffect, useRef } from "react";
import { animate, stagger, utils } from "animejs";
import CanvasLayout from "@/components/CanvasLayout";

const ParticleSystemsStudy: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = "";

    // Create particles
    const numParticles = 100;
    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < numParticles; i++) {
      const particle = document.createElement("div");
      const size = 2 + Math.random() * 4;
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: white;
        border-radius: 50%;
        opacity: 0;
        left: 50%;
        top: 100%;
      `;
      container.appendChild(particle);
      particles.push(particle);
    }

    // Animate particles rising
    const animation = animate(particles, {
      translateY: [0, -window.innerHeight - 100],
      translateX: () => utils.random(-200, 200),
      opacity: [0, 1, 1, 0],
      scale: [0, 1, 1, 0.5],
      duration: () => utils.random(4000, 8000),
      delay: () => utils.random(0, 4000),
      ease: "linear",
      loop: true,
    });

    return () => {
      animation.pause();
      container.innerHTML = "";
    };
  }, []);

  return (
    <CanvasLayout>
      <div
        ref={containerRef}
        className="w-full h-full relative overflow-hidden"
      />
    </CanvasLayout>
  );
};

export default ParticleSystemsStudy;
