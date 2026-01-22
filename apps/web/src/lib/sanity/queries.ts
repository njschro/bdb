import groq from "groq";

// =============================================================================
// POSTS
// =============================================================================

// Shared post fields projection
const postFields = groq`
  _id,
  title,
  "slug": slug.current,
  description,
  pubDate,
  tags,
  image {
    asset->,
    alt
  }
`;

// All posts (for listing)
export const allPostsQuery = groq`
  *[_type == "post"] | order(pubDate desc) {
    ${postFields},
    "body": pt::text(body)
  }
`;

// Single post by slug
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    ${postFields},
    body
  }
`;

// Posts by tag
export const postsByTagQuery = groq`
  *[_type == "post" && $tag in tags] | order(pubDate desc) {
    ${postFields},
    "body": pt::text(body)
  }
`;

// All unique tags
export const allTagsQuery = groq`
  array::unique(*[_type == "post" && defined(tags)].tags[])
`;

// Related posts (by tags, excluding current)
export const relatedPostsQuery = groq`
  *[_type == "post" && slug.current != $slug && count((tags)[@ in $tags]) > 0] | order(pubDate desc) [0...3] {
    ${postFields},
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
  image {
    asset->,
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
    asset->,
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
  client,
  location,
  year,
  category,
  services,
  cover {
    asset->,
    alt
  },
  gallery[] {
    asset->,
    alt
  },
  metrics[] {
    label,
    value
  },
  featured
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
      asset->,
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
