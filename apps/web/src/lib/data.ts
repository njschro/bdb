/**
 * Central Data Utility
 *
 * This module provides a unified interface for fetching content from either:
 * - Astro Content Collections (default, works out of the box)
 * - Sanity CMS (optional, requires configuration)
 *
 * Toggle `USE_SANITY` to switch between data sources.
 * Components and pages use this module exclusively — they never import
 * from Sanity or Content Collections directly.
 */

import { getCollection, getEntry } from "astro:content";

// Static type imports (always available, zero runtime cost when USE_SANITY = false)
import type {
  Post,
  TeamMember,
  LegalPage,
  Service,
  Project,
  Career,
} from "./sanity/types";

// Re-export types for consumers
export type { Post, TeamMember, LegalPage, Service, Project, Career };

/**
 * Toggle this to switch between Sanity CMS and Astro Content Collections
 * - true: Use Sanity CMS as the data source
 * - false: Use Astro Content Collections (markdown files)
 */
export const USE_SANITY = false;

// =============================================================================
// POSTS
// =============================================================================

/**
 * Get all blog posts, sorted by date (newest first)
 */
export async function getAllPosts(): Promise<Post[]> {
  if (USE_SANITY) {
    const { sanityFetch, allPostsQuery, transformPost } =
      await import("./sanity");
    const posts = await sanityFetch<any[]>(allPostsQuery);
    return posts.map(transformPost);
  }

  const posts = await getCollection("posts");
  posts.sort(
    (a, b) =>
      new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime()
  );

  return posts.map((post) => ({
    slug: post.id,
    data: {
      title: post.data.title,
      description: post.data.description,
      pubDate: new Date(post.data.pubDate),
      tags: post.data.tags || [],
      image: {
        url: post.data.image.url,
        alt: post.data.image.alt || "",
      },
    },
    body: post.body || "",
  }));
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<{
  post: Post;
  htmlContent: string;
  rawBody?: any;
} | null> {
  if (USE_SANITY) {
    const { sanityFetch, postBySlugQuery, transformPost, portableTextToHtml } =
      await import("./sanity");
    const post = await sanityFetch<any>(postBySlugQuery, { slug });
    if (!post) return null;

    const transformed = transformPost(post);
    const html = post.body ? portableTextToHtml(post.body) : "";

    return {
      post: transformed,
      htmlContent: html,
      rawBody: post.body,
    };
  }

  const entry = await getEntry("posts", slug);
  if (!entry) return null;

  // For Content Collections, we need to render the markdown to HTML
  // The Content component can't cross module boundaries, so we'll return
  // the entry itself and let the page handle rendering
  return {
    post: {
      slug: entry.id,
      data: {
        title: entry.data.title,
        description: entry.data.description,
        pubDate: new Date(entry.data.pubDate),
        tags: entry.data.tags || [],
        image: {
          url: entry.data.image.url,
          alt: entry.data.image.alt || "",
        },
      },
      body: entry.body || "",
    },
    // @ts-ignore - Content is a component that we'll pass through
    _entry: entry,
    htmlContent: "", // Not used for Content Collections
  } as any;
}

/**
 * Get posts filtered by tag
 */
export async function getPostsByTag(tag: string): Promise<Post[]> {
  if (USE_SANITY) {
    const { sanityFetch, postsByTagQuery, transformPost } =
      await import("./sanity");
    const posts = await sanityFetch<any[]>(postsByTagQuery, { tag });
    return posts.map(transformPost);
  }

  const allPosts = await getCollection("posts");
  const filtered = allPosts.filter((post) => post.data.tags?.includes(tag));
  filtered.sort(
    (a, b) =>
      new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime()
  );

  return filtered.map((post) => ({
    slug: post.id,
    data: {
      title: post.data.title,
      description: post.data.description,
      pubDate: new Date(post.data.pubDate),
      tags: post.data.tags || [],
      image: {
        url: post.data.image.url,
        alt: post.data.image.alt || "",
      },
    },
    body: post.body || "",
  }));
}

/**
 * Get all unique tags from posts
 */
export async function getAllTags(): Promise<string[]> {
  if (USE_SANITY) {
    const { sanityFetch, allTagsQuery } = await import("./sanity");
    return sanityFetch<string[]>(allTagsQuery);
  }

  const posts = await getCollection("posts");
  const tags = new Set<string>();
  posts.forEach((post) => {
    post.data.tags?.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags);
}

// =============================================================================
// TEAM MEMBERS
// =============================================================================

/**
 * Get all team members, sorted alphabetically by name
 */
export async function getAllTeamMembers(): Promise<TeamMember[]> {
  if (USE_SANITY) {
    const { sanityFetch, allTeamMembersQuery, transformTeamMember } =
      await import("./sanity");
    const members = await sanityFetch<any[]>(allTeamMembersQuery);
    return members.map(transformTeamMember);
  }

  const team = await getCollection("team");
  team.sort((a, b) => a.data.name.localeCompare(b.data.name));

  return team.map((member) => ({
    slug: member.id,
    data: {
      name: member.data.name,
      role: member.data.role,
      bio: member.data.bio,
      image: {
        url: member.data.image.url,
        alt: member.data.image.alt || "",
      },
      socials: member.data.socials,
    },
  }));
}

/**
 * Get a single team member by slug
 */
export async function getTeamMemberBySlug(slug: string): Promise<{
  member: TeamMember;
  htmlContent: string;
  rawBody?: any;
  _entry?: any;
} | null> {
  if (USE_SANITY) {
    const {
      sanityFetch,
      teamMemberBySlugQuery,
      transformTeamMember,
      portableTextToHtml,
    } = await import("./sanity");
    const member = await sanityFetch<any>(teamMemberBySlugQuery, { slug });
    if (!member) return null;

    const transformed = transformTeamMember(member);
    const html = member.body ? portableTextToHtml(member.body) : "";

    return {
      member: transformed,
      htmlContent: html,
      rawBody: member.body,
    };
  }

  const entry = await getEntry("team", slug);
  if (!entry) return null;

  return {
    member: {
      slug: entry.id,
      data: {
        name: entry.data.name,
        role: entry.data.role,
        bio: entry.data.bio,
        image: {
          url: entry.data.image.url,
          alt: entry.data.image.alt || "",
        },
        socials: entry.data.socials,
      },
    },
    htmlContent: "",
    _entry: entry,
  };
}

// =============================================================================
// LEGAL PAGES
// =============================================================================

/**
 * Get all legal pages
 */
export async function getAllLegalPages(): Promise<LegalPage[]> {
  if (USE_SANITY) {
    const { sanityFetch, allLegalPagesQuery, transformLegalPage } =
      await import("./sanity");
    const pages = await sanityFetch<any[]>(allLegalPagesQuery);
    return pages.map(transformLegalPage);
  }

  const legal = await getCollection("legal");

  return legal.map((page) => ({
    slug: page.id,
    data: {
      page: page.data.page,
      pubDate: new Date(page.data.pubDate),
    },
  }));
}

/**
 * Get a single legal page by slug
 */
export async function getLegalPageBySlug(slug: string): Promise<{
  page: LegalPage;
  htmlContent: string;
  rawBody?: any;
  _entry?: any;
} | null> {
  if (USE_SANITY) {
    const {
      sanityFetch,
      legalPageBySlugQuery,
      transformLegalPage,
      portableTextToHtml,
    } = await import("./sanity");
    const page = await sanityFetch<any>(legalPageBySlugQuery, { slug });
    if (!page) return null;

    const transformed = transformLegalPage(page);
    const html = page.body ? portableTextToHtml(page.body) : "";

    return {
      page: transformed,
      htmlContent: html,
      rawBody: page.body,
    };
  }

  const entry = await getEntry("legal", slug);
  if (!entry) return null;

  return {
    page: {
      slug: entry.id,
      data: {
        page: entry.data.page,
        pubDate: new Date(entry.data.pubDate),
      },
    },
    htmlContent: "",
    _entry: entry,
  };
}

// =============================================================================
// SERVICES
// =============================================================================

/**
 * Get all services, sorted by featured then title
 */
export async function getAllServices(): Promise<Service[]> {
  if (USE_SANITY) {
    const { sanityFetch, allServicesQuery, transformService } =
      await import("./sanity");
    const services = await sanityFetch<any[]>(allServicesQuery);
    return services.map(transformService);
  }

  const services = await getCollection("services");
  services.sort((a, b) => {
    const featuredDiff = (b.data.featured ? 1 : 0) - (a.data.featured ? 1 : 0);
    if (featuredDiff !== 0) return featuredDiff;
    return a.data.title.localeCompare(b.data.title);
  });

  return services.map((service) => ({
    slug: service.id,
    data: {
      title: service.data.title,
      description: service.data.description,
      excerpt: service.data.excerpt,
      image: {
        url: service.data.image.url,
        alt: service.data.image.alt || "",
      },
      highlights: service.data.highlights,
      featured: service.data.featured,
    },
    body: service.body || "",
  }));
}

/**
 * Get a single service by slug
 */
export async function getServiceBySlug(slug: string): Promise<{
  service: Service;
  htmlContent: string;
  rawBody?: any;
  _entry?: any;
} | null> {
  if (USE_SANITY) {
    const {
      sanityFetch,
      serviceBySlugQuery,
      transformService,
      portableTextToHtml,
    } = await import("./sanity");
    const service = await sanityFetch<any>(serviceBySlugQuery, { slug });
    if (!service) return null;

    const transformed = transformService(service);
    const html = service.body ? portableTextToHtml(service.body) : "";

    return {
      service: transformed,
      htmlContent: html,
      rawBody: service.body,
    };
  }

  const entry = await getEntry("services", slug);
  if (!entry) return null;

  return {
    service: {
      slug: entry.id,
      data: {
        title: entry.data.title,
        description: entry.data.description,
        excerpt: entry.data.excerpt,
        image: {
          url: entry.data.image.url,
          alt: entry.data.image.alt || "",
        },
        highlights: entry.data.highlights,
        featured: entry.data.featured,
      },
      body: entry.body || "",
    },
    htmlContent: "",
    _entry: entry,
  };
}

// =============================================================================
// PROJECTS
// =============================================================================

/**
 * Get all projects, sorted by featured then year (newest first)
 */
export async function getAllProjects(): Promise<Project[]> {
  if (USE_SANITY) {
    const { sanityFetch, allProjectsQuery, transformProject } =
      await import("./sanity");
    const projects = await sanityFetch<any[]>(allProjectsQuery);
    return projects.map(transformProject);
  }

  const projects = await getCollection("projects");
  projects.sort((a, b) => {
    const featuredDiff = (b.data.featured ? 1 : 0) - (a.data.featured ? 1 : 0);
    if (featuredDiff !== 0) return featuredDiff;
    const yearA = Number(a.data.year) || 0;
    const yearB = Number(b.data.year) || 0;
    return yearB - yearA;
  });

  return projects.map((project) => ({
    slug: project.id,
    data: {
      title: project.data.title,
      description: project.data.description,
      client: project.data.client,
      location: project.data.location,
      year: project.data.year,
      category: project.data.category,
      services: project.data.services,
      cover: project.data.cover
        ? {
            url: project.data.cover.url,
            alt: project.data.cover.alt || "",
          }
        : undefined,
      gallery: project.data.gallery?.map((img) => ({
        url: img.url,
        alt: img.alt || "",
      })),
      metrics: project.data.metrics,
      featured: project.data.featured,
    },
    body: project.body || "",
  }));
}

/**
 * Get a single project by slug
 */
export async function getProjectBySlug(slug: string): Promise<{
  project: Project;
  htmlContent: string;
  rawBody?: any;
  _entry?: any;
} | null> {
  if (USE_SANITY) {
    const {
      sanityFetch,
      projectBySlugQuery,
      transformProject,
      portableTextToHtml,
    } = await import("./sanity");
    const project = await sanityFetch<any>(projectBySlugQuery, { slug });
    if (!project) return null;

    const transformed = transformProject(project);
    const html = project.body ? portableTextToHtml(project.body) : "";

    return {
      project: transformed,
      htmlContent: html,
      rawBody: project.body,
    };
  }

  const entry = await getEntry("projects", slug);
  if (!entry) return null;

  return {
    project: {
      slug: entry.id,
      data: {
        title: entry.data.title,
        description: entry.data.description,
        client: entry.data.client,
        location: entry.data.location,
        year: entry.data.year,
        category: entry.data.category,
        services: entry.data.services,
        cover: entry.data.cover
          ? {
              url: entry.data.cover.url,
              alt: entry.data.cover.alt || "",
            }
          : undefined,
        gallery: entry.data.gallery?.map((img) => ({
          url: img.url,
          alt: img.alt || "",
        })),
        metrics: entry.data.metrics,
        featured: entry.data.featured,
      },
      body: entry.body || "",
    },
    htmlContent: "",
    _entry: entry,
  };
}

// =============================================================================
// CAREERS
// =============================================================================

/**
 * Get all active careers
 */
export async function getAllCareers(): Promise<Career[]> {
  if (USE_SANITY) {
    const { sanityFetch, allCareersQuery, transformCareer } =
      await import("./sanity");
    const careers = await sanityFetch<any[]>(allCareersQuery);
    return careers.map(transformCareer);
  }

  const careers = await getCollection("careers");
  // Filter active only (matching Sanity behavior)
  const activeCareers = careers.filter((c) => c.data.active !== false);
  activeCareers.sort((a, b) => a.data.title.localeCompare(b.data.title));

  return activeCareers.map((career) => ({
    slug: career.id,
    data: {
      title: career.data.title,
      description: career.data.description,
      location: career.data.location,
      type: career.data.type,
      department: career.data.department,
      experience: career.data.experience,
      salary: career.data.salary,
      applyUrl: career.data.applyUrl,
      email: career.data.email,
      responsibilities: career.data.responsibilities,
      requirements: career.data.requirements,
      benefits: career.data.benefits,
      active: career.data.active,
    },
    body: career.body || "",
  }));
}

/**
 * Get a single career by slug
 */
export async function getCareerBySlug(slug: string): Promise<{
  career: Career;
  htmlContent: string;
  rawBody?: any;
  _entry?: any;
} | null> {
  if (USE_SANITY) {
    const {
      sanityFetch,
      careerBySlugQuery,
      transformCareer,
      portableTextToHtml,
    } = await import("./sanity");
    const career = await sanityFetch<any>(careerBySlugQuery, { slug });
    if (!career) return null;

    const transformed = transformCareer(career);
    const html = career.body ? portableTextToHtml(career.body) : "";

    return {
      career: transformed,
      htmlContent: html,
      rawBody: career.body,
    };
  }

  const entry = await getEntry("careers", slug);
  if (!entry) return null;

  return {
    career: {
      slug: entry.id,
      data: {
        title: entry.data.title,
        description: entry.data.description,
        location: entry.data.location,
        type: entry.data.type,
        department: entry.data.department,
        experience: entry.data.experience,
        salary: entry.data.salary,
        applyUrl: entry.data.applyUrl,
        email: entry.data.email,
        responsibilities: entry.data.responsibilities,
        requirements: entry.data.requirements,
        benefits: entry.data.benefits,
        active: entry.data.active,
      },
      body: entry.body || "",
    },
    htmlContent: "",
    _entry: entry,
  };
}

// =============================================================================
// STATIC PATHS HELPERS
// =============================================================================

/**
 * Generate static paths for posts
 */
export async function getPostStaticPaths() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

/**
 * Generate static paths for team members
 */
export async function getTeamStaticPaths() {
  const members = await getAllTeamMembers();
  return members.map((member) => ({
    params: { slug: member.slug },
    props: { member },
  }));
}

/**
 * Generate static paths for legal pages
 */
export async function getLegalStaticPaths() {
  const pages = await getAllLegalPages();
  return pages.map((page) => ({
    params: { slug: page.slug },
    props: { page },
  }));
}

/**
 * Generate static paths for services
 */
export async function getServiceStaticPaths() {
  const services = await getAllServices();
  return services.map((service) => ({
    params: { slug: service.slug },
    props: { service },
  }));
}

/**
 * Generate static paths for projects
 */
export async function getProjectStaticPaths() {
  const projects = await getAllProjects();
  return projects.map((project) => ({
    params: { slug: project.slug },
    props: { project },
  }));
}

/**
 * Generate static paths for careers
 */
export async function getCareerStaticPaths() {
  const careers = await getAllCareers();
  return careers.map((career) => ({
    params: { slug: career.slug },
    props: { career },
  }));
}

/**
 * Generate static paths for tags
 */
export async function getTagStaticPaths() {
  const tags = await getAllTags();
  const allPosts = await getAllPosts();

  return tags.map((tag) => ({
    params: { tag },
    props: {
      posts: allPosts.filter((post) => post.data.tags?.includes(tag)),
    },
  }));
}
