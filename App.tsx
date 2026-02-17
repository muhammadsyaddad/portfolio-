import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import MDXPage from "@/components/MDXPage";

// Canvas pages - import directly since they are TSX components
// import GenerativeArtExperiments from "@/pages/canvas/GenerativeArtExperiments";

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
        <Route path="/sains/:slug" element={<MDXPage category="sains" />} />

        {/* Notes Routes - Dynamic MDX loading */}
        <Route path="/notes/:slug" element={<MDXPage category="notes" />} />

        {/*this is example for the canva code*/}
        {/* Canvas Routes - Static TSX components with animations */}
        {/*<Route
          path="/canvas/generative-art-experiments"
          element={<GenerativeArtExperiments />}
        />*/}

        {/* 404 */}
        <Route path="*" element={<ComingSoon title="Page Not Found" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
