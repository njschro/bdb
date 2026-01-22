import { getImageUrl } from "./image";
import type {
  SanityPost,
  SanityTeamMember,
  SanityLegalPage,
  SanityService,
  SanityProject,
  SanityCareer,
  Post,
  TeamMember,
  LegalPage,
  Service,
  Project,
  Career,
} from "./types";

/**
 * Transform Sanity post to UI-friendly shape
 * Matches the original Astro content collection structure
 */
export function transformPost(post: SanityPost): Post {
  return {
    slug: post.slug,
    data: {
      title: post.title,
      description: post.description,
      pubDate: new Date(post.pubDate),
      tags: post.tags || [],
      image: {
        url: getImageUrl(post.image?.asset),
        alt: post.image?.alt || post.title || "",
      },
    },
    // Body is plain text (from pt::text) for reading time calculation
    body: typeof post.body === "string" ? post.body : "",
  };
}

/**
 * Transform Sanity team member to UI-friendly shape
 */
export function transformTeamMember(member: SanityTeamMember): TeamMember {
  return {
    slug: member.slug,
    data: {
      name: member.name,
      role: member.role,
      bio: member.bio || "",
      image: {
        url: getImageUrl(member.image?.asset),
        alt: member.image?.alt || member.name || "",
      },
      socials: member.socials,
    },
    body: member.body,
  };
}

/**
 * Transform Sanity legal page to UI-friendly shape
 */
export function transformLegalPage(page: SanityLegalPage): LegalPage {
  return {
    slug: page.slug,
    data: {
      page: page.page,
      pubDate: new Date(page.pubDate),
    },
    body: page.body,
  };
}

/**
 * Transform Sanity service to UI-friendly shape
 */
export function transformService(service: SanityService): Service {
  return {
    slug: service.slug,
    data: {
      title: service.title,
      description: service.description,
      excerpt: service.excerpt,
      image: {
        url: getImageUrl(service.image?.asset),
        alt: service.image?.alt || service.title || "",
      },
      highlights: service.highlights,
      featured: service.featured,
    },
    body: typeof service.body === "string" ? service.body : "",
  };
}

/**
 * Transform Sanity project to UI-friendly shape
 */
export function transformProject(project: SanityProject): Project {
  return {
    slug: project.slug,
    data: {
      title: project.title,
      description: project.description,
      client: project.client,
      location: project.location,
      year: project.year,
      category: project.category,
      services: project.services,
      cover: project.cover
        ? {
            url: getImageUrl(project.cover.asset),
            alt: project.cover.alt || project.title || "",
          }
        : undefined,
      gallery: project.gallery?.map((img) => ({
        url: getImageUrl(img.asset),
        alt: img.alt || "",
      })),
      metrics: project.metrics,
      featured: project.featured,
    },
    body: typeof project.body === "string" ? project.body : "",
  };
}

/**
 * Transform Sanity career to UI-friendly shape
 */
export function transformCareer(career: SanityCareer): Career {
  return {
    slug: career.slug,
    data: {
      title: career.title,
      description: career.description,
      location: career.location,
      type: career.type,
      department: career.department,
      experience: career.experience,
      salary: career.salary,
      applyUrl: career.applyUrl,
      email: career.email,
      responsibilities: career.responsibilities,
      requirements: career.requirements,
      benefits: career.benefits,
      active: career.active,
    },
    body: typeof career.body === "string" ? career.body : "",
  };
}
