import groq from "groq";

// =============================================================================
// POSTS
// =============================================================================

// Shared news fields projection
const newsFields = groq`
  _id,
  title,
  "slug": slug.current,
  description,
  pubDate,
  tags,
  image {
    "url": asset->url,
    alt
  }
`;

// All news (for listing)
export const allNewsQuery = groq`
  *[_type == "news"] | order(pubDate desc) {
    ${newsFields},
    "body": pt::text(body)
  }
`;

// Single news by slug
export const newsBySlugQuery = groq`
  *[_type == "news" && slug.current == $slug][0] {
    ${newsFields},
    body
  }
`;

// Posts by tag
export const newsByTagQuery = groq`
  *[_type == "news" && $tag in tags] | order(pubDate desc) {
    ${newsFields},
    "body": pt::text(body)
  }
`;

// All unique tags
export const allTagsQuery = groq`
  array::unique(*[_type == "news" && defined(tags)].tags[])
`;

// Related news (by tags, excluding current)
export const relatedNewsQuery = groq`
  *[_type == "news" && slug.current != $slug && count((tags)[@ in $tags]) > 0] | order(pubDate desc) [0...3] {
    ${newsFields},
    "body": pt::text(body)
  }
`;

// =============================================================================
// TEAM MEMBERS
// =============================================================================

const teamMemberFields = groq`
  _id,
  name,
  "slug": slug.current,
  role,
  bio,
  body,
  image {
    "url": asset->url,
    alt
  },
  socials[] {
    label,
    href
  }
`;

// All team members
export const allTeamMembersQuery = groq`
  *[_type == "teamMember"] | order(name asc) {
    ${teamMemberFields}
  }
`;

// Single team member by slug
export const teamMemberBySlugQuery = groq`
  *[_type == "teamMember" && slug.current == $slug][0] {
    ${teamMemberFields},
    body
  }
`;

// =============================================================================
// LEGAL PAGES
// =============================================================================

const legalPageFields = groq`
  _id,
  page,
  "slug": slug.current,
  pubDate
`;

// All legal pages
export const allLegalPagesQuery = groq`
  *[_type == "legalPage"] {
    ${legalPageFields}
  }
`;

// Single legal page by slug
export const legalPageBySlugQuery = groq`
  *[_type == "legalPage" && slug.current == $slug][0] {
    ${legalPageFields},
    body
  }
`;

// =============================================================================
// SERVICES
// =============================================================================

const serviceFields = groq`
  _id,
  title,
  "slug": slug.current,
  description,
  excerpt,
  image {
    "url": asset->url,
    alt
  },
  highlights,
  featured
`;

// All services
export const allServicesQuery = groq`
  *[_type == "service"] | order(featured desc, title asc) {
    ${serviceFields},
    "body": pt::text(body)
  }
`;

// Single service by slug
export const serviceBySlugQuery = groq`
  *[_type == "service" && slug.current == $slug][0] {
    ${serviceFields},
    body
  }
`;

// =============================================================================
// PROJECTS
// =============================================================================

const projectFields = groq`
  _id,
  title,
  "slug": slug.current,
  description,
  location,
  year,
  status,
  category,
  services,
  service,
  duration,
  summary,
  cover {
    "url": asset->url,
    alt
  },
  gallery[] {
    "url": asset->url,
    alt
  },
  metrics[] {
    label,
    value
  },
  featured,
  "testimonial": testimonialRef->{
    clientName,
    role,
    quote,
    rating,
    clientImage {
      "url": asset->url,
      alt
    }
  }
`;

// All projects
export const allProjectsQuery = groq`
  *[_type == "project"] | order(featured desc, year desc, title asc) {
    ${projectFields},
    "body": pt::text(body)
  }
`;

// Single project by slug
export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    ${projectFields},
    body
  }
`;
// =============================================================================
// TESTIMONIALS
// =============================================================================

// All testimonials
export const allTestimonialsQuery = groq`
  *[_type == "testimonial"] {
    _id,
    clientName,
    role,
    quote,
    rating,
    metric,
    metricLabel,
    clientImage {
      "url": asset->url,
      alt
    }
  }
`;

// =============================================================================
// CAREERS
// =============================================================================

const careerFields = groq`
  _id,
  title,
  "slug": slug.current,
  description,
  location,
  type,
  department,
  experience,
  salary,
  applyUrl,
  email,
  responsibilities,
  requirements,
  benefits,
  active
`;

// All careers (active only by default)
export const allCareersQuery = groq`
  *[_type == "career" && active == true] | order(title asc) {
    ${careerFields},
    "body": pt::text(body)
  }
`;

// All careers including inactive
export const allCareersIncludingInactiveQuery = groq`
  *[_type == "career"] | order(active desc, title asc) {
    ${careerFields},
    "body": pt::text(body)
  }
`;

// Single career by slug
export const careerBySlugQuery = groq`
  *[_type == "career" && slug.current == $slug][0] {
    ${careerFields},
    body
  }
`;

// =============================================================================
// SITE SETTINGS
// =============================================================================

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    title,
    description,
    siteUrl,
    ogImage {
      "url": asset->url,
      alt
    },
    twitterHandle,
    navigation[] {
      label,
      href
    },
    footer {
      text,
      links[] {
        label,
        href
      }
    },
    socials[] {
      platform,
      url
    }
  }
`;