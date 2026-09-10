import { defineConfig } from "astro/config";
import sanity from '@sanity/astro';
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  server: {
    host: "0.0.0.0",
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        usePolling: true,
      }
    }
  },
  devToolbar: {
    enabled: false,
  },
  markdown: {
    drafts: true,
    shikiConfig: {
      theme: "css-variables",
    },
  },
  image: {
    domains: ['cdn.sanity.io'],
  },
shikiConfig: {
    wrap: true,
    skipInline: false,
    drafts: true,
  },
  site: "http://localhost:4321",
  integrations: [
    sanity({
      projectId: 'rsubygyt', // Replace with yours
      dataset: 'production',
      useCdn: false, // Must be false for real-time drafts
      stega: {
        studioUrl: 'http://localhost:3333', // URL of your local Sanity Studio
      },
    }),
    sitemap(), // <-- Moved inside the same array!
  ],
});