import React, { useRef } from "react";
import { PROJECT_DATA, PERSONAL_DETAILS } from "./constants";

const App: React.FC = () => {
  // Refs to access the actual DOM elements for scrolling
  const dateRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const notesRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // ---------------------------------------------------------
  // SCROLL SYNCHRONIZATION LOGIC
  // ---------------------------------------------------------

  // This function forces the Date column to match the scroll position
  // of whichever column is currently being interacted with.
  const syncDateColumn = (
    sourceElement: HTMLDivElement | null,
    smooth = false,
  ) => {
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
  };

  // 1. EVENT: SCROLL
  // When the user scrolls a content column, we sync the date immediately.
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    syncDateColumn(e.currentTarget, false);
  };

  // 2. EVENT: MOUSE ENTER
  // When switching columns, snap the date to the new column's position
  const handleMouseEnter = (ref: React.RefObject<HTMLDivElement>) => {
    syncDateColumn(ref.current, true);
  };

  // Shared classes for strict alignment
  const ROW_CLASS = "h-6 mb-2 flex items-center";
  const TEXT_CLASS =
    "text-sm leading-none tracking-tight truncate cursor-default transition-opacity";

  // Column wrapper class: Handles layout + scrolling
  // 'overflow-y-auto' enables scrolling. 'no-scrollbar' hides the bars.
  // 'pb-64' ensures content isn't hidden behind the large footer.
  // 'pointer-events-auto' ensures the div receives scroll events.
  const COL_CLASS =
    "h-full overflow-y-auto no-scrollbar pb-64 pt-8 pointer-events-auto scroll-smooth custom-scroll";
  return (
    <div className="h-screen w-full bg-husky-bg text-husky-text font-mono uppercase overflow-hidden flex flex-col selection:bg-white selection:text-husky-bg">
      {/* HEADER */}
      <header className="flex-none w-full max-w-[1800px] mx-auto p-6 md:p-12 lg:p-16 pb-2 md:pb-4 lg:pb-6 z-20 bg-husky-bg relative">
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
        <div className="absolute bottom-0 left-0 w-full h-12 translate-y-full bg-gradient-to-b from-husky-bg to-transparent pointer-events-none z-10" />
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow overflow-hidden http://localhost:3001 min-h-0 w-full max-w-[1800px] mx-auto px-6 md:px-12 lg:px-16 relative z-0">
        <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4">
          <div className="hidden lg:block lg:col-span-3"></div>

          <div className="lg:col-span-9 h-full min-h-0 relative">
            {/* MOBILE (< lg) */}
            <div className={`lg:hidden ${COL_CLASS}`}>
              <div className="mb-12">
                <h2 className="text-lg font-bold tracking-wider mb-4 opacity-50">
                  PORTFOLIO
                </h2>
                {PROJECT_DATA.map((item, i) => (
                  <div
                    key={i}
                    className="mb-4 text-xs md:text-sm leading-snug tracking-tight"
                  >
                    <div className="opacity-60 mb-1">{item.label}</div>
                    <div className="opacity-90">{item.value}</div>
                  </div>
                ))}
              </div>
              <div className="mb-12">
                <h2 className="text-lg font-bold tracking-wider mb-4 opacity-50">
                  NOTES
                </h2>
                {PROJECT_DATA.map((item, i) => (
                  <div
                    key={i}
                    className="mb-4 text-xs md:text-sm leading-snug tracking-tight"
                  >
                    <div className="opacity-90">{item.value}</div>
                  </div>
                ))}
              </div>
              <div className="mb-12">
                <h2 className="text-lg font-bold tracking-wider mb-4 opacity-50">
                  CANVAS
                </h2>
                {PROJECT_DATA.map((item, i) => (
                  <div
                    key={i}
                    className="mb-4 text-xs md:text-sm leading-snug tracking-tight"
                  >
                    <div className="opacity-90">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* DESKTOP (>= lg) */}
            <div className="hidden lg:grid h-full grid-cols-[140px_1fr_1fr_1fr] gap-6">
              {/* DATE COLUMN */}
              {/* Now enabled for scrolling so user input isn't ignored */}
              <div ref={dateRef} className={COL_CLASS}>
                {PROJECT_DATA.map((item, i) => (
                  <div key={i} className={ROW_CLASS}>
                    <span className={`${TEXT_CLASS} opacity-60`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* PORTFOLIO COLUMN (Master 1) */}
              <div
                ref={portfolioRef}
                onScroll={handleScroll}
                onMouseEnter={() => handleMouseEnter(portfolioRef)}
                className={COL_CLASS}
              >
                {PROJECT_DATA.map((item, i) => (
                  <div key={i} className={ROW_CLASS}>
                    <span
                      className={`${TEXT_CLASS} opacity-90 hover:opacity-100`}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* NOTES COLUMN (Master 2) */}
              <div
                ref={notesRef}
                onScroll={handleScroll}
                onMouseEnter={() => handleMouseEnter(notesRef)}
                className={COL_CLASS}
              >
                {PROJECT_DATA.map((item, i) => (
                  <div key={i} className={ROW_CLASS}>
                    <span
                      className={`${TEXT_CLASS} opacity-90 hover:opacity-100`}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* CANVAS COLUMN (Master 3) */}
              <div
                ref={canvasRef}
                onScroll={handleScroll}
                onMouseEnter={() => handleMouseEnter(canvasRef)}
                className={COL_CLASS}
              >
                {PROJECT_DATA.map((item, i) => (
                  <div key={i} className={ROW_CLASS}>
                    <span
                      className={`${TEXT_CLASS} opacity-90 hover:opacity-100`}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="flex-none w-full bg-husky-bg z-30 relative">
        <div className="absolute top-0 left-0 w-full h-24 -translate-y-full bg-gradient-to-t from-husky-bg to-transparent pointer-events-none" />
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
                    <span className="opacity-90 font-bold truncate">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
