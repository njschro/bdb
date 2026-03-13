# Bastion 
![Theme preview](https://lexingtonthemes.com/OpenGraph/bastion/twitter.png)


## Links

- **Theme specs:** https://lexingtonthemes.com/templates/bastion
- **Documentation:** https://lexingtonthemes.com/documentation
- **Changelog:** https://lexingtonthemes.com/changelog/bastion
- **Support:** https://lexingtonthemes.com/legal/support/
- **Get the bundle:** https://lexingtonthemes.com

---

## Two Ways to Use This Theme

This theme supports **two data sources** — choose what works best for you:

### Option A: Content Collections (No CMS Required)

Use markdown files in `apps/web/src/content/`. Perfect for:

- Quick setup with no external services
- Git-based content workflow
- Developers comfortable editing markdown

### Option B: Sanity CMS (Recommended for Clients)

Use Sanity Studio for a visual editing experience. Perfect for:

- Non-technical content editors
- Teams collaborating on content
- Dynamic content updates without code changes

**By default, the theme uses Content Collections.** Follow the instructions below to switch to Sanity.

---

## Quick Start (Content Collections)

If you just want to get started without Sanity:

```bash
# Install dependencies
pnpm install

# Start the website
pnpm dev:web
```

Open http://localhost:4321 — your site is ready with sample content!

Edit content in `apps/web/src/content/`:

- `posts/` — Blog articles
- `team/` — Team member profiles
- `services/` — Service offerings
- `projects/` — Project case studies
- `careers/` — Job listings
- `legal/` — Legal pages (Privacy, Terms, Cookies)

---

## Getting Started with Sanity

### Prerequisites

- **Node.js 18+** — [Download here](https://nodejs.org)
- **pnpm** — Install with `npm install -g pnpm`
- **Sanity account** — Free at [sanity.io](https://sanity.io)

### Step 1: Install Dependencies

```bash
pnpm install
```

### Step 2: Create Your Sanity Project

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Sign up or log in
3. Click **"Create project"**
4. Give it a name (e.g., "My Website")
5. Choose the **Free** plan
6. **Create a dataset** named `production`
7. Copy your **Project ID** (you'll need this next)

### Step 3: Set Up Environment Variables

**For the website** — Create `apps/web/.env`:

```bash
cp apps/web/.env.example apps/web/.env
```

Open `apps/web/.env` and add your Project ID:

```env
SANITY_PROJECT_ID=your-project-id-here
SANITY_DATASET=production
SANITY_API_VERSION=2024-01-01
```

**For the CMS** — Create `apps/studio/.env`:

```bash
cp apps/studio/.env.example apps/studio/.env
```

Open `apps/studio/.env` and add the same Project ID:

```env
SANITY_STUDIO_PROJECT_ID=your-project-id-here
SANITY_STUDIO_DATASET=production
```

### Step 4: Enable Sanity Mode

Open `apps/web/src/lib/data.ts` and change:

```typescript
export const USE_SANITY = true;
```

### Step 5: Migrate Your Content (Optional)

Want to use the existing sample content? Run the migration script:

1. Get a Sanity API token:
   - Go to [sanity.io/manage](https://sanity.io/manage) → Your Project → API
   - Click **"Add API token"**
   - Name it "Migration" with **Editor** permissions
   - Copy the token

2. Run the full seed (recommended):

```bash
pnpm run seed:all
```

With a write token:

```bash
SANITY_WRITE_TOKEN=your-token-here pnpm run seed:all
```

The script reads `SANITY_PROJECT_ID` from `apps/web/.env`. **Running `seed:all` clears existing documents of each content type, then creates exactly one document per collection** (one post, one team member, one legal page, one service, one project, one career), so Sanity Studio ends up with one entry per type. All content is read from `apps/web/src/content/`, including images.

### Step 6: Start Development

```bash
pnpm dev
```

This starts:

- **Website** → http://localhost:4321
- **Sanity Studio (CMS)** → http://localhost:3333

### Step 7: Add Content in Studio

1. Go to http://localhost:3333
2. Create or edit content (posts, team members, projects, etc.)
3. Click **Publish** so updates show up on http://localhost:4321

---

## Switching Between Data Sources

The `USE_SANITY` flag in `apps/web/src/lib/data.ts` controls the data source:

```typescript
// Use Sanity CMS
export const USE_SANITY = true;

// Use Content Collections (markdown files)
export const USE_SANITY = false;
```

Both options use the same components and layouts — just different data sources.

---

## Project Structure

```
/
├── apps/
│   ├── web/                 # Astro website
│   │   ├── src/
│   │   │   ├── components/  # UI components
│   │   │   ├── content/     # Markdown content (Content Collections)
│   │   │   ├── layouts/     # Page layouts
│   │   │   ├── lib/         # Data utilities & Sanity integration
│   │   │   ├── pages/       # Route pages
│   │   │   └── styles/      # Global styles
│   │   └── .env.example
│   │
│   └── studio/              # Sanity CMS
│       ├── schemas/         # Content models
│       └── .env.example
│
├── scripts/                 # Utility scripts (migrations, cleanup)
├── pnpm-workspace.yaml
└── package.json
```

---

## Content Types

### Blog Posts (`posts/`)

| Field         | Type     | Description                   |
| ------------- | -------- | ----------------------------- |
| `title`       | string   | Post title                    |
| `description` | string   | Short summary for cards & SEO |
| `pubDate`     | date     | Publication date              |
| `image`       | object   | Cover image (`url`, `alt`)    |
| `tags`        | string[] | Categorization tags           |

### Team Members (`team/`)

| Field     | Type   | Description                    |
| --------- | ------ | ------------------------------ |
| `name`    | string | Full name                      |
| `role`    | string | Job title                      |
| `bio`     | text   | Biography                      |
| `image`   | object | Profile photo (`url`, `alt`)   |
| `socials` | array  | Social links (`label`, `href`) |

### Services (`services/`)

| Field         | Type     | Description                  |
| ------------- | -------- | ---------------------------- |
| `title`       | string   | Service name                 |
| `description` | text     | Full description             |
| `excerpt`     | string   | Short summary for cards      |
| `image`       | object   | Cover image (`url`, `alt`)   |
| `highlights`  | string[] | Key features / bullet points |
| `featured`    | boolean  | Show prominently             |

### Projects (`projects/`)

| Field         | Type     | Description                    |
| ------------- | -------- | ------------------------------ |
| `title`       | string   | Project name                   |
| `description` | text     | Project overview               |
| `client`      | string   | Client name                    |
| `location`    | string   | Project location               |
| `year`        | string   | Completion year                |
| `category`    | string   | Project category               |
| `services`    | string[] | Services provided              |
| `cover`       | object   | Cover image (`url`, `alt`)     |
| `gallery`     | array    | Gallery images (`url`, `alt`)  |
| `metrics`     | array    | Key metrics (`label`, `value`) |
| `featured`    | boolean  | Show prominently               |

### Careers (`careers/`)

| Field              | Type     | Description                 |
| ------------------ | -------- | --------------------------- |
| `title`            | string   | Job title                   |
| `description`      | text     | Job overview                |
| `location`         | string   | Work location               |
| `type`             | string   | Employment type (Full-time) |
| `department`       | string   | Department name             |
| `experience`       | string   | Experience level            |
| `salary`           | string   | Salary range                |
| `applyUrl`         | url      | External application link   |
| `email`            | string   | Contact email               |
| `responsibilities` | string[] | Job responsibilities        |
| `requirements`     | string[] | Job requirements            |
| `benefits`         | string[] | Benefits offered            |
| `active`           | boolean  | Position open?              |

### Legal Pages (`legal/`)

| Field     | Type   | Description                          |
| --------- | ------ | ------------------------------------ |
| `page`    | string | Page title (Privacy, Terms, Cookies) |
| `pubDate` | date   | Last updated date                    |

---

## Website Routes

| URL                  | Page                  |
| -------------------- | --------------------- |
| `/`                  | Homepage              |
| `/about`             | About page            |
| `/contact`           | Contact page          |
| `/blog`              | Blog listing          |
| `/blog/posts/[slug]` | Blog post detail      |
| `/blog/tags`         | All blog tags         |
| `/blog/tags/[tag]`   | Posts filtered by tag |
| `/team`              | Team listing          |
| `/team/[slug]`       | Team member profile   |
| `/services`          | Services listing      |
| `/services/[slug]`   | Service detail        |
| `/projects`          | Projects listing      |
| `/projects/[slug]`   | Project case study    |
| `/careers`           | Careers listing       |
| `/careers/[slug]`    | Job posting detail    |
| `/legal/[slug]`      | Legal pages           |
| `/rss.xml`           | RSS feed              |

---

## Deployment

### Deploy the Website

**Vercel (recommended):**

```bash
cd apps/web
npx vercel
```

**Netlify:**

```bash
cd apps/web
npx netlify deploy --prod
```

Add these environment variables in your hosting dashboard:

- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `SANITY_API_VERSION`

### Deploy the CMS

Deploy to Sanity's free hosting:

```bash
cd apps/studio
pnpm deploy
```

You'll get a URL like `https://your-project.sanity.studio`

---

## Customization

### Styling

Edit `apps/web/src/styles/global.css` for global styles. This theme uses Tailwind CSS v4.

### Adding New Content Types

1. Create schema in `apps/studio/schemas/`
2. Register in `apps/studio/schemas/index.ts`
3. Add to `apps/studio/structure.ts`
4. Create query in `apps/web/src/lib/sanity/queries.ts`
5. Add types in `apps/web/src/lib/sanity/types.ts`

---

## Troubleshooting

### "Cannot find module" errors?

Run `pnpm install` in the project root to reinstall dependencies.

### Content not showing?

- Make sure you clicked **"Publish"** in Sanity Studio
- Check that your Project ID is correct in both `.env` files
- Verify your dataset name matches (default: `production`)

### "Failed to fetch" error?

- Your Project ID might be wrong
- Go to [sanity.io/manage](https://sanity.io/manage) and verify the ID

### Images not loading?

- Images must be uploaded directly to Sanity
- Check that your image fields have the required `asset` data

### CORS errors?

- Go to [sanity.io/manage](https://sanity.io/manage) → Your Project → API → CORS Origins
- Add `http://localhost:4321` for development
- Add your production URL for deployment

---

## Useful Commands

| Command           | Description                                    |
| ----------------- | ---------------------------------------------- |
| `pnpm install`    | Install all dependencies                       |
| `pnpm dev`        | Start website + CMS                            |
| `pnpm dev:web`    | Start website only                             |
| `pnpm dev:studio` | Start CMS only                                 |
| `pnpm build`      | Build both for production                      |
| `pnpm migrate`    | Migrate Content Collections to Sanity          |
| `pnpm run seed:all` | Full seed: delete all docs by type, then create one per collection from `apps/web/src/content/` |
| `pnpm clean`      | Remove node_modules/.env/dist before packaging |

---

## Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lexington Themes](https://lexingtonthemes.com)

---

## License

MIT — Use freely for personal and commercial projects.
