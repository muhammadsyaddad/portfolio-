import React from "react";
import { Link } from "react-router-dom";

interface BlogPostLayoutProps {
  title: string;
  date: string;
  category: string;
  tags: string[];
  children: React.ReactNode;
}

const BlogPostLayout: React.FC<BlogPostLayoutProps> = ({
  title,
  date,
  category,
  tags,
  children,
}) => {
  return (
    <div className="min-h-screen w-full bg-[var(--bg-color)] text-[var(--text-color)] font-mono">
      {/* Header */}
      <header className="w-full max-w-[1200px] mx-auto p-6 md:p-12 lg:p-16">
        {/*<Link
          to="/"
          className="back-button inline-flex items-center text-sm opacity-60 hover:opacity-100 uppercase tracking-wider mb-8"
        >
          <span className="mr-2">&larr;</span>
          BACK TO HOME
        </Link>*/}

        <div className="mb-8">
          <span className="text-xs opacity-50 uppercase tracking-wider">
            {category} / {date}
          </span>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-wider mt-2 uppercase">
            {title}
          </h1>
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 bg-white/10 rounded uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="w-full max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16 pb-16">
        <article className="blog-content prose prose-invert max-w-none">
          {children}
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

export default BlogPostLayout;
