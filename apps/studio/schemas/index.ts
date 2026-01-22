import { post } from "./post";
import { teamMember } from "./teamMember";
import { legalPage } from "./legalPage";
import { service } from "./service";
import { project } from "./project";
import { career } from "./career";
import { siteSettings } from "./siteSettings";

export const schemaTypes = [
  // Documents
  post,
  teamMember,
  legalPage,
  service,
  project,
  career,
  // Singletons
  siteSettings,
];
