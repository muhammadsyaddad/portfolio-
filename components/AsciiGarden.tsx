import React, { useRef, useEffect, useCallback } from "react";

const EMPTY = " ";

// ── Clouds ──────────────────────────────────────────────────────
const CLOUDS = [
  ["  .-~~-.  ", ".'      `.", "'~~~~~~~~'"],
  [" .--.  ", "(    ) ", " `--'  "],
  ["   .~~.  ", ".-'    '-.", "'~~~~~~~~'"],
];

// ── Trees ───────────────────────────────────────────────────────
const TREES = [
  // Pine
  ["   ^   ", "  /|\\  ", " /_|_\\ ", "   |   "],
  // Round
  ["  .%.  ", " (%%%) ", "  )|(  ", "   |   "],
  // Willow
  ["  ,*,  ", " /|||\\", "  |||  ", "   |   "],
];

// ── Animation frames ────────────────────────────────────────────
const BIRD_FRAMES = ["~v~", "~^~", "~-~"];
const BUTTERFLY_FRAMES = ["}{", ")(", "||", ")("];
const STAR_CHARS = [".", "+", "*", ".", " ", " "];
const FLOWER_HEADS = ["@", "*", "o", "%", "&"];

// ─── Types ──────────────────────────────────────────────────────
interface Mover {
  x: number;
  y: number;
  speed: number;
  frame: number;
  dir: 1 | -1;
}
interface ButterflyState extends Mover {
  baseY: number;
  zigPhase: number;
}
interface Cloud {
  x: number;
  y: number;
  speed: number;
  shape: string[];
}
interface Star {
  x: number;
  y: number;
  frame: number;
  rate: number;
}
interface Flower {
  x: number;
  h: number;
  head: string;
  phase: number;
}
interface TreeInst {
  x: number;
  shape: string[];
}

// ─── Helpers ────────────────────────────────────────────────────
function stamp(
  g: string[][],
  t: string,
  row: number,
  col: number,
  cols: number,
  rows: number,
) {
  for (let i = 0; i < t.length; i++) {
    const c = col + i;
    if (c >= 0 && c < cols && row >= 0 && row < rows && t[i] !== " ") {
      g[row][c] = t[i];
    }
  }
}

function srand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

// ─── Component ──────────────────────────────────────────────────
const AsciiGarden: React.FC<{ variant?: "full" | "footer" }> = ({
  variant = "full",
}) => {
  const preRef = useRef<HTMLPreElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const animRef = useRef<number>(0);

  const stateRef = useRef<{
    clouds: Cloud[];
    birds: Mover[];
    butterflies: ButterflyState[];
    stars: Star[];
    trees: TreeInst[];
    flowers: Flower[];
    terrainH: number[];
    cols: number;
    rows: number;
    groundY: number;
  }>({
    clouds: [],
    birds: [],
    butterflies: [],
    stars: [],
    trees: [],
    flowers: [],
    terrainH: [],
    cols: 0,
    rows: 0,
    groundY: 0,
  });

  const initScene = useCallback((cols: number, rows: number) => {
    const s = stateRef.current;
    const isFooter = variant === "footer";
    s.cols = cols;
    s.rows = rows;
    s.groundY = rows - 2;

    const rand = srand(cols * 7 + rows * 13);

    // ── Clouds ──────────────────────────────────────
    s.clouds = [];
    if (!isFooter) {
      const cloudCount = cols > 35 ? 3 : 2;
      for (let i = 0; i < cloudCount; i++) {
        s.clouds.push({
          x: Math.floor(rand() * cols),
          y: 1 + i * 2,
          speed: 0.03 + rand() * 0.04,
          shape: CLOUDS[i % CLOUDS.length],
        });
      }
    }

    // ── Stars ───────────────────────────────────────
    s.stars = [];
    if (!isFooter) {
      const skyRows = Math.floor(rows * 0.3);
      const starCount = Math.max(3, Math.floor((cols * skyRows) / 50));
      for (let i = 0; i < starCount; i++) {
        s.stars.push({
          x: Math.floor(rand() * cols),
          y: Math.floor(rand() * skyRows),
          frame: Math.floor(rand() * STAR_CHARS.length),
          rate: 0.015 + rand() * 0.03,
        });
      }
    }

    // ── Birds ───────────────────────────────────────
    const birdY = Math.floor(rows * 0.22);
    s.birds = [];
    if (!isFooter) {
      s.birds = [
        { x: Math.floor(cols * 0.2), y: birdY, speed: 0.22, frame: 0, dir: 1 },
        {
          x: Math.floor(cols * 0.7),
          y: birdY + 2,
          speed: 0.18,
          frame: 1.5,
          dir: -1,
        },
      ];
    }

    // ── Terrain ─────────────────────────────────────
    // Generate rolling hills using multiple overlapping sine waves
    // The terrain occupies the lower ~60% of the screen
    s.terrainH = new Array(cols).fill(0);
    const maxTerrainH = Math.floor(rows * (isFooter ? 0.8 : 0.55));

    // Layer multiple sine waves for organic terrain
    for (let c = 0; c < cols; c++) {
      let h = 0;
      // Base rolling wave
      h += Math.sin((c / cols) * Math.PI * 2.5 + 0.5) * maxTerrainH * 0.35;
      // Secondary bumps
      h += Math.sin((c / cols) * Math.PI * 5 + 1.2) * maxTerrainH * 0.2;
      // Small variation
      h += Math.sin((c / cols) * Math.PI * 11 + 3.0) * maxTerrainH * 0.08;
      // Base height (everything sits above ground)
      h += maxTerrainH * (isFooter ? 0.6 : 0.45);
      s.terrainH[c] = Math.max(2, Math.min(maxTerrainH, Math.round(h)));
    }

    // ── Trees ───────────────────────────────────────
    s.trees = [];
    const treeCount = Math.min(3, Math.max(1, Math.floor(cols / 14)));
    const treeSpacing = cols / (treeCount + 1);
    for (let i = 0; i < treeCount; i++) {
      const tx = Math.floor(treeSpacing * (i + 1)) - 3;
      s.trees.push({
        x: Math.max(0, tx),
        shape: TREES[i % TREES.length],
      });
    }

    // ── Flowers ─────────────────────────────────────
    s.flowers = [];
    const taken = new Set<number>();
    for (const t of s.trees) {
      for (let dx = -1; dx < 8; dx++) taken.add(t.x + dx);
    }
    const flowerCount = Math.max(8, Math.floor(cols / 3));
    for (let i = 0; i < flowerCount; i++) {
      const fx = 1 + Math.floor(rand() * (cols - 2));
      if (taken.has(fx)) continue;
      taken.add(fx);
      s.flowers.push({
        x: fx,
        h: 1 + Math.floor(rand() * 2),
        head: FLOWER_HEADS[Math.floor(rand() * FLOWER_HEADS.length)],
        phase: rand() * Math.PI * 2,
      });
    }

    // ── Butterflies ─────────────────────────────────
    // Position butterflies just above the average terrain surface
    s.butterflies = [];
    if (!isFooter) {
      const avgTerrainH = s.terrainH.reduce((a, b) => a + b, 0) / cols;
      const bfY = s.groundY - Math.floor(avgTerrainH) - 4;
      s.butterflies = [
        {
          x: Math.floor(cols * 0.2),
          y: bfY,
          baseY: bfY,
          speed: 0.1,
          frame: 0,
          dir: 1,
          zigPhase: 0,
        },
        {
          x: Math.floor(cols * 0.75),
          y: bfY + 2,
          baseY: bfY + 2,
          speed: 0.08,
          frame: 2,
          dir: -1,
          zigPhase: Math.PI,
        },
      ];
    }
  }, [variant]);

  const buildFrame = useCallback((tick: number) => {
    const s = stateRef.current;
    const { cols, rows, groundY, terrainH } = s;
    if (!cols || !rows) return "";

    const g: string[][] = [];
    for (let r = 0; r < rows; r++) g[r] = new Array(cols).fill(EMPTY);

    // ── Stars ───────────────────────────────────────
    for (const st of s.stars) {
      const ch = STAR_CHARS[Math.floor(st.frame) % STAR_CHARS.length];
      if (st.y >= 0 && st.y < rows && st.x >= 0 && st.x < cols) {
        g[st.y][st.x] = ch;
      }
      st.frame += st.rate;
    }

    // ── Clouds ──────────────────────────────────────
    for (const cl of s.clouds) {
      const cx = Math.floor(cl.x);
      for (let r = 0; r < cl.shape.length; r++) {
        stamp(g, cl.shape[r], cl.y + r, cx, cols, rows);
      }
      cl.x += cl.speed;
      const w = Math.max(...cl.shape.map((l) => l.length));
      if (cl.x > cols + 3) cl.x = -w - 3;
    }

    // ── Birds ───────────────────────────────────────
    for (const b of s.birds) {
      const fr = BIRD_FRAMES[Math.floor(b.frame) % BIRD_FRAMES.length];
      if (b.y >= 0 && b.y < rows) {
        stamp(g, fr, b.y, Math.floor(b.x), cols, rows);
      }
      b.x += b.speed * b.dir;
      b.frame += 0.05;
      if (b.dir === 1 && b.x > cols + 5) {
        b.x = -5;
        b.y =
          Math.floor(rows * 0.18) +
          Math.floor(Math.random() * Math.floor(rows * 0.1));
      } else if (b.dir === -1 && b.x < -5) {
        b.x = cols + 5;
        b.y =
          Math.floor(rows * 0.18) +
          Math.floor(Math.random() * Math.floor(rows * 0.1));
      }
    }

    // ── Terrain fill ────────────────────────────────
    for (let c = 0; c < cols; c++) {
      const h = terrainH[c];
      if (h <= 0) continue;
      const surfaceY = groundY - h;

      // Surface line with texture
      if (surfaceY >= 0 && surfaceY < rows) {
        // Check left and right neighbors for slope direction
        const hLeft = c > 0 ? terrainH[c - 1] : h;
        const hRight = c < cols - 1 ? terrainH[c + 1] : h;

        if (h > hLeft + 1) {
          g[surfaceY][c] = "/";
        } else if (h > hRight + 1) {
          g[surfaceY][c] = "\\";
        } else {
          // Flat or gentle slope surface
          const surfChar = c % 4 === 0 ? "'" : c % 3 === 0 ? "." : "~";
          g[surfaceY][c] = surfChar;
        }
      }

      // Fill the hill body with subtle texture
      for (let fy = surfaceY + 1; fy < groundY; fy++) {
        if (fy >= 0 && fy < rows && g[fy][c] === EMPTY) {
          // Sparse interior detail - mostly empty with occasional dots
          const hash = (c * 31 + fy * 17) % 23;
          if (hash === 0) g[fy][c] = ".";
          else if (hash === 5) g[fy][c] = ":";
          else if (hash === 11) g[fy][c] = "'";
          else if (hash === 15) g[fy][c] = ",";
          // else stays EMPTY - keeps it airy
        }
      }
    }

    // ── Trees on terrain ────────────────────────────
    for (const tree of s.trees) {
      const treeH = tree.shape.length;
      const cx = tree.x + 3;
      const localH = cx >= 0 && cx < cols ? terrainH[cx] : 0;
      const baseY = groundY - localH;
      const startY = baseY - treeH;
      for (let r = 0; r < treeH; r++) {
        stamp(g, tree.shape[r], startY + r, tree.x, cols, rows);
      }
    }

    // ── Flowers on terrain ──────────────────────────
    for (const fl of s.flowers) {
      const localH = fl.x >= 0 && fl.x < cols ? terrainH[fl.x] : 0;
      const baseY = groundY - localH;
      const sway = Math.sin(tick * 0.012 + fl.phase) > 0.4 ? 1 : 0;
      const headY = baseY - fl.h;
      const hx = fl.x + sway;

      if (headY >= 0 && headY < rows && hx >= 0 && hx < cols) {
        if (
          g[headY][hx] === EMPTY ||
          g[headY][hx] === "." ||
          g[headY][hx] === "~"
        ) {
          g[headY][hx] = fl.head;
        }
      }
      for (let sy = headY + 1; sy < baseY; sy++) {
        if (sy >= 0 && sy < rows && fl.x >= 0 && fl.x < cols) {
          g[sy][fl.x] = "|";
        }
      }
    }

    // ── Butterflies ─────────────────────────────────
    for (const bf of s.butterflies) {
      const fr =
        BUTTERFLY_FRAMES[Math.floor(bf.frame) % BUTTERFLY_FRAMES.length];
      const bx = Math.floor(bf.x);
      const by = Math.floor(bf.y);
      if (by >= 0 && by < rows) stamp(g, fr, by, bx, cols, rows);
      bf.zigPhase += 0.04;
      bf.x += bf.speed * bf.dir;
      bf.y = bf.baseY + Math.sin(bf.zigPhase) * 2;
      bf.frame += 0.08;
      if (bf.dir === 1 && bf.x > cols + 3) bf.x = -3;
      else if (bf.dir === -1 && bf.x < -3) bf.x = cols + 3;
    }

    // ── Ground line ─────────────────────────────────
    // No explicit ground line - terrain flows into bottom

    // ── Animated grass at bottom edge ───────────────
    const gt = Math.floor(tick * 0.025);
    const lastRow = rows - 1;
    if (lastRow >= 0 && lastRow < rows) {
      for (let c = 0; c < cols; c++) {
        if (g[lastRow][c] === EMPTY) {
          const p = (c + gt) % 4;
          g[lastRow][c] = p === 0 ? "^" : p === 1 ? '"' : p === 2 ? "v" : "'";
        }
      }
    }

    return g.map((row) => row.join("")).join("\n");
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const pre = preRef.current;
    if (!container || !pre) return;

    let lastTime = 0;
    const INTERVAL = 1000 / 8;

    const measure = () => {
      const r = container.getBoundingClientRect();
      return {
        cols: Math.max(20, Math.floor(r.width / 6.6)),
        rows: Math.max(15, Math.floor(r.height / 15)),
      };
    };

    const { cols, rows } = measure();
    initScene(cols, rows);

    const loop = (time: number) => {
      animRef.current = requestAnimationFrame(loop);
      const dt = time - lastTime;
      if (dt < INTERVAL) return;
      lastTime = time - (dt % INTERVAL);
      frameRef.current++;
      const out = buildFrame(frameRef.current);
      if (pre && out) pre.textContent = out;
    };
    animRef.current = requestAnimationFrame(loop);

    const onResize = () => {
      const { cols, rows } = measure();
      initScene(cols, rows);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [initScene, buildFrame]);

  return (
    <div
      ref={containerRef}
      className="hidden lg:flex lg:col-span-3 h-full overflow-hidden"
    >
      <pre
        ref={preRef}
        className="select-none pointer-events-none"
        style={{
          fontSize: "11px",
          lineHeight: "15px",
          color: "rgba(255, 255, 255, 0.18)",
          fontFamily: '"JetBrains Mono", monospace',
          whiteSpace: "pre",
          overflow: "hidden",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default AsciiGarden;
