import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import AICreativeSuiteDashboard from "@/pages/portfolio/AICreativeSuiteDashboard";
import ImmersiveWebGLLandingPage from "@/pages/portfolio/ImmersiveWebGLLandingPage";
import BuildingWithAI from "@/pages/notes/BuildingWithAI";
import TypeScriptBestPractices from "@/pages/notes/TypeScriptBestPractices";
import GenerativeArtExperiments from "@/pages/canvas/GenerativeArtExperiments";

// Placeholder component for routes that don't have dedicated pages yet
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

        {/* Portfolio Routes */}
        <Route
          path="/portfolio/ai-creative-suite-dashboard"
          element={<AICreativeSuiteDashboard />}
        />
        <Route
          path="/portfolio/immersive-webgl-landing-page"
          element={<ImmersiveWebGLLandingPage />}
        />
        <Route
          path="/portfolio/:slug"
          element={<ComingSoon title="Portfolio Project" />}
        />

        {/* Notes Routes */}
        <Route path="/notes/building-with-ai" element={<BuildingWithAI />} />
        <Route
          path="/notes/typescript-best-practices"
          element={<TypeScriptBestPractices />}
        />
        <Route
          path="/notes/:slug"
          element={<ComingSoon title="Notes Article" />}
        />

        {/* Canvas Routes */}
        <Route
          path="/canvas/generative-art-experiments"
          element={<GenerativeArtExperiments />}
        />
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
