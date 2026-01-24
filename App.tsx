import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import MDXPage from "@/components/MDXPage";

// Canvas pages - import directly since they are TSX components
import GenerativeArtExperiments from "@/pages/canvas/GenerativeArtExperiments";
import TypographyStudies from "@/pages/canvas/TypographyStudies";
import ShaderPlayground from "@/pages/canvas/ShaderPlayground";
import MotionDesignExplorations from "@/pages/canvas/MotionDesignExplorations";
import AbstractDataViz from "@/pages/canvas/AbstractDataViz";
import InteractiveInstallations from "@/pages/canvas/InteractiveInstallations";
import AudioReactiveVisuals from "@/pages/canvas/AudioReactiveVisuals";
import ParticleSystemsStudy from "@/pages/canvas/ParticleSystemsStudy";
import CreativeCodingSketches from "@/pages/canvas/CreativeCodingSketches";
import ProceduralTextures from "@/pages/canvas/ProceduralTextures";

// Placeholder component for routes that don't have content yet
const ComingSoon: React.FC<{ title: string }> = ({ title }) => (
  <div className="min-h-screen w-full bg-[var(--bg-color)] text-[var(--text-color)] font-mono flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold tracking-wider mb-4 uppercase">
        {title}
      </h1>
      <p className="opacity-60 uppercase tracking-wider text-sm mb-8">
        Content coming soon
      </p>
      <a
        href="/"
        className="text-sm opacity-60 hover:opacity-100 uppercase tracking-wider transition-opacity"
      >
        &larr; Back to Home
      </a>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<HomePage />} />

        {/* Portfolio Routes - Dynamic MDX loading */}
        <Route
          path="/portfolio/:slug"
          element={<MDXPage category="portfolio" />}
        />

        {/* Notes Routes - Dynamic MDX loading */}
        <Route
          path="/notes/:slug"
          element={<MDXPage category="notes" />}
        />

        {/* Canvas Routes - Static TSX components with animations */}
        <Route path="/canvas/generative-art-experiments" element={<GenerativeArtExperiments />} />
        <Route path="/canvas/3d-typography-studies" element={<TypographyStudies />} />
        <Route path="/canvas/shader-playground" element={<ShaderPlayground />} />
        <Route path="/canvas/motion-design-explorations" element={<MotionDesignExplorations />} />
        <Route path="/canvas/abstract-data-viz" element={<AbstractDataViz />} />
        <Route path="/canvas/interactive-installations" element={<InteractiveInstallations />} />
        <Route path="/canvas/audio-reactive-visuals" element={<AudioReactiveVisuals />} />
        <Route path="/canvas/particle-systems-study" element={<ParticleSystemsStudy />} />
        <Route path="/canvas/creative-coding-sketches" element={<CreativeCodingSketches />} />
        <Route path="/canvas/procedural-textures" element={<ProceduralTextures />} />

        {/* Fallback for unknown canvas routes */}
        <Route
          path="/canvas/:slug"
          element={<ComingSoon title="Canvas Experiment" />}
        />

        {/* 404 */}
        <Route path="*" element={<ComingSoon title="Page Not Found" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
