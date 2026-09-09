import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import type { ImageMetadata } from "astro";

// =============================================================================
// IMAGE TYPES
// =============================================================================

export interface SanityImage {
  asset: SanityImageSource;
  alt?: string;
}

/**
 * Image URL can be:
 * - A string URL (for Sanity CDN URLs)
 * - An ImageMetadata object (for Astro's local images from Content Collections)
 */
export type ImageUrl = string | ImageMetadata;

// =============================================================================
// NEWS TYPES
// =============================================================================

/**
 * News data as returned from Sanity queries
 */
export interface SanityNews {
  _id: string;
  title: string;
  slug: string;
  description: string;
  pubDate: string;
  tags: string[];
  image: SanityImage;
  body: PortableTextBlock[] | string; // string when using pt::text() for plain text
}

/**
 * News shape expected by UI components (mirrors original Astro content collection shape)
 */
export interface News {
  slug: string;
  data: {
    title: string;
    description: string;
    pubDate: Date;
    tags: string[];
    image: {
      url: ImageUrl;
      alt: string;
    };
  };
  body: string; // Plain text for reading time calculation
}

// =============================================================================
// TEAM MEMBER TYPES
// =============================================================================

export interface TeamMember {
  slug: string;
  data: {
    name: string;
    role?: string;
    bio?: string;
    image: {
      url: string;
      alt: string;
    };
    socials?: Array<{
      label: string;
      href: string;
    }>;
  };
  body?: string;
}

/**
 * Team member shape expected by UI components
 */
export interface TeamMember {
  slug: string;
  data: {
    name: string;
    role?: string;
    bio?: string;
    image: {
      url: ImageUrl;
      alt: string;
    };
    socials?: Array<{
      label: string;
      href: string;
    }>;
  };
  body?: PortableTextBlock[];
}

// =============================================================================
// LEGAL PAGE TYPES
// =============================================================================

export interface SanityLegalPage {
  _id: string;
  page: string;
  slug: string;
  pubDate: string;
  body?: PortableTextBlock[];
}

/**
 * Legal page shape expected by UI components
 */
export interface LegalPage {
  slug: string;
  data: {
    page: string;
    pubDate: Date;
  };
  body?: PortableTextBlock[];
}

// =============================================================================
// TESTIMONIAL TYPES
// =============================================================================

export interface Testimonial {
  _id: string;
  clientName: string;
  role?: string;
  quote: string;
  rating?: number;
  metric?: string;
  metricLabel?: string;
  clientImage?: {
    url: string;
    alt?: string;
  };
}
// =============================================================================
// SERVICE TYPES
// =============================================================================

export interface SanityService {
  _id: string;
  title: string;
  slug: string;
  description: string;
  excerpt?: string;
  image: SanityImage;
  highlights?: string[];
  featured?: boolean;
  body?: PortableTextBlock[] | string;
}

/**
 * Service shape expected by UI components
 */
export interface Service {
  slug: string;
  data: {
    title: string;
    description: string;
    excerpt?: string;
    image: {
      url: ImageUrl;
      alt: string;
    };
    highlights?: string[];
    featured?: boolean;
  };
  body?: string;
}

// =============================================================================
// PROJECT TYPES
// =============================================================================

export interface SanityProject {
  _id: string;
  title: string;
  slug: string;
  description: string;
  client?: string;
  location?: string;
  year?: string | number;
  status?: string;
  category?: string;
  services?: string[];
  cover?: SanityImage;
  gallery?: SanityImage[];
  metrics?: Array<{
    label: string;
    value: string;
  }>;
  featured?: boolean;
  body?: PortableTextBlock[] | string;
}

/**
 * Project shape expected by UI components
 */
export interface Project {
  slug: string;
  data: {
    title: string;
    description: string;
    clientName?: string;
    clientQuote?: string;
    clientRating?: number; // <-- Added
    status?: string;
    location?: string;
    year?: string | number;
    category?: string;
    services?: string[];
    service?: string;
    summary: string;
    duration?: string;
    clientImage?: string;
    cover?: {
      url: ImageUrl;
      alt: string;
    };
    gallery?: Array<{
      url: ImageUrl;
      alt: string;
    }>;
    metrics?: Array<{
      label: string;
      value: string;
    }>;
    featured?: boolean;
  };
  body?: string;
}

// =============================================================================
// CAREER TYPES
// =============================================================================

export interface SanityCareer {
  _id: string;
  title: string;
  slug: string;
  description: string;
  location?: string;
  type?: string;
  department?: string;
  experience?: string;
  salary?: string;
  applyUrl?: string;
  email?: string;
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
  active?: boolean;
  body?: PortableTextBlock[] | string;
}

/**
 * Career shape expected by UI components
 */
export interface Career {
  slug: string;
  data: {
    title: string;
    description: string;
    location?: string;
    type?: string;
    department?: string;
    experience?: string;
    salary?: string;
    applyUrl?: string;
    email?: string;
    responsibilities?: string[];
    requirements?: string[];
    benefits?: string[];
    active?: boolean;
  };
  body?: string;
}

// =============================================================================
// SITE SETTINGS TYPES
// =============================================================================

export interface SiteSettings {
  title?: string;
  description?: string;
  navigation?: Array<{
    label: string;
    href: string;
  }>;
  footer?: {
    text?: string;
    links?: Array<{
      label: string;
      href: string;
    }>;
  };
  socials?: Array<{
    platform: string;
    url: string;
  }>;
}