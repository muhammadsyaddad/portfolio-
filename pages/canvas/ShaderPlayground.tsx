import React, { useEffect, useRef } from "react";
import { animate, stagger, utils } from "animejs";
import CanvasLayout from "@/components/CanvasLayout";

const ShaderPlayground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = "";

    // Create rotating squares
    const numSquares = 12;
    const squares: HTMLDivElement[] = [];

    for (let i = 0; i < numSquares; i++) {
      const square = document.createElement("div");
      const size = 50 + i * 30;
      square.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border: 2px solid white;
        opacity: ${0.1 + (i / numSquares) * 0.5};
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      `;
      container.appendChild(square);
      squares.push(square);
    }

    // Animate squares rotating
    const animation = animate(squares, {
      rotate: (el, i) => [0, 360 * (i % 2 === 0 ? 1 : -1)],
      scale: [1, 1.1, 1],
      borderRadius: ["0%", "20%", "0%"],
      duration: (el, i) => 8000 + i * 500,
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

export default ShaderPlayground;
