import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    server: {
      port: 3000,
      host: "0.0.0.0",
    },
    plugins: [
      { enforce: "pre", ...mdx() },
      react({ include: /\.(mdx|js|jsx|ts|tsx)$/ }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    // Enable glob imports for dynamic MDX loading
    optimizeDeps: {
      include: ["react", "react-dom", "react-router-dom"],
    },
  };
});
