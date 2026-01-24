import React, { useEffect, useRef } from "react";
import { animate, stagger, utils } from "animejs";
import CanvasLayout from "@/components/CanvasLayout";

const AudioReactiveVisuals: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = "";

    // Create concentric rings
    const numRings = 8;
    const rings: HTMLDivElement[] = [];

    for (let i = 0; i < numRings; i++) {
      const ring = document.createElement("div");
      const size = 80 + i * 60;
      ring.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border: 2px solid white;
        border-radius: 50%;
        opacity: ${0.8 - i * 0.08};
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      `;
      container.appendChild(ring);
      rings.push(ring);
    }

    // Animate rings pulsing
    const animation = animate(rings, {
      scale: [1, 1.2, 1],
      opacity: (el, i) => [0.8 - i * 0.08, 0.3, 0.8 - i * 0.08],
      borderWidth: ["2px", "4px", "2px"],
      duration: 1500,
      ease: "inOutSine",
      delay: stagger(100, { from: "center" }),
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

export default AudioReactiveVisuals;
