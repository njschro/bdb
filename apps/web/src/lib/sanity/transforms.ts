import { getImageUrl } from "./image";
import type {
  SanityLegalPage,
  SanityCareer,
  News, // <-- Changed from Post
  TeamMember,
  LegalPage,
  Service,
  Project,
  Career,
} from "./types";

/**
 * Transform Sanity news article to UI-friendly shape
 * Matches the original Astro content collection structure
 */
export function transformNews(article: any): News { // <-- Changed name and type
  return {
    slug: article.slug,
    data: {
      title: article.title,
      description: article.description,
      pubDate: new Date(article.pubDate),
      tags: article.tags || [],
      image: {
        url: article.image?.url || "",
        alt: article.image?.alt || article.title || "",
      },
    },
    // Body is plain text (from pt::text) for reading time calculation
    body: typeof article.body === "string" ? article.body : "",
  };
}

/**
 * Transform Sanity team member to UI-friendly shape
 */
export function transformTeamMember(member: any): TeamMember {
  return {
    slug: member.slug,
    data: {
      name: member.name,
      role: member.role,
      bio: member.bio || "",
      image: {
        // Using your built-in function to handle the sizing safely
        url: member.image?.asset ? getImageUrl(member.image, { width: 800, height: 700 }) : (member.image?.url || ""),
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
export function transformService(service: any): Service {
  return {
    slug: service.slug,
    data: {
      title: service.title,
      description: service.description,
      excerpt: service.excerpt,
      image: {
        url: service.image?.url || "",
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
export function transformProject(project: any): Project {
  return {
    slug: project.slug,
    data: {
      title: project.title,
      description: project.description,
      location: project.location,
      year: project.year,
      status: project.status,
      category: project.category,
      services: project.services,
      service: project.service || "",
      duration: project.duration || "",
      summary: project.summary,
      clientName: project.testimonial?.clientName || project.clientName,
      clientQuote: project.testimonial?.quote || project.clientQuote,
      clientRating: project.testimonial?.rating || project.clientRating,
      clientImage: project.testimonial?.clientImage?.url || project.clientImage?.url || undefined,
      
      cover: project.cover
        ? {
            url: project.cover.url || "",
            alt: project.cover.alt || project.title || "",
          }
        : undefined,
      gallery: project.gallery?.map((img: any) => ({
        url: img.url || "",
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