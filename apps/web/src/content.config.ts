import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const team = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/team",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string().optional(),
      bio: z.string().optional(),
      image: z.object({
        url: image(),
        alt: z.string(),
      }),
      socials: z
        .array(
          z.object({
            label: z.string(),
            href: z.string(),
          })
        )
        .optional(),
    }),
});

const news = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/news",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      pubDate: z.date(),
      description: z.string(),
      image: z.object({
        url: image(),
        alt: z.string(),
      }),
      tags: z.array(z.string()),
    }),
});

const legal = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/legal",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: z.object({
    page: z.string(),
    pubDate: z.date(),
  }),
});

const services = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/services",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      excerpt: z.string().optional(),
      image: z.object({
        url: image(),
        alt: z.string(),
      }),
      highlights: z.array(z.string()).optional(),
      featured: z.boolean().optional(),
    }),
});

const projects = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/projects",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      client: z.string().optional(),
      location: z.string().optional(),
      year: z.union([z.number(), z.string()]).optional(),
      category: z.string().optional(),
      services: z.array(z.string()).optional(),
      cover: z
        .object({
          url: image(),
          alt: z.string(),
        })
        .optional(),
      gallery: z
        .array(
          z.object({
            url: image(),
            alt: z.string(),
          })
        )
        .optional(),
      metrics: z
        .array(
          z.object({
            label: z.string(),
            value: z.string(),
          })
        )
        .optional(),
      featured: z.boolean().optional(),
    }),
});

const careers = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/careers",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string(),
      location: z.string().optional(),
      type: z.string().optional(),
      department: z.string().optional(),
      experience: z.string().optional(),
      salary: z.string().optional(),
      applyUrl: z.string().optional(),
      email: z.email().optional(),
      responsibilities: z.array(z.string()).optional(),
      requirements: z.array(z.string()).optional(),
      benefits: z.array(z.string()).optional(),
      active: z.boolean().optional(),
    }),
});

export const collections = {
  team,
  legal,
  news,
  services,
  projects,
  careers,
};
