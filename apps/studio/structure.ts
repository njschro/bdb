import type { StructureBuilder } from "sanity/structure";
import {
  DocumentIcon,
  UsersIcon,
  DocumentTextIcon,
  CogIcon,
} from "@sanity/icons";

// Singleton document IDs
const SITE_SETTINGS_ID = "siteSettings";

export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      // Posts
      S.listItem()
        .title("Blog Posts")
        .icon(DocumentIcon)
        .schemaType("post")
        .child(S.documentTypeList("post").title("Blog Posts")),

      // Team Members
      S.listItem()
        .title("Team")
        .icon(UsersIcon)
        .schemaType("teamMember")
        .child(S.documentTypeList("teamMember").title("Team Members")),

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
