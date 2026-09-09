import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from 'sanity/presentation'
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import { structure } from "./structure";

export default defineConfig({
  name: "BergDesignBuild",
  title: "BergDesignBuild",

  projectId: import.meta.env.SANITY_STUDIO_PROJECT_ID || "rsubygyt",
  dataset: import.meta.env.SANITY_STUDIO_DATASET || "production",

  plugins: [
    structureTool({ structure }), visionTool(),
    presentationTool({
      previewUrl: 'http://localhost:4321', // URL of your local Astro server
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
