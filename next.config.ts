import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

/* Localised app screenshots: public/screens/<lang>/<name>.webp. The list of files present is
   read once here and inlined into the client (see app/screens.ts), so the site never asks for
   a screenshot that does not exist. Adding a file only needs a new build (or a dev restart). */
function localisedScreens(): Record<string, string[]> {
  const root = path.join(process.cwd(), "public", "screens");
  const out: Record<string, string[]> = {};
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    out[entry.name] = fs
      .readdirSync(path.join(root, entry.name))
      .filter((f) => f.endsWith(".webp"))
      .map((f) => f.slice(0, -".webp".length));
  }
  return out;
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SCREENS: JSON.stringify(localisedScreens()),
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
