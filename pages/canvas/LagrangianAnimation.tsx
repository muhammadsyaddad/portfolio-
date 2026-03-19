import React, { useEffect, useRef } from "react";
import { animate } from "animejs";
import CanvasLayout from "@/components/CanvasLayout";

const LagrangianAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = "";

    const particles = Array.from({ length: 28 }, (_, i) => {
      const particle = document.createElement("div");
      particle.className = "lagrangian-particle";
      particle.style.cssText = `
        position: absolute;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: white;
        opacity: 0.25;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      `;
      container.appendChild(particle);
      return { particle, index: i };
    });

    const animation = animate(
      particles.map(({ particle }) => particle),
      {
        translateX: (_, i) => {
          const angle = (i / particles.length) * Math.PI * 2;
          return Math.cos(angle) * (140 + (i % 4) * 20);
        },
        translateY: (_, i) => {
          const angle = (i / particles.length) * Math.PI * 2;
          return Math.sin(angle * 2) * (70 + (i % 5) * 12);
        },
        scale: [0.6, 1.8, 0.6],
        opacity: [0.2, 0.9, 0.2],
        ease: "inOutSine",
        loop: true,
        duration: 2600,
        delay: (_, i) => i * 60,
      },
    );

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

export default LagrangianAnimation;
