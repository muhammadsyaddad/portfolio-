import React, { useEffect, useRef } from "react";
import { animate, stagger, utils } from "animejs";
import CanvasLayout from "@/components/CanvasLayout";

const ProceduralTextures: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = "";

    // Create a grid of cells for procedural texture effect
    const gridSize = 12;
    const cells: HTMLDivElement[] = [];

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const cell = document.createElement("div");
        const size = 100 / gridSize;
        cell.style.cssText = `
          position: absolute;
          width: ${size}%;
          height: ${size}%;
          background: white;
          opacity: 0.1;
          left: ${col * size}%;
          top: ${row * size}%;
          border: 1px solid rgba(255,255,255,0.05);
        `;
        container.appendChild(cell);
        cells.push(cell);
      }
    }

    // Animate cells in a wave pattern
    const animation = animate(cells, {
      opacity: [0.1, 0.8, 0.1],
      scale: [1, 1.05, 1],
      duration: 2000,
      ease: "inOutQuad",
      delay: stagger(30, { grid: [gridSize, gridSize], from: "center" }),
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

export default ProceduralTextures;
