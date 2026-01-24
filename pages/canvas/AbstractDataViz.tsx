import React, { useEffect, useRef } from "react";
import { animate, stagger, utils } from "animejs";
import CanvasLayout from "@/components/CanvasLayout";

const AbstractDataViz: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = "";

    // Create bar chart visualization
    const numBars = 30;
    const bars: HTMLDivElement[] = [];

    for (let i = 0; i < numBars; i++) {
      const bar = document.createElement("div");
      const width = 100 / numBars;
      bar.style.cssText = `
        position: absolute;
        width: ${width - 0.5}%;
        height: 10px;
        background: white;
        opacity: 0.7;
        bottom: 20%;
        left: ${i * width}%;
        transform-origin: bottom;
      `;
      container.appendChild(bar);
      bars.push(bar);
    }

    // Animate bars like audio visualizer
    const animation = animate(bars, {
      scaleY: () => utils.random(1, 30),
      opacity: () => utils.random(0.4, 1),
      duration: 300,
      ease: "inOutQuad",
      delay: stagger(20),
      loop: true,
      direction: "alternate",
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

export default AbstractDataViz;
