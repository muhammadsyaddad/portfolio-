import React from "react";
import { Link } from "react-router-dom";

interface CanvasLayoutProps {
  children: React.ReactNode;
}

const CanvasLayout: React.FC<CanvasLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen w-full bg-[var(--bg-color)] text-[var(--text-color)] font-mono overflow-hidden relative">
      {/* Back button - floating */}
      <Link
        to="/"
        className="back-button fixed top-6 left-6 z-50 inline-flex items-center text-sm opacity-40 hover:opacity-100 uppercase tracking-wider transition-opacity"
      >
        <span className="mr-2">&larr;</span>
        BACK
      </Link>

      {/* Canvas container - full screen */}
      <div className="w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default CanvasLayout;
