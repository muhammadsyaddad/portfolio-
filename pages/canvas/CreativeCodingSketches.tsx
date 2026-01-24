import React, { useEffect, useRef } from "react";
import { animate, utils } from "animejs";
import CanvasLayout from "@/components/CanvasLayout";

const CreativeCodingSketches: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationsRef = useRef<ReturnType<typeof animate>[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = "";
    animationsRef.current = [];

    // Create spiraling lines
    const numLines = 36;

    for (let i = 0; i < numLines; i++) {
      const line = document.createElement("div");
      const angle = (i / numLines) * 360;
      line.style.cssText = `
        position: absolute;
        width: 2px;
        height: 150px;
        background: linear-gradient(to top, white, transparent);
        opacity: 0.6;
        left: 50%;
        top: 50%;
        transform-origin: bottom center;
        transform: rotate(${angle}deg) translateY(-50%);
      `;
      container.appendChild(line);

      const anim = animate(line, {
        height: [150, 50 + utils.random(50, 200), 150],
        opacity: [0.6, 0.3, 0.6],
        duration: 2000 + i * 50,
        ease: "inOutSine",
        loop: true,
      });
      animationsRef.current.push(anim);
    }

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

export default CreativeCodingSketches;
