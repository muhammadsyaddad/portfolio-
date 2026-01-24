import React, { useEffect, useRef } from "react";
import { animate, stagger, utils } from "animejs";
import CanvasLayout from "@/components/CanvasLayout";

const MotionDesignExplorations: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = "";

    // Create morphing shapes
    const numCircles = 8;
    const circles: HTMLDivElement[] = [];

    for (let i = 0; i < numCircles; i++) {
      const circle = document.createElement("div");
      const angle = (i / numCircles) * Math.PI * 2;
      const radius = 150;
      circle.style.cssText = `
        position: absolute;
        width: 40px;
        height: 40px;
        background: white;
        border-radius: 50%;
        opacity: 0.8;
        left: calc(50% + ${Math.cos(angle) * radius}px);
        top: calc(50% + ${Math.sin(angle) * radius}px);
        transform: translate(-50%, -50%);
      `;
      container.appendChild(circle);
      circles.push(circle);
    }

    // Create center element
    const center = document.createElement("div");
    center.style.cssText = `
      position: absolute;
      width: 60px;
      height: 60px;
      background: white;
      border-radius: 50%;
      opacity: 0.9;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    `;
    container.appendChild(center);

    // Animate circles orbiting
    const orbitAnimation = animate(circles, {
      translateX: (el, i) => {
        const angle = (i / numCircles) * Math.PI * 2;
        return [
          Math.cos(angle) * 150,
          Math.cos(angle + Math.PI) * 150,
          Math.cos(angle) * 150,
        ];
      },
      translateY: (el, i) => {
        const angle = (i / numCircles) * Math.PI * 2;
        return [
          Math.sin(angle) * 150,
          Math.sin(angle + Math.PI) * 150,
          Math.sin(angle) * 150,
        ];
      },
      scale: [1, 1.5, 1],
      duration: 4000,
      ease: "inOutQuad",
      delay: stagger(100),
      loop: true,
    });

    // Animate center
    const centerAnimation = animate(center, {
      scale: [1, 1.3, 1],
      borderRadius: ["50%", "20%", "50%"],
      rotate: [0, 180, 360],
      duration: 4000,
      ease: "inOutQuad",
      loop: true,
    });

    return () => {
      orbitAnimation.pause();
      centerAnimation.pause();
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

export default MotionDesignExplorations;
