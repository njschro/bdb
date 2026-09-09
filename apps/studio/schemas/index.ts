import { news } from "./news";
import { teamMember } from "./teamMember";
import { legalPage } from "./legalPage";
import { service } from "./service";
import { project } from "./project";
import { career } from "./career";
import { siteSettings } from "./siteSettings";
import { testimonial } from "./testimonials";

export const schemaTypes = [
  // Documents
  news,
  teamMember,
  legalPage,
  service,
  project,
  career,
  testimonial,
  // Singletons
  siteSettings,
];
