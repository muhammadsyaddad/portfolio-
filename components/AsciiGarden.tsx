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
  // Pine – tall triangular conifer
  [
    "     ^     ",
    "    /|\\    ",
    "   /|||\\   ",
    "  /|||||\\  ",
    " /___|___\\ ",
    "     |     ",
    "     |     ",
    "    /|\\    ",
  ],
  // Oak – wide foliage dome
  [
    "    .=.    ",
    "  .(%%%).  ",
    " (%%%%%%%)",
    "  (%%%%%) ",
    "   ')('   ",
    "    ||    ",
    "    ||    ",
    "   /||\\   ",
  ],
  // Willow – cascading droopy branches
  [
    "   .-.   ",
    "  (   )  ",
    " /|||||\\",
    " |||||||| ",
    "  \\|||/  ",
    "   |||   ",
    "    |    ",
    "   /|\\   ",
  ],
];

// ── Animation frames ────────────────────────────────────────────
const BIRD_FRAMES = ["~v~", "~^~", "~-~"];
const BUTTERFLY_FRAMES = ["}{", ")(", "||", ")("];
const STAR_CHARS = [".", "+", "*", ".", " ", " "];
const FLOWER_HEADS = ["@", "*", "o", "%", "&"];

// ── Tall grass shapes (stamped on terrain surface) ──────────────
const GRASS_SHAPES = [
  ["\\|/"],
  [" | ", "\\|/"],
  ["|||"],
];

// ── Rock shapes ─────────────────────────────────────────────────
const ROCK_SHAPES = [
  [".__.", "(__)"],
  [" /\\ ", "/  \\"],
  ["(O)"],
];

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
interface GrassClump {
  x: number;
  shape: string[];
}
interface Rock {
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
const AsciiGarden: React.FC = () => {
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
    grassClumps: GrassClump[];
    rocks: Rock[];
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
    grassClumps: [],
    rocks: [],
    terrainH: [],
    cols: 0,
    rows: 0,
    groundY: 0,
  });

  const initScene = useCallback((cols: number, rows: number) => {
    const s = stateRef.current;
    s.cols = cols;
    s.rows = rows;
    s.groundY = rows - 1;

    const rand = srand(cols * 7 + rows * 13);

    // ── Clouds (disabled – terrain-only mode) ───────
    s.clouds = [];

    // ── Stars (disabled – terrain-only mode) ────────
    s.stars = [];

    // ── Birds (disabled – terrain-only mode) ────────
    s.birds = [];

    // ── Terrain ─────────────────────────────────────
    // Generate rolling hills using multiple overlapping sine waves
    // The terrain occupies the full height of the canvas
    s.terrainH = new Array(cols).fill(0);
    const maxTerrainH = Math.floor(rows * 0.9);

    // Layer multiple sine waves for organic terrain
    for (let c = 0; c < cols; c++) {
      let h = 0;
      // Base rolling wave
      h += Math.sin((c / cols) * Math.PI * 2.5 + 0.5) * maxTerrainH * 0.25;
      // Secondary bumps
      h += Math.sin((c / cols) * Math.PI * 5 + 1.2) * maxTerrainH * 0.15;
      // Small variation
      h += Math.sin((c / cols) * Math.PI * 11 + 3.0) * maxTerrainH * 0.06;
      // Base height – terrain fills most of the canvas
      h += maxTerrainH * 0.6;
      s.terrainH[c] = Math.max(2, Math.min(maxTerrainH, Math.round(h)));
    }

    // ── Trees ───────────────────────────────────────
    s.trees = [];
    const treeCount = Math.min(3, Math.max(1, Math.floor(cols / 18)));
    const treeSpacing = cols / (treeCount + 1);
    for (let i = 0; i < treeCount; i++) {
      const tx = Math.floor(treeSpacing * (i + 1)) - 5;
      s.trees.push({
        x: Math.max(0, tx),
        shape: TREES[i % TREES.length],
      });
    }

    // ── Flowers ─────────────────────────────────────
    s.flowers = [];
    const taken = new Set<number>();
    for (const t of s.trees) {
      for (let dx = -2; dx < 13; dx++) taken.add(t.x + dx);
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

    // ── Grass clumps ────────────────────────────────
    s.grassClumps = [];
    const grassCount = Math.max(4, Math.floor(cols / 6));
    for (let i = 0; i < grassCount; i++) {
      const gx = 1 + Math.floor(rand() * (cols - 4));
      if (taken.has(gx) || taken.has(gx + 1) || taken.has(gx + 2)) continue;
      taken.add(gx);
      taken.add(gx + 1);
      taken.add(gx + 2);
      s.grassClumps.push({
        x: gx,
        shape: GRASS_SHAPES[Math.floor(rand() * GRASS_SHAPES.length)],
      });
    }

    // ── Rocks ───────────────────────────────────────
    s.rocks = [];
    const rockCount = Math.max(2, Math.floor(cols / 15));
    for (let i = 0; i < rockCount; i++) {
      const rx = 2 + Math.floor(rand() * (cols - 6));
      if (taken.has(rx) || taken.has(rx + 1) || taken.has(rx + 2) || taken.has(rx + 3)) continue;
      for (let dx = 0; dx < 5; dx++) taken.add(rx + dx);
      s.rocks.push({
        x: rx,
        shape: ROCK_SHAPES[Math.floor(rand() * ROCK_SHAPES.length)],
      });
    }

    // ── Butterflies ─────────────────────────────────
    // Position butterflies just above the average terrain surface
    s.butterflies = [];
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
  }, []);

  const buildFrame = useCallback((tick: number) => {
    const s = stateRef.current;
    const { cols, rows, groundY, terrainH } = s;
    if (!cols || !rows) return "";

    const g: string[][] = [];
    for (let r = 0; r < rows; r++) g[r] = new Array(cols).fill(EMPTY);

    // ── Stars (disabled) ──────────────────────────────

    // ── Moon (disabled) ─────────────────────────────

    // ── Clouds (disabled) ───────────────────────────

    // ── Birds (disabled) ────────────────────────────

    // ── Terrain fill ────────────────────────────────
    const SURFACE_CHARS = ["~", "'", ".", "_", "-", "~", "'"];
    const SUBSURFACE_CHARS = [".", ":", ",", "'", ";", "\""];
    const DEEP_CHARS = [".", ":", ",", "'"];

    for (let c = 0; c < cols; c++) {
      const h = terrainH[c];
      if (h <= 0) continue;
      const surfaceY = groundY - h;

      // Surface line (top of terrain) with slope detection
      if (surfaceY >= 0 && surfaceY < rows) {
        const hLeft = c > 0 ? terrainH[c - 1] : h;
        const hRight = c < cols - 1 ? terrainH[c + 1] : h;

        if (h > hLeft + 1) {
          g[surfaceY][c] = "/";
        } else if (h > hRight + 1) {
          g[surfaceY][c] = "\\";
        } else {
          g[surfaceY][c] = SURFACE_CHARS[(c * 7 + 3) % SURFACE_CHARS.length];
        }
      }

      // Sub-surface rows (2-3 rows below surface) – dense texture
      for (let dy = 1; dy <= 3; dy++) {
        const fy = surfaceY + dy;
        if (fy >= 0 && fy < rows && fy < groundY && g[fy][c] === EMPTY) {
          const hash = (c * 31 + fy * 17 + dy * 7) % 10;
          if (hash < 7) {
            // 70% fill for sub-surface
            g[fy][c] = SUBSURFACE_CHARS[(c * 13 + fy * 11) % SUBSURFACE_CHARS.length];
          }
        }
      }

      // Upper soil (rows 4-8 below surface) – medium density
      for (let dy = 4; dy <= 8; dy++) {
        const fy = surfaceY + dy;
        if (fy >= 0 && fy < rows && fy < groundY && g[fy][c] === EMPTY) {
          const hash = (c * 31 + fy * 17) % 10;
          if (hash < 4) {
            // 40% fill for upper soil
            g[fy][c] = DEEP_CHARS[(c * 7 + fy * 3) % DEEP_CHARS.length];
          }
        }
      }

      // Lower soil (deeper rows) – lighter fill
      for (let fy = surfaceY + 9; fy < groundY; fy++) {
        if (fy >= 0 && fy < rows && g[fy][c] === EMPTY) {
          const hash = (c * 31 + fy * 17) % 10;
          if (hash < 2) {
            // 20% fill for deep soil
            g[fy][c] = DEEP_CHARS[(c * 3 + fy * 7) % DEEP_CHARS.length];
          }
        }
      }
    }

    // ── Trees on terrain ────────────────────────────
    for (const tree of s.trees) {
      const treeH = tree.shape.length;
      const cx = tree.x + 5;
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

      // Flower head
      if (headY >= 0 && headY < rows && hx >= 0 && hx < cols) {
        if (
          g[headY][hx] === EMPTY ||
          g[headY][hx] === "." ||
          g[headY][hx] === "~"
        ) {
          g[headY][hx] = fl.head;
        }
      }

      // Leaves on taller flowers (h >= 2)
      if (fl.h >= 2) {
        const leafY = headY + 1;
        if (leafY >= 0 && leafY < rows) {
          const lx = fl.x - 1;
          const rx = fl.x + 1;
          if (lx >= 0 && lx < cols && g[leafY][lx] === EMPTY) {
            g[leafY][lx] = "/";
          }
          if (rx >= 0 && rx < cols && g[leafY][rx] === EMPTY) {
            g[leafY][rx] = "\\";
          }
        }
      }

      // Stem
      for (let sy = headY + 1; sy < baseY; sy++) {
        if (sy >= 0 && sy < rows && fl.x >= 0 && fl.x < cols) {
          if (g[sy][fl.x] === EMPTY || g[sy][fl.x] === "." || g[sy][fl.x] === "~") {
            g[sy][fl.x] = "|";
          }
        }
      }
    }

    // ── Grass clumps on terrain ─────────────────────
    for (const gc of s.grassClumps) {
      const cx = gc.x + 1;
      const localH = cx >= 0 && cx < cols ? terrainH[cx] : 0;
      const baseY = groundY - localH;
      const shapeH = gc.shape.length;
      const startY = baseY - shapeH;
      for (let r = 0; r < shapeH; r++) {
        stamp(g, gc.shape[r], startY + r, gc.x, cols, rows);
      }
    }

    // ── Rocks on terrain ────────────────────────────
    for (const rk of s.rocks) {
      const cx = rk.x + Math.floor(rk.shape[0].length / 2);
      const localH = cx >= 0 && cx < cols ? terrainH[cx] : 0;
      const baseY = groundY - localH;
      const shapeH = rk.shape.length;
      const startY = baseY - shapeH;
      for (let r = 0; r < shapeH; r++) {
        stamp(g, rk.shape[r], startY + r, rk.x, cols, rows);
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
      className="hidden lg:flex lg:col-span-3 items-end overflow-visible"
      style={{ marginTop: "-400px", paddingTop: "400px" }}
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
          margin: 0,
        }}
      />
    </div>
  );
};

export default AsciiGarden;
