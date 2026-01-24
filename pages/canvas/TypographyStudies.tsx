import React, { useEffect, useRef } from "react";
import { animate, utils } from "animejs";
import CanvasLayout from "@/components/CanvasLayout";

const TypographyStudies: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationsRef = useRef<ReturnType<typeof animate>[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = "";
    animationsRef.current = [];

    // Create floating letters
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");

    for (let i = 0; i < 40; i++) {
      const letter = document.createElement("div");
      letter.textContent = letters[Math.floor(Math.random() * letters.length)];
      letter.style.cssText = `
        position: absolute;
        font-size: ${20 + Math.random() * 60}px;
        font-weight: bold;
        color: white;
        opacity: 0;
        font-family: 'JetBrains Mono', monospace;
      `;
      letter.style.left = `${Math.random() * 90}%`;
      letter.style.top = `${Math.random() * 90}%`;
      container.appendChild(letter);

      // Animate each letter individually
      const anim = animate(letter, {
        opacity: [0, 0.7, 0],
        scale: [0.5, 1.2, 0.5],
        rotate: utils.random(-45, 45),
        translateX: utils.random(-100, 100),
        translateY: utils.random(-100, 100),
        duration: utils.random(3000, 6000),
        delay: utils.random(0, 2000),
        ease: "inOutQuad",
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

export default TypographyStudies;
