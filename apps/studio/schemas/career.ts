import { defineField, defineType } from "sanity";

export const career = defineType({
  name: "career",
  title: "Career",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Job Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "e.g., London, UK (Hybrid)",
    }),
    defineField({
      name: "type",
      title: "Employment Type",
      type: "string",
      description: "e.g., Full-time, Part-time, Contract",
    }),
    defineField({
      name: "department",
      title: "Department",
      type: "string",
    }),
    defineField({
      name: "experience",
      title: "Experience Level",
      type: "string",
      description: "e.g., Junior, Mid-level, Senior, Director",
    }),
    defineField({
      name: "salary",
      title: "Salary Range",
      type: "string",
      description: "e.g., $120,000 – $155,000",
    }),
    defineField({
      name: "applyUrl",
      title: "Apply URL",
      type: "url",
      description: "External application link",
      validation: (Rule) =>
        Rule.uri({
          scheme: ["http", "https"],
          allowRelative: true,
        }),
    }),
    defineField({
      name: "email",
      title: "Contact Email",
      type: "string",
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: "responsibilities",
      title: "Responsibilities",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "requirements",
      title: "Requirements",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "benefits",
      title: "Benefits",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      description: "Is this position currently open?",
      initialValue: true,
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      description: "Extended job description content",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (Rule) =>
                      Rule.uri({
                        scheme: ["http", "https", "mailto", "tel"],
                      }),
                  },
                ],
              },
            ],
          },
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      location: "location",
      type: "type",
      active: "active",
    },
    prepare({ title, location, type, active }) {
      const parts = [type, location].filter(Boolean).join(" • ");
      return {
        title: active ? title : `🚫 ${title}`,
        subtitle: parts || undefined,
      };
    },
  },
});
