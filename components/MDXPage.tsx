import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
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
  const reduceMotion = useReducedMotion();

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
      <div className="min-h-screen w-full bg-[var(--bg-color)] text-[var(--text-color)] font-serif flex items-center justify-center">
        <div className="text-sm opacity-60">
          Loading...
        </div>
      </div>
    );
  }

  if (error || !Content) {
    return (
      <div className="min-h-screen w-full bg-[var(--bg-color)] text-[var(--text-color)] font-serif flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Content Not Found
          </h1>
          <p className="opacity-60 text-sm mb-8">
            This page doesn't exist yet
          </p>
          <Link
            to="/"
            className="text-sm opacity-60 hover:opacity-100 transition-opacity"
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
    currentItem?.value || slug?.replace(/-/g, " ") || "";
  const date = currentItem?.date || "";

  return (
    <div className="min-h-screen w-full bg-[var(--bg-color)] text-[var(--text-color)] font-serif">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
      {/* Header */}
      <header className="max-w-[680px] box-content mx-auto p-6 md:p-12 lg:p-16">
        <div className="mb-8">
          <span className="text-xs opacity-50">
            {category === "sains" ? "Science" : "Notes"}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mt-2">
            {title}
          </h1>
          {date ? (
            <div className="mt-4 text-xs opacity-50">
              {date}
            </div>
          ) : null}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[680px] box-content mx-auto px-6 md:px-12 lg:px-16 pb-16">
        <article className="blog-content prose prose-invert max-w-none">
          <Content />
        </article>
      </main>
      </motion.div>

      {/* Footer */}
      <footer className="max-w-[680px] box-content mx-auto p-6 md:p-12 lg:p-16">
        <Link
          to="/"
          className="back-button inline-flex items-center text-sm opacity-60 hover:opacity-100"
        >
          <span className="mr-2">&larr;</span>
          Back to home
        </Link>
      </footer>
    </div>
  );
};

export default MDXPage;
