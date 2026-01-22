import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

// =============================================================================
// IMAGE TYPES
// =============================================================================

export interface SanityImage {
  asset: SanityImageSource;
  alt?: string;
}

// =============================================================================
// POST TYPES
// =============================================================================

/**
 * Post data as returned from Sanity queries
 */
export interface SanityPost {
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
 * Post shape expected by UI components (mirrors original Astro content collection shape)
 */
export interface Post {
  slug: string;
  data: {
    title: string;
    description: string;
    pubDate: Date;
    tags: string[];
    image: {
      url: string;
      alt: string;
    };
  };
  body: string; // Plain text for reading time calculation
}

// =============================================================================
// TEAM MEMBER TYPES
// =============================================================================

export interface SanityTeamMember {
  _id: string;
  name: string;
  slug: string;
  role?: string;
  bio?: string;
  image: SanityImage;
  socials?: Array<{
    label: string;
    href: string;
  }>;
  body?: PortableTextBlock[];
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
      url: string;
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
      url: string;
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
    client?: string;
    location?: string;
    year?: string | number;
    category?: string;
    services?: string[];
    cover?: {
      url: string;
      alt: string;
    };
    gallery?: Array<{
      url: string;
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
