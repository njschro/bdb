import type { StructureBuilder } from "sanity/structure";
import {
  DocumentIcon,
  UsersIcon,
  DocumentTextIcon,
  CogIcon,
  WrenchIcon,
  ProjectsIcon,
  CaseIcon,
  BlockquoteIcon
} from "@sanity/icons";

// Singleton document IDs
const SITE_SETTINGS_ID = "siteSettings";

export const structure = (S: StructureBuilder) =>
S.list()
    .title("Content")
    .items([
      // News (Formerly Posts)
      S.listItem()
        .title("News")
        .icon(DocumentIcon)
        .schemaType("news")
        .child(S.documentTypeList("news").title("News Articles")),

      // Team Members
      S.listItem()
        .title("Team")
        .icon(UsersIcon)
        .schemaType("teamMember")
        .child(S.documentTypeList("teamMember").title("Team Members")),

      // Services
      S.listItem()
        .title("Services")
        .icon(WrenchIcon)
        .schemaType("service")
        .child(S.documentTypeList("service").title("Services")),

      // Projects
      S.listItem()
        .title("Projects")
        .icon(ProjectsIcon)
        .schemaType("project")
        .child(S.documentTypeList("project").title("Projects")),

      // Testimonials
      S.listItem()
        .title("Testimonials")
        .icon(BlockquoteIcon)
        .schemaType("testimonial")
        .child(S.documentTypeList("testimonial").title("Testimonials")),

      // Careers
      S.listItem()
        .title("Careers")
        .icon(CaseIcon)
        .schemaType("career")
        .child(S.documentTypeList("career").title("Career Listings")),

      // Legal Pages
      S.listItem()
        .title("Legal Pages")
        .icon(DocumentTextIcon)
        .schemaType("legalPage")
        .child(S.documentTypeList("legalPage").title("Legal Pages")),

      S.divider(),

      // Site Settings (singleton)
      S.listItem()
        .title("Site Settings")
        .icon(CogIcon)
        .id("siteSettings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId(SITE_SETTINGS_ID)
            .title("Site Settings")
        ),
    ]);
