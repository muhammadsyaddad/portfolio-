import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import MDXPage from "@/components/MDXPage";
import LagrangianAnimation from "@/pages/canvas/LagrangianAnimation";
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
        <Route path="/" element={<HomePage />} />
        <Route path="/sains/:slug" element={<MDXPage category="sains" />} />
        <Route path="/notes/:slug" element={<MDXPage category="notes" />} />
        <Route path="/canvas/lagrangian" element={<LagrangianAnimation />} />
        <Route path="*" element={<ComingSoon title="Page Not Found" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
