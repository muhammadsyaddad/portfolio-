import React, { useEffect, useRef } from "react";
import CanvasLayout from "@/components/CanvasLayout";

type FlowSample = {
  vx: number;
  vy: number;
};

type EulerProbe = {
  anchor: HTMLDivElement;
  vector: HTMLDivElement;
  u: number;
  v: number;
};

type Particle = {
  element: HTMLDivElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  seed: number;
};

type TrailPoint = {
  x: number;
  y: number;
};

const GRID_COLS = 11;
const GRID_ROWS = 8;
const BACKGROUND_PARTICLES = 80;
const TRAIL_SIZE = 70;

const panelStyle = `
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 12px;
  overflow: hidden;
  background: radial-gradient(circle at 30% 10%, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.25) 65%);
`;

const vectorLineStyle = `
  position: absolute;
  left: 0;
  top: 0;
  height: 2px;
  width: 16px;
  transform-origin: 0 50%;
  will-change: transform, width, opacity;
`;

const LagrangianAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    root.innerHTML = "";

    const container = document.createElement("div");
    container.style.cssText = "position: absolute; inset: 0;";

    const title = document.createElement("div");
    title.style.cssText = `
      position: absolute;
      top: 22px;
      left: 50%;
      transform: translateX(-50%);
      text-transform: uppercase;
      letter-spacing: 0.2em;
      font-size: 11px;
      opacity: 0.72;
      white-space: nowrap;
      pointer-events: none;
    `;
    title.textContent = "Same flow field, two viewpoints";

    const eulerPanel = document.createElement("div");
    eulerPanel.style.cssText = `${panelStyle}
      left: 12px;
      top: 78px;
      bottom: 24px;
      width: calc(50% - 18px);
    `;

    const lagrangianPanel = document.createElement("div");
    lagrangianPanel.style.cssText = `${panelStyle}
      right: 12px;
      top: 78px;
      bottom: 24px;
      width: calc(50% - 18px);
    `;

    const centerDivider = document.createElement("div");
    centerDivider.style.cssText = `
      position: absolute;
      left: 50%;
      top: 80px;
      bottom: 24px;
      width: 1px;
      transform: translateX(-0.5px);
      background: rgba(255, 255, 255, 0.18);
      pointer-events: none;
    `;

    const mediaQuery = window.matchMedia("(max-width: 900px)");

    const applyResponsiveLayout = () => {
      const isMobile = mediaQuery.matches;

      if (isMobile) {
        eulerPanel.style.left = "12px";
        eulerPanel.style.right = "12px";
        eulerPanel.style.width = "auto";
        eulerPanel.style.top = "70px";
        eulerPanel.style.bottom = "calc(50% + 10px)";

        lagrangianPanel.style.left = "12px";
        lagrangianPanel.style.right = "12px";
        lagrangianPanel.style.width = "auto";
        lagrangianPanel.style.top = "calc(50% + 10px)";
        lagrangianPanel.style.bottom = "24px";

        centerDivider.style.top = "50%";
        centerDivider.style.bottom = "auto";
        centerDivider.style.left = "12px";
        centerDivider.style.right = "12px";
        centerDivider.style.width = "auto";
        centerDivider.style.height = "1px";
        centerDivider.style.transform = "none";
      } else {
        eulerPanel.style.left = "12px";
        eulerPanel.style.right = "";
        eulerPanel.style.top = "78px";
        eulerPanel.style.bottom = "24px";
        eulerPanel.style.width = "calc(50% - 18px)";

        lagrangianPanel.style.left = "";
        lagrangianPanel.style.right = "12px";
        lagrangianPanel.style.top = "78px";
        lagrangianPanel.style.bottom = "24px";
        lagrangianPanel.style.width = "calc(50% - 18px)";

        centerDivider.style.top = "80px";
        centerDivider.style.bottom = "24px";
        centerDivider.style.left = "50%";
        centerDivider.style.right = "";
        centerDivider.style.width = "1px";
        centerDivider.style.height = "";
        centerDivider.style.transform = "translateX(-0.5px)";
      }
    };

    applyResponsiveLayout();
    mediaQuery.addEventListener("change", applyResponsiveLayout);

    const eulerLabel = document.createElement("div");
    eulerLabel.style.cssText = `
      position: absolute;
      top: 10px;
      left: 14px;
      font-size: 11px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: rgba(120, 234, 255, 0.94);
    `;
    eulerLabel.textContent = "Eulerian (fixed x)";

    const eulerEq = document.createElement("div");
    eulerEq.style.cssText = `
      position: absolute;
      top: 30px;
      left: 14px;
      font-size: 11px;
      letter-spacing: 0.03em;
      color: rgba(173, 242, 255, 0.7);
    `;
    eulerEq.textContent = "u = u(x, t)  |  observe one place while flow changes";

    const lagLabel = document.createElement("div");
    lagLabel.style.cssText = `
      position: absolute;
      top: 10px;
      left: 14px;
      font-size: 11px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: rgba(255, 184, 87, 0.95);
    `;
    lagLabel.textContent = "Lagrangian (moving X(t))";

    const lagEq = document.createElement("div");
    lagEq.style.cssText = `
      position: absolute;
      top: 30px;
      left: 14px;
      font-size: 11px;
      letter-spacing: 0.03em;
      color: rgba(255, 213, 147, 0.74);
    `;
    lagEq.textContent = "dX/dt = u(X, t)  |  follow one fluid parcel";

    const eulerLayer = document.createElement("div");
    eulerLayer.style.cssText = "position: absolute; inset: 0;";

    const lagrangianLayer = document.createElement("div");
    lagrangianLayer.style.cssText = "position: absolute; inset: 0;";

    const eulerProbeWrap = document.createElement("div");
    eulerProbeWrap.style.cssText = `
      position: absolute;
      width: 0;
      height: 0;
      will-change: transform;
    `;

    const eulerProbeDot = document.createElement("div");
    eulerProbeDot.style.cssText = `
      position: absolute;
      width: 8px;
      height: 8px;
      left: -4px;
      top: -4px;
      border-radius: 50%;
      background: rgba(120, 234, 255, 0.96);
      box-shadow: 0 0 14px rgba(120, 234, 255, 0.9);
    `;

    const eulerProbeVector = document.createElement("div");
    eulerProbeVector.style.cssText = `${vectorLineStyle}
      background: linear-gradient(90deg, rgba(120, 234, 255, 0.12), rgba(120, 234, 255, 0.95));
    `;

    const eulerProbeArrow = document.createElement("div");
    eulerProbeArrow.style.cssText = `
      position: absolute;
      right: -1px;
      top: -3px;
      width: 0;
      height: 0;
      border-top: 4px solid transparent;
      border-bottom: 4px solid transparent;
      border-left: 7px solid rgba(120, 234, 255, 0.95);
    `;
    eulerProbeVector.appendChild(eulerProbeArrow);

    eulerProbeWrap.append(eulerProbeVector, eulerProbeDot);

    const eulerProbeReadout = document.createElement("div");
    eulerProbeReadout.style.cssText = `
      position: absolute;
      left: 14px;
      bottom: 12px;
      font-size: 11px;
      letter-spacing: 0.04em;
      color: rgba(195, 246, 255, 0.86);
      text-transform: uppercase;
    `;
    eulerProbeReadout.textContent = "u(x0, t) = (0.00, 0.00)";

    const lagTrail = document.createElement("svg");
    lagTrail.setAttribute("viewBox", "0 0 100 100");
    lagTrail.setAttribute("preserveAspectRatio", "none");
    lagTrail.style.cssText = "position: absolute; inset: 0; width: 100%; height: 100%;";

    const lagTrailPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    lagTrailPath.setAttribute("fill", "none");
    lagTrailPath.setAttribute("stroke", "rgba(255, 184, 87, 0.82)");
    lagTrailPath.setAttribute("stroke-width", "1.6");
    lagTrailPath.setAttribute("stroke-linecap", "round");
    lagTrailPath.setAttribute("stroke-linejoin", "round");
    lagTrailPath.setAttribute("stroke-dasharray", "5 4");
    lagTrail.appendChild(lagTrailPath);

    const highlightedParticle = document.createElement("div");
    highlightedParticle.style.cssText = `
      position: absolute;
      width: 11px;
      height: 11px;
      left: -5.5px;
      top: -5.5px;
      border-radius: 50%;
      background: rgba(255, 184, 87, 1);
      box-shadow: 0 0 16px rgba(255, 184, 87, 0.95);
      will-change: transform;
    `;

    const highlightedVector = document.createElement("div");
    highlightedVector.style.cssText = `${vectorLineStyle}
      background: linear-gradient(90deg, rgba(255, 184, 87, 0.2), rgba(255, 184, 87, 1));
    `;
    const highlightedArrow = document.createElement("div");
    highlightedArrow.style.cssText = `
      position: absolute;
      right: -1px;
      top: -4px;
      width: 0;
      height: 0;
      border-top: 5px solid transparent;
      border-bottom: 5px solid transparent;
      border-left: 8px solid rgba(255, 184, 87, 1);
    `;
    highlightedVector.appendChild(highlightedArrow);

    const lagReadout = document.createElement("div");
    lagReadout.style.cssText = `
      position: absolute;
      left: 14px;
      bottom: 12px;
      font-size: 11px;
      letter-spacing: 0.04em;
      color: rgba(255, 219, 166, 0.9);
      text-transform: uppercase;
    `;
    lagReadout.textContent = "X(t) = (0.00, 0.00)";

    const syncHint = document.createElement("div");
    syncHint.style.cssText = `
      position: absolute;
      left: 50%;
      bottom: 4px;
      transform: translateX(-50%);
      font-size: 10px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.52);
      white-space: nowrap;
      pointer-events: none;
    `;
    syncHint.textContent = "Blue probe and orange parcel use the same velocity field u(x, t)";

    eulerPanel.append(eulerLabel, eulerEq, eulerLayer, eulerProbeReadout);
    eulerLayer.appendChild(eulerProbeWrap);

    lagrangianPanel.append(lagLabel, lagEq, lagrangianLayer, lagReadout);
    lagrangianLayer.append(lagTrail, highlightedVector, highlightedParticle);

    container.append(title, centerDivider, eulerPanel, lagrangianPanel, syncHint);
    root.appendChild(container);

    let eulerWidth = 0;
    let eulerHeight = 0;
    let eulerHalfWidth = 0;
    let eulerHalfHeight = 0;

    let lagWidth = 0;
    let lagHeight = 0;
    let lagHalfWidth = 0;
    let lagHalfHeight = 0;

    const probes: EulerProbe[] = [];

    for (let row = 0; row < GRID_ROWS; row += 1) {
      for (let col = 0; col < GRID_COLS; col += 1) {
        const anchor = document.createElement("div");
        anchor.style.cssText = "position: absolute; width: 0; height: 0;";

        const vector = document.createElement("div");
        vector.style.cssText = `${vectorLineStyle}
          background: linear-gradient(90deg, rgba(120, 234, 255, 0.08), rgba(120, 234, 255, 0.72));
        `;

        const marker = document.createElement("div");
        marker.style.cssText = `
          position: absolute;
          width: 3px;
          height: 3px;
          left: -1.5px;
          top: -1.5px;
          border-radius: 50%;
          background: rgba(120, 234, 255, 0.34);
        `;

        anchor.append(vector, marker);
        eulerLayer.appendChild(anchor);

        probes.push({
          anchor,
          vector,
          u: (col / (GRID_COLS - 1)) * 2 - 1,
          v: (row / (GRID_ROWS - 1)) * 2 - 1,
        });
      }
    }

    const getVelocity = (
      x: number,
      y: number,
      timeMs: number,
      halfW: number,
      halfH: number,
    ): FlowSample => {
      const nx = x / (halfW || 1);
      const ny = y / (halfH || 1);

      const swirl = 0.64;
      const waveX = 0.28 * Math.sin(ny * 4.2 + timeMs * 0.0018);
      const waveY = 0.3 * Math.cos(nx * 3.2 - timeMs * 0.00135);
      const pulse = 0.2 * Math.sin((nx * nx + ny * ny) * 8 - timeMs * 0.0016);

      return {
        vx: (-ny * swirl + waveX + nx * pulse) * 118,
        vy: (nx * swirl + waveY + ny * pulse) * 118,
      };
    };

    const backgroundParticles: Particle[] = Array.from({ length: BACKGROUND_PARTICLES }, () => {
      const element = document.createElement("div");
      element.className = "lagrangian-particle";
      element.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        left: -2px;
        top: -2px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.78);
        box-shadow: 0 0 9px rgba(255, 255, 255, 0.42);
        will-change: transform, opacity;
      `;
      lagrangianLayer.appendChild(element);

      return {
        element,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        seed: Math.random() * Math.PI * 2,
      };
    });

    const trackedParticle: Particle = {
      element: highlightedParticle,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      seed: 0,
    };

    const trail: TrailPoint[] = [];

    const clamp = (value: number, min: number, max: number) => {
      if (value < min) return min;
      if (value > max) return max;
      return value;
    };

    const resetParticle = (particle: Particle, halfW: number, halfH: number) => {
      particle.x = (Math.random() * 2 - 1) * halfW * 0.92;
      particle.y = (Math.random() * 2 - 1) * halfH * 0.92;
      particle.vx = 0;
      particle.vy = 0;
    };

    const resetTracked = () => {
      trackedParticle.x = lagHalfWidth * 0.1;
      trackedParticle.y = -lagHalfHeight * 0.24;
      trackedParticle.vx = 0;
      trackedParticle.vy = 0;
      trail.length = 0;
    };

    const setupSizes = () => {
      eulerWidth = eulerPanel.clientWidth;
      eulerHeight = eulerPanel.clientHeight;
      eulerHalfWidth = eulerWidth * 0.4;
      eulerHalfHeight = eulerHeight * 0.36;

      lagWidth = lagrangianPanel.clientWidth;
      lagHeight = lagrangianPanel.clientHeight;
      lagHalfWidth = lagWidth * 0.4;
      lagHalfHeight = lagHeight * 0.36;

      for (const particle of backgroundParticles) {
        const outside = Math.abs(particle.x) > lagHalfWidth || Math.abs(particle.y) > lagHalfHeight;
        if (outside || (particle.x === 0 && particle.y === 0)) {
          resetParticle(particle, lagHalfWidth, lagHalfHeight);
        }
      }

      if (!trail.length) {
        resetTracked();
      } else {
        trackedParticle.x = clamp(trackedParticle.x, -lagHalfWidth * 0.95, lagHalfWidth * 0.95);
        trackedParticle.y = clamp(trackedParticle.y, -lagHalfHeight * 0.95, lagHalfHeight * 0.95);
      }
    };

    setupSizes();
    window.addEventListener("resize", setupSizes);

    const eulerProbePosition = {
      x: 0,
      y: 0,
    };

    let rafId = 0;
    let prevTime = performance.now();

    const renderTrail = () => {
      if (trail.length < 2) {
        lagTrailPath.setAttribute("d", "");
        return;
      }

      let d = "";
      for (let i = 0; i < trail.length; i += 1) {
        const point = trail[i];
        const px = ((point.x + lagWidth / 2) / lagWidth) * 100;
        const py = ((point.y + lagHeight / 2) / lagHeight) * 100;
        d += i === 0 ? `M ${px} ${py}` : ` L ${px} ${py}`;
      }
      lagTrailPath.setAttribute("d", d);
    };

    const frame = (timeMs: number) => {
      const dt = Math.min(0.048, Math.max(0.008, (timeMs - prevTime) / 1000));
      prevTime = timeMs;

      eulerProbePosition.x = eulerHalfWidth * 0.16;
      eulerProbePosition.y = -eulerHalfHeight * 0.08;

      const eulerCenterX = eulerWidth / 2;
      const eulerCenterY = eulerHeight / 2;
      const lagCenterX = lagWidth / 2;
      const lagCenterY = lagHeight / 2;

      for (const probe of probes) {
        const x = probe.u * eulerHalfWidth;
        const y = probe.v * eulerHalfHeight;
        const vel = getVelocity(x, y, timeMs, eulerHalfWidth, eulerHalfHeight);
        const speed = Math.hypot(vel.vx, vel.vy);
        const angle = Math.atan2(vel.vy, vel.vx);
        const length = Math.min(30, 7 + speed * 0.085);

        probe.anchor.style.transform = `translate3d(${eulerCenterX + x}px, ${eulerCenterY + y}px, 0)`;
        probe.vector.style.transform = `rotate(${angle}rad)`;
        probe.vector.style.width = `${length}px`;
        probe.vector.style.opacity = String(Math.min(0.95, 0.25 + speed * 0.009));
      }

      const eulerProbeVel = getVelocity(
        eulerProbePosition.x,
        eulerProbePosition.y,
        timeMs,
        eulerHalfWidth,
        eulerHalfHeight,
      );

      const eulerProbeSpeed = Math.hypot(eulerProbeVel.vx, eulerProbeVel.vy);
      const eulerProbeAngle = Math.atan2(eulerProbeVel.vy, eulerProbeVel.vx);
      const eulerProbeLength = Math.min(44, 12 + eulerProbeSpeed * 0.11);

      eulerProbeWrap.style.transform = `translate3d(${eulerCenterX + eulerProbePosition.x}px, ${eulerCenterY + eulerProbePosition.y}px, 0)`;
      eulerProbeVector.style.transform = `rotate(${eulerProbeAngle}rad)`;
      eulerProbeVector.style.width = `${eulerProbeLength}px`;
      eulerProbeReadout.textContent = `u(x0, t) = (${(eulerProbeVel.vx / 100).toFixed(2)}, ${(eulerProbeVel.vy / 100).toFixed(2)})`;

      for (const particle of backgroundParticles) {
        const vel = getVelocity(
          particle.x,
          particle.y,
          timeMs + particle.seed * 130,
          lagHalfWidth,
          lagHalfHeight,
        );
        particle.vx = particle.vx * 0.9 + vel.vx * 0.1;
        particle.vy = particle.vy * 0.9 + vel.vy * 0.1;
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;

        if (
          particle.x < -lagHalfWidth ||
          particle.x > lagHalfWidth ||
          particle.y < -lagHalfHeight ||
          particle.y > lagHalfHeight
        ) {
          resetParticle(particle, lagHalfWidth, lagHalfHeight);
        }

        const speed = Math.hypot(particle.vx, particle.vy);
        particle.element.style.transform = `translate3d(${lagCenterX + particle.x}px, ${lagCenterY + particle.y}px, 0)`;
        particle.element.style.opacity = String(Math.min(0.95, 0.25 + speed * 0.006));
      }

      const trackedVel = getVelocity(
        trackedParticle.x,
        trackedParticle.y,
        timeMs,
        lagHalfWidth,
        lagHalfHeight,
      );

      trackedParticle.vx = trackedParticle.vx * 0.88 + trackedVel.vx * 0.12;
      trackedParticle.vy = trackedParticle.vy * 0.88 + trackedVel.vy * 0.12;
      trackedParticle.x += trackedParticle.vx * dt;
      trackedParticle.y += trackedParticle.vy * dt;

      if (
        trackedParticle.x < -lagHalfWidth ||
        trackedParticle.x > lagHalfWidth ||
        trackedParticle.y < -lagHalfHeight ||
        trackedParticle.y > lagHalfHeight
      ) {
        resetTracked();
      }

      const tx = lagCenterX + trackedParticle.x;
      const ty = lagCenterY + trackedParticle.y;
      highlightedParticle.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;

      const trackedSpeed = Math.hypot(trackedVel.vx, trackedVel.vy);
      const trackedAngle = Math.atan2(trackedVel.vy, trackedVel.vx);
      const trackedLength = Math.min(48, 14 + trackedSpeed * 0.12);
      highlightedVector.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${trackedAngle}rad)`;
      highlightedVector.style.width = `${trackedLength}px`;

      trail.push({ x: tx, y: ty });
      if (trail.length > TRAIL_SIZE) {
        trail.shift();
      }
      renderTrail();

      lagReadout.textContent = `X(t) = (${(trackedParticle.x / 100).toFixed(2)}, ${(trackedParticle.y / 100).toFixed(2)})`;

      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", setupSizes);
      mediaQuery.removeEventListener("change", applyResponsiveLayout);
      root.innerHTML = "";
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
