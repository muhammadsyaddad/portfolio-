import React, { useRef, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Lenis from "lenis";
import {
  PORTFOLIO_DATA,
  NOTES_DATA,
  CANVAS_DATA,
  PERSONAL_DETAILS,
  SOCIAL_LINKS,
  PROJETCT_PROUDMOST,
  PortfolioItem,
} from "@/constants";

const HomePage: React.FC = () => {
  // Refs for scroll synchronization
  const dateRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const notesRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // State for hover highlighting
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Sync date column with content columns
  const syncDateColumn = useCallback(
    (sourceElement: HTMLDivElement | null, smooth = false) => {
      if (dateRef.current && sourceElement) {
        if (smooth) {
          dateRef.current.scrollTo({
            behavior: "smooth",
            top: sourceElement.scrollTop,
          });
        } else {
          dateRef.current.scrollTop = sourceElement.scrollTop;
        }
      }
    },
    [],
  );

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    syncDateColumn(e.currentTarget, false);
  };

  const handleMouseEnter = (
    ref: React.RefObject<HTMLDivElement | null>,
    column: string,
  ) => {
    syncDateColumn(ref.current, true);
    setActiveColumn(column);
    setHoveredIndex(null);
  };

  const handleMouseLeave = () => {
    setActiveColumn(null);
    setHoveredIndex(null);
  };

  const handleItemHover = (index: number) => {
    setHoveredIndex(index);
  };

  const handleItemLeave = () => {
    setHoveredIndex(null);
  };

  // Get row class based on hover state
  const getRowClass = (index: number, isDate = false) => {
    if (hoveredIndex === null) {
      return isDate ? "opacity-60" : "opacity-90";
    }
    return hoveredIndex === index ? "opacity-100" : "opacity-20";
  };

  // Shared classes
  const ROW_CLASS = "h-6 mb-2 flex items-center";
  const TEXT_CLASS =
    "text-sm leading-none tracking-tight truncate cursor-pointer transition-all duration-300";
  const COL_CLASS =
    "h-full overflow-y-auto no-scrollbar pb-64 pt-8 pointer-events-auto scroll-smooth";

  // Render content column
  const renderColumn = (
    data: PortfolioItem[],
    ref: React.RefObject<HTMLDivElement | null>,
    columnName: string,
  ) => (
    <div
      ref={ref}
      onScroll={handleScroll}
      onMouseEnter={() => handleMouseEnter(ref, columnName)}
      onMouseLeave={handleMouseLeave}
      className={COL_CLASS}
    >
      {data.map((item, i) => (
        <div key={i} className={ROW_CLASS}>
          <Link
            to={`/${item.category}/${item.slug}`}
            className={`${TEXT_CLASS} clickable-item ${getRowClass(i)} hover:opacity-100`}
            onMouseEnter={() => handleItemHover(i)}
            onMouseLeave={handleItemLeave}
          >
            {item.value}
          </Link>
        </div>
      ))}
    </div>
  );

  // Get the current data based on active column
  const getCurrentData = () => {
    switch (activeColumn) {
      case "portfolio":
        return PORTFOLIO_DATA;
      case "notes":
        return NOTES_DATA;
      case "canvas":
        return CANVAS_DATA;
      default:
        return PORTFOLIO_DATA;
    }
  };

  return (
    <div
      ref={containerRef}
      className="h-screen w-full bg-[var(--bg-color)] text-[var(--text-color)] font-mono uppercase overflow-hidden flex flex-col selection:bg-white selection:text-[var(--bg-color)]"
    >
      {/* HEADER */}
      <header className="flex-none w-full max-w-[1800px] mx-auto p-6 md:p-12 lg:p-16 pb-2 md:pb-4 lg:pb-6 z-20 bg-[var(--bg-color)] relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-end">
          <div className="lg:col-span-3 xl:col-span-3">
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-wider inline-block break-words max-w-full">
              MUHAMMAD SYADDAD
            </h1>
          </div>
          <div className="hidden lg:grid lg:col-span-9 xl:col-span-9 grid-cols-[140px_1fr_1fr_1fr] gap-6 text-2xl font-bold tracking-wider">
            <div></div>
            <h2>PORTFOLIO</h2>
            <h2>NOTES</h2>
            <h2>CANVAS</h2>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-12 translate-y-full bg-gradient-to-b from-[var(--bg-color)] to-transparent pointer-events-none z-10" />
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow overflow-hidden min-h-0 w-full max-w-[1800px] mx-auto px-6 md:px-12 lg:px-16 relative z-0">
        <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4">
          <div className="hidden lg:block lg:col-span-3"></div>

          <div className="lg:col-span-9 h-full min-h-0 relative">
            {/* MOBILE (< lg) */}
            <div className={`lg:hidden ${COL_CLASS}`}>
              <div className="mb-12">
                <h2 className="text-lg font-bold tracking-wider mb-4 opacity-50">
                  PORTFOLIO
                </h2>
                {PORTFOLIO_DATA.map((item, i) => (
                  <div
                    key={i}
                    className="mb-4 text-xs md:text-sm leading-snug tracking-tight"
                  >
                    <div className="opacity-60 mb-1">{item.label}</div>
                    <Link
                      to={`/portfolio/${item.slug}`}
                      className="opacity-90 hover:opacity-100 clickable-item block"
                    >
                      {item.value}
                    </Link>
                  </div>
                ))}
              </div>
              <div className="mb-12">
                <h2 className="text-lg font-bold tracking-wider mb-4 opacity-50">
                  NOTES
                </h2>
                {NOTES_DATA.map((item, i) => (
                  <div
                    key={i}
                    className="mb-4 text-xs md:text-sm leading-snug tracking-tight"
                  >
                    <Link
                      to={`/notes/${item.slug}`}
                      className="opacity-90 hover:opacity-100 clickable-item block"
                    >
                      {item.value}
                    </Link>
                  </div>
                ))}
              </div>
              <div className="mb-12">
                <h2 className="text-lg font-bold tracking-wider mb-4 opacity-50">
                  CANVAS
                </h2>
                {CANVAS_DATA.map((item, i) => (
                  <div
                    key={i}
                    className="mb-4 text-xs md:text-sm leading-snug tracking-tight"
                  >
                    <Link
                      to={`/canvas/${item.slug}`}
                      className="opacity-90 hover:opacity-100 clickable-item block"
                    >
                      {item.value}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* DESKTOP (>= lg) */}
            <div className="hidden lg:grid h-full grid-cols-[140px_1fr_1fr_1fr] gap-6">
              {/* DATE COLUMN */}
              <div
                ref={dateRef}
                className={COL_CLASS}
                onMouseEnter={() => setActiveColumn("date")}
              >
                {getCurrentData().map((item, i) => (
                  <div key={i} className={ROW_CLASS}>
                    <span
                      className={`${TEXT_CLASS} cursor-default ${getRowClass(i, true)}`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* PORTFOLIO COLUMN */}
              {renderColumn(PORTFOLIO_DATA, portfolioRef, "portfolio")}

              {/* NOTES COLUMN */}
              {renderColumn(NOTES_DATA, notesRef, "notes")}

              {/* CANVAS COLUMN */}
              {renderColumn(CANVAS_DATA, canvasRef, "canvas")}
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="flex-none w-full bg-[var(--bg-color)] z-30 relative">
        <div className="absolute top-0 left-0 w-full h-24 -translate-y-full bg-gradient-to-t from-[var(--bg-color)] to-transparent pointer-events-none" />
        <div className="w-full max-w-[1800px] mx-auto p-6 md:p-12 lg:p-16 pt-2 md:pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4">
            <div className="hidden lg:block lg:col-span-3"></div>
            <div className="lg:col-span-9 border-t border-white/20 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm leading-snug tracking-tight">
                {PERSONAL_DETAILS.map((item, index) => (
                  <div key={index} className="flex flex-col">
                    <span className="opacity-60 mb-1 text-xs">
                      {item.label}
                    </span>
                    {item.link ? (
                      <a
                        href={item.link}
                        className="opacity-90 font-bold truncate hover:opacity-100 transition-opacity"
                        target={
                          item.link.startsWith("mailto:") ? undefined : "_blank"
                        }
                        rel="noopener noreferrer"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span className="opacity-90 font-bold truncate">
                        {item.value}
                      </span>
                    )}
                  </div>
                ))}
                {/* Social Links */}
                <div className="flex flex-col">
                  <span className="opacity-60 mb-1 text-xs">SOCIAL</span>
                  <div className="flex gap-3">
                    {SOCIAL_LINKS.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-90 font-bold hover:opacity-100 transition-opacity"
                      >
                        {social.label}
                      </a>
                    ))}
                  </div>
                </div>
                {/*The project proud the most */}
                <div className="flex flex-col">
                  <span className="opacity-60 mb-1 text-xs">
                    THE PROJECT LIKE THE MOSTS
                  </span>
                  <div className="flex gap-3">
                    {PROJETCT_PROUDMOST.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-90 font-bold hover:opacity-100 transition-opacity"
                      >
                        {social.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
