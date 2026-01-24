import React, { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import CanvasLayout from "@/components/CanvasLayout";

const GenerativeArtExperiments: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = "";

    // Create grid of dots
    const rows = 15;
    const cols = 20;
    const dots: HTMLDivElement[] = [];

    for (let i = 0; i < rows * cols; i++) {
      const dot = document.createElement("div");
      dot.className = "dot";
      dot.style.cssText = `
        position: absolute;
        width: 8px;
        height: 8px;
        background: white;
        border-radius: 50%;
        opacity: 0.3;
      `;
      const col = i % cols;
      const row = Math.floor(i / cols);
      dot.style.left = `${(col / cols) * 100}%`;
      dot.style.top = `${(row / rows) * 100}%`;
      container.appendChild(dot);
      dots.push(dot);
    }

    // Animate dots in wave pattern
    const animation = animate(dots, {
      scale: [1, 2.5, 1],
      opacity: [0.3, 1, 0.3],
      ease: "inOutSine",
      delay: stagger(50, { grid: [cols, rows], from: "center" }),
      loop: true,
      duration: 1600,
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
        style={{ padding: "10%" }}
      />
    </CanvasLayout>
  );
};

export default GenerativeArtExperiments;
