import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { NOTES_DATA, SAINS_DATA } from "@/constants";

// Import all MDX files dynamically
const portfolioModules = import.meta.glob("/content/sains/*.mdx");
const notesModules = import.meta.glob("/content/notes/*.mdx");

interface MDXModule {
  default: React.ComponentType;
}

interface MDXPageProps {
  category: "notes" | "sains";
}

const MDXPage: React.FC<MDXPageProps> = ({ category }) => {
  const { slug } = useParams<{ slug: string }>();
  const [Content, setContent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadMDX = async () => {
      setLoading(true);
      setError(false);

      const modules = category === "sains" ? portfolioModules : notesModules;
      const path = `/content/${category}/${slug}.mdx`;

      if (modules[path]) {
        try {
          const module = (await modules[path]()) as MDXModule;
          setContent(() => module.default);
        } catch (e) {
          console.error("Failed to load MDX:", e);
          setError(true);
        }
      } else {
        setError(true);
      }

      setLoading(false);
    };

    loadMDX();
  }, [category, slug]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[var(--bg-color)] text-[var(--text-color)] font-mono flex items-center justify-center">
        <div className="text-sm uppercase tracking-wider opacity-60">
          Loading...
        </div>
      </div>
    );
  }

  if (error || !Content) {
    return (
      <div className="min-h-screen w-full bg-[var(--bg-color)] text-[var(--text-color)] font-mono flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-wider mb-4 uppercase">
            Content Not Found
          </h1>
          <p className="opacity-60 uppercase tracking-wider text-sm mb-8">
            This page doesn't exist yet
          </p>
          <Link
            to="/"
            className="text-sm opacity-60 hover:opacity-100 uppercase tracking-wider transition-opacity"
          >
            &larr; Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const items = category === "sains" ? SAINS_DATA : NOTES_DATA;
  const currentItem = items.find((item) => item.slug === slug);
  const title =
    currentItem?.value || slug?.replace(/-/g, " ").toUpperCase() || "";
  const date = currentItem?.date || "";

  return (
    <div className="min-h-screen w-full bg-[var(--bg-color)] text-[var(--text-color)] font-mono">
      {/* Header */}
      <header className="w-full max-w-[1200px] mx-auto p-6 md:p-12 lg:p-16">
        <div className="mb-8">
          <span className="text-xs opacity-50 uppercase tracking-wider">
            {category}
          </span>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-wider mt-2 uppercase">
            {title}
          </h1>
          {date ? (
            <div className="mt-4 text-xs opacity-50 uppercase tracking-wider">
              {date}
            </div>
          ) : null}
          <div className="mt-6 border-t border-white/20" />
        </div>
      </header>

      {/* Content */}
      <main className="w-full max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16 pb-16">
        <article className="blog-content prose prose-invert max-w-none">
          <Content />
        </article>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-[1200px] mx-auto p-6 md:p-12 lg:p-16 border-t border-white/10">
        <Link
          to="/"
          className="back-button inline-flex items-center text-sm opacity-60 hover:opacity-100 uppercase tracking-wider"
        >
          <span className="mr-2">&larr;</span>
          BACK TO HOME
        </Link>
      </footer>
    </div>
  );
};

export default MDXPage;
