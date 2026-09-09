import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "clientName",
      title: "Client Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Client Role / Title",
      type: "string",
      description: "e.g., Homeowner, CEO, etc.",
    }),
    defineField({
      name: "quote",
      title: "Testimonial Text",
      type: "text",
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      description: "Star rating from 0 to 5",
      initialValue: 5,
      validation: (Rule) => Rule.required().min(0).max(5).integer(),
    }),
    defineField({
      name: "clientImage",
      title: "Client Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "metric",
      title: "Metric (Optional)",
      type: "string",
      description: "e.g., 100%, 250%",
    }),
    defineField({
      name: "metricLabel",
      title: "Metric Label (Optional)",
      type: "string",
      description: "e.g., Match rate, Revenue growth",
    }),
  ],
  preview: {
    select: {
      title: "clientName",
      subtitle: "quote",
      media: "clientImage",
    },
  },
});