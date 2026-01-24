import React, { useEffect, useRef } from "react";
import { animate, utils } from "animejs";
import CanvasLayout from "@/components/CanvasLayout";

const InteractiveInstallations: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationsRef = useRef<ReturnType<typeof animate>[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = "";
    animationsRef.current = [];

    // Create connected nodes
    const numNodes = 20;
    const nodes: HTMLDivElement[] = [];
    const lines: HTMLDivElement[] = [];

    // Create nodes
    for (let i = 0; i < numNodes; i++) {
      const node = document.createElement("div");
      node.style.cssText = `
        position: absolute;
        width: 12px;
        height: 12px;
        background: white;
        border-radius: 50%;
        opacity: 0.8;
        left: ${10 + Math.random() * 80}%;
        top: ${10 + Math.random() * 80}%;
      `;
      container.appendChild(node);
      nodes.push(node);

      // Animate each node
      const anim = animate(node, {
        translateX: utils.random(-50, 50),
        translateY: utils.random(-50, 50),
        scale: [1, utils.random(0.5, 1.5), 1],
        opacity: [0.8, utils.random(0.3, 1), 0.8],
        duration: utils.random(3000, 5000),
        ease: "inOutSine",
        loop: true,
        direction: "alternate",
      });
      animationsRef.current.push(anim);
    }

    // Create connecting lines (simplified - just visual)
    for (let i = 0; i < numNodes - 1; i++) {
      const line = document.createElement("div");
      line.style.cssText = `
        position: absolute;
        height: 1px;
        background: white;
        opacity: 0.2;
        left: 50%;
        top: 50%;
        width: ${50 + Math.random() * 100}px;
        transform-origin: left center;
        transform: rotate(${Math.random() * 360}deg);
      `;
      container.appendChild(line);
      lines.push(line);
    }

    // Animate lines
    const lineAnim = animate(lines, {
      opacity: [0.1, 0.4, 0.1],
      rotate: (el, i) => `${i * 30 + 360}deg`,
      duration: 8000,
      ease: "linear",
      loop: true,
    });
    animationsRef.current.push(lineAnim);

    return () => {
      animationsRef.current.forEach((anim) => anim.pause());
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

export default InteractiveInstallations;
