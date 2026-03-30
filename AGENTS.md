# AGENTS.md — Bastion (Lexington Themes + Astro + Sanity)

**Bastion** is a [Lexington Themes](https://lexingtonthemes.com/) starter themed around construction and professional services: the site markets capabilities through a homepage (hero, services preview, stats, testimonials, projects), dedicated **blog**, **team**, **services**, **projects**, and **careers** sections, plus **about**, **contact**, and **legal** pages. Primary use case: **marketing / lead-generation** for a building, engineering, or similar firm, with optional **Sanity Studio** for editors or **markdown content collections** for a git-only workflow.

---

## Tech stack (from manifests only)

| Layer | Source | What’s installed / configured |
| --- | --- | --- |
| **Monorepo** | Root `package.json`, `pnpm-workspace.yaml` | `pnpm` workspaces: `apps/*` (and `packages/*` in workspace file; no `packages/` tree in this checkout). Scripts: `dev`, `dev:web`, `dev:studio`, `build`, `build:web`, `build:studio`, `clean`, `migrate`, `seed:all`. Root devDeps: `@sanity/client`, `gray-matter`, `tsx`, `dotenv`. |
| **Web app** | `apps/web/package.json` | **Astro** `^6.0.4`. **Tailwind CSS** `^4.1.18` with **`@tailwindcss/vite`** (Vite plugin). **Integrations/deps:** `@astrojs/rss`, `@astrojs/sitemap`, `sharp`, `@sanity/client`, `@sanity/image-url`, `groq`, `@portabletext/to-html`, `@portabletext/types`, `@lexingtonthemes/seo`, `@tailwindcss/forms`, `@tailwindcss/typography`, `tailwind-scrollbar-hide`, `reading-time` (listed; not referenced elsewhere in `src` at time of writing). |
| **Astro config** | `apps/web/astro.config.mjs` | `site`: `https://yourwebsite.com` (placeholder). **Vite:** `@tailwindcss/vite`. **Integrations:** `@astrojs/sitemap` only. **Markdown:** drafts enabled; **Shiki** theme `css-variables`. Top-level **`shikiConfig`**: `wrap`, `skipInline`, `drafts`. **`experimental.svgo`:** `true`. **Not present:** `@astrojs/mdx` (no MDX integration in this repo). |
| **Studio** | `apps/studio/package.json` | **Sanity** `^5.15.0`, `sanity dev/build/deploy`, **React** 19, **`styled-components`**, **`@sanity/icons`**, **`@sanity/vision`**, TypeScript. |
| **Studio config** | `apps/studio/sanity.config.ts` | **`structureTool`** (custom `structure` from `./structure`) and **`visionTool`** from `@sanity/vision`. Schema: `schemaTypes` from `./schemas`. Project/dataset from `SANITY_STUDIO_PROJECT_ID` / `SANITY_STUDIO_DATASET`. |

---

## Monorepo / folder map (actual paths)

| Path | Role |
| --- | --- |
| `apps/web/src/pages/` | File-based routes (see [Routing](#routing)). |
| `apps/web/src/layouts/` | Layout wrappers (e.g. `BaseLayout.astro`). |
| `apps/web/src/components/` | UI including **`components/fundations/`** (head, elements, icons, slider/Fuse scripts — keep this folder name as-is). |
| `apps/web/src/content/` | Markdown for Astro Content Collections (`posts/`, `team/`, `services/`, `projects/`, `careers/`, `legal/`). |
| `apps/web/src/styles/` | Global CSS (e.g. `global.css`). |
| `apps/web/src/lib/sanity/` | Sanity client, fetch, GROQ `queries.ts`, `transforms.ts`, `types.ts`, `image.ts`, `portableText.ts`, barrel `index.ts`. |
| `apps/web/src/lib/data.ts` | **Unified API** — single entry for pages; toggles collections vs Sanity. |
| `apps/web/public/` | Static assets. |
| `apps/web/src/images/` | Local images referenced from content (e.g. `/src/images/...` in frontmatter). |
| `apps/studio/schemas/` | Sanity document/singleton types. |
| `scripts/migrate-to-sanity.ts` | Seed/migration from markdown → Sanity. |
| `scripts/clean.sh` | Cleanup helper (`pnpm clean`). |

---

## Dual content model

### A) Astro Content Collections — `apps/web/src/content.config.ts`

Uses **`defineCollection`** + **`glob` loaders** and **Zod** (`astro/zod`). Image fields use the schema callback’s **`image()`** helper (Astro image pipeline / local asset paths), typically `url` + `alt` objects — not remote URLs as plain strings.

| Collection | Folder | Required fields (Zod) | Optional / notes | Image handling |
| --- | --- | --- | --- | --- |
| **`posts`** | `apps/web/src/content/posts/` | `title`, `pubDate`, `description`, `image.{url,alt}`, `tags` | — | `image.url` via `image()` |
| **`team`** | `apps/web/src/content/team/` | `name`, `image.{url,alt}` | `role`, `bio`, `socials[]` | `image.url` via `image()` |
| **`legal`** | `apps/web/src/content/legal/` | `page`, `pubDate` | Body is markdown | No image field |
| **`services`** | `apps/web/src/content/services/` | `title`, `description`, `image.{url,alt}` | `excerpt`, `highlights[]`, `featured` | `image.url` via `image()` |
| **`projects`** | `apps/web/src/content/projects/` | `title`, `description` | `client`, `location`, `year` (number **or** string), `category`, `services[]`, `cover`, `gallery[]`, `metrics[]`, `featured` | `cover` / `gallery` use `image()` |
| **`careers`** | `apps/web/src/content/careers/` | `title`, `description` | `location`, `type`, `department`, `experience`, `salary`, `applyUrl`, `email`, list fields, `active` | No image field |

**Copy-this-entry anchors (real files):**

- `posts` → `apps/web/src/content/posts/1.md`
- `team` → `apps/web/src/content/team/alvaro-ruiz.md`
- `services` → `apps/web/src/content/services/construction-management.md`
- `projects` → `apps/web/src/content/projects/meridian-civic-center.md`
- `careers` → `apps/web/src/content/careers/director-client-partnerships.md`
- `legal` → `apps/web/src/content/legal/cookies.md`

### B) Sanity CMS — `apps/studio/schemas/`

| Sanity `_type` | File | Aligns with collection |
| --- | --- | --- |
| **`post`** | `post.ts` | `posts` |
| **`teamMember`** | `teamMember.ts` | `team` |
| **`legalPage`** | `legalPage.ts` | `legal` |
| **`service`** | `service.ts` | `services` |
| **`project`** | `project.ts` | `projects` |
| **`career`** | `career.ts` | `careers` |
| **`siteSettings`** | `siteSettings.ts` | Singleton (site title, URL, SEO, navigation, footer, socials) — **GROQ exists** in `queries.ts` (`siteSettingsQuery`); **not wired through `data.ts`** in the current web app. |

Documents use Sanity **`slug`** fields (where applicable), **Portable Text** `body` on content types, and **image assets** for covers/galleries. Shapes are normalized in **`apps/web/src/lib/sanity/transforms.ts`** to match what **`apps/web/src/lib/data.ts`** exposes.

### Unified API (web)

- **Toggle:** `export const USE_SANITY` in **`apps/web/src/lib/data.ts`** (`true` = Sanity, `false` = collections). This is **source code**, not an environment variable.
- **Sanity mode** uses the barrel **`apps/web/src/lib/sanity/index.ts`**: `client` / `previewClient` (`client.ts`), `sanityFetch` (`fetch.ts`), GROQ strings (`queries.ts`), `urlFor` / `getImageUrl` (`image.ts`), `portableTextToHtml` / `portableTextToPlainText` (`portableText.ts`), transforms (`transforms.ts`), types (`types.ts`).
- **Collections-only mode** needs **no** Sanity credentials. **Sanity mode** needs Studio configuration plus **`apps/web/.env`** (see below).

### Environment & tokens

**`apps/web/.env`** (copy from `apps/web/.env.example`):

- `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION`
- Optional: `SANITY_READ_TOKEN` (comment: draft/preview)
- `SANITY_WRITE_TOKEN` (or migration accepts `SANITY_TOKEN`) for **`pnpm migrate`** / **`pnpm seed:all`**

**`apps/studio/.env`:** `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET` (see `apps/studio/.env.example`).

### Seeding / migration

- **`pnpm migrate`** and **`pnpm seed:all`** both run `npx tsx scripts/migrate-to-sanity.ts` (per root `package.json`).
- Script loads **`apps/web/.env`**, requires **`SANITY_PROJECT_ID`** and a write token (**`SANITY_WRITE_TOKEN`** or **`SANITY_TOKEN`**), reads markdown under **`apps/web/src/content/`** and uploads images from **`apps/web/src/images`**.
- Per **README**: running **`seed:all`** deletes existing Sanity documents **per content type**, then creates **one document per collection type** from sample markdown (destructive reset of those types).

---

## Routing

Derived from **`apps/web/src/pages/`** (README table matches this tree).

| URL pattern | File(s) |
| --- | --- |
| `/` | `index.astro` |
| `/about` | `about.astro` |
| `/contact` | `contact.astro` |
| `/blog` | `blog/index.astro` |
| `/blog/posts/...` | `blog/posts/[...slug].astro` |
| `/blog/tags` | `blog/tags/index.astro` |
| `/blog/tags/:tag` | `blog/tags/[tag].astro` |
| `/team`, `/team/...` | `team/index.astro`, `team/[...slug].astro` |
| `/services`, `/services/...` | `services/index.astro`, `services/[...slug].astro` |
| `/projects`, `/projects/...` | `projects/index.astro`, `projects/[...slug].astro` |
| `/careers`, `/careers/...` | `careers/index.astro`, `careers/[...slug].astro` |
| `/legal/...` | `legal/[...slug].astro` (no `legal/index.astro`) |
| `/rss.xml` | `rss.xml.js` |
| `/system/*` | Internal design-system pages (`system/colors.astro`, `typography.astro`, etc.) |
| 404 | `404.astro` |

**Not present** in this repo’s `pages/`: dedicated changelog, customers listing, integrations, or help-center routes.

---

## Customization (real files)

| Concern | Where |
| --- | --- |
| Canonical site URL / sitemap base | `apps/web/astro.config.mjs` → `site` |
| SEO / head | `apps/web/src/components/fundations/head/BaseHead.astro` (composes `Seo.astro` using `@lexingtonthemes/seo`, `Meta`, `Fonts`, `Favicons`) |
| Global styling / tokens | `apps/web/src/styles/global.css` |
| Navigation / footer | `apps/web/src/components/global/navigation/Navigation.astro`, `MobileNavigation.astro`, `Footer.astro` |
| Layout shell | `apps/web/src/layouts/BaseLayout.astro` (import path used as `@/layouts/...` from `tsconfig` paths) |

---

## Commands

| Command | Use |
| --- | --- |
| `pnpm install` | Install all workspace packages |
| `pnpm dev:web` | Website only → `http://localhost:4321` |
| `pnpm dev:studio` | Studio only |
| `pnpm dev` | Parallel `dev` in packages (site + studio when both defined) |
| `pnpm build:web` / `pnpm build:studio` / `pnpm build` | Production builds |
| `pnpm migrate` / `pnpm seed:all` | Run `scripts/migrate-to-sanity.ts` |
| `pnpm clean` | `scripts/clean.sh` |

Day-to-day site work is usually from **`apps/web`** via root `pnpm dev:web`.

---

## Guardrails

- Do **not** rename **`fundations`** (intentional spelling in `components/fundations/`).
- Changing **Zod** collection schemas or **Sanity** schemas requires updating **consumers**: `data.ts`, **`transforms.ts`**, **`queries.ts`**, **`types.ts`**, and any pages/components that assume field shapes.
- Keep **markdown-normalized** and **Sanity-normalized** shapes in sync through the unified layer.
- Prefer **minimal diffs** and existing patterns (`@/` imports per `apps/web/tsconfig.json`).

---

## Support & docs (Lexington pattern)

Use the same links as **README.md**:

- **Documentation:** https://lexingtonthemes.com/documentation  
- **Support:** https://lexingtonthemes.com/legal/support/  
- **Theme specs (Bastion):** https://lexingtonthemes.com/templates/bastion  
- **Changelog (Bastion):** https://lexingtonthemes.com/changelog/bastion  

For Sanity hosting and tokens, README points to **https://sanity.io/manage** and **https://www.sanity.io/docs** under Resources.
