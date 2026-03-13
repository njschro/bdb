/**
 * Migration Script: Content Collections → Sanity
 *
 * This script reads your existing markdown content from apps/web/src/content/
 * and uploads it to Sanity, including images.
 *
 * Collections migrated (based on project structure):
 * - posts → post
 * - team → teamMember
 * - legal → legalPage
 * - services → service
 * - projects → project
 * - careers → career
 *
 * Usage:
 *   cd scripts
 *   SANITY_WRITE_TOKEN=your-token npx tsx migrate-to-sanity.ts
 *
 * The script automatically reads SANITY_PROJECT_ID from apps/web/.env
 */

import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { config } from "dotenv";

// Load environment variables from apps/web/.env
const webEnvPath = path.join(__dirname, "../apps/web/.env");
if (fs.existsSync(webEnvPath)) {
  config({ path: webEnvPath });
  console.log(`✓ Loaded environment from ${webEnvPath}`);
} else {
  console.warn(`⚠ No .env file found at ${webEnvPath}`);
}

// Sanity client configuration
const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_TOKEN;

if (!projectId) {
  console.error("\n❌ Error: SANITY_PROJECT_ID is missing.");
  console.log("\nMake sure apps/web/.env exists with:");
  console.log("  SANITY_PROJECT_ID=your-project-id");
  console.log("\nOr pass it directly:");
  console.log(
    "  SANITY_PROJECT_ID=your-project-id SANITY_WRITE_TOKEN=your-token npx tsx migrate-to-sanity.ts"
  );
  process.exit(1);
}

if (!token) {
  console.error(
    "\n❌ Error: SANITY_WRITE_TOKEN environment variable is required."
  );
  console.log("\nTo get a token:");
  console.log("1. Go to https://www.sanity.io/manage → Your Project → API");
  console.log("2. Create a new token with 'Editor' permissions");
  console.log(
    "3. Run: SANITY_WRITE_TOKEN=your-token npx tsx migrate-to-sanity.ts"
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const WEB_PATH = path.join(__dirname, "../apps/web/src");
const CONTENT_PATH = path.join(WEB_PATH, "content");
const IMAGES_PATH = path.join(WEB_PATH, "images");

// Track statistics
const stats = {
  posts: { success: 0, failed: 0 },
  team: { success: 0, failed: 0 },
  legal: { success: 0, failed: 0 },
  services: { success: 0, failed: 0 },
  projects: { success: 0, failed: 0 },
  careers: { success: 0, failed: 0 },
  images: { uploaded: 0, failed: 0, cached: 0 },
  deleted: { count: 0 },
};

/**
 * Generate unique keys for Sanity arrays
 */
const generateKey = () => Math.random().toString(36).substr(2, 9);

const BATCH_SIZE = 25;

/**
 * Delete documents in batches (e.g. 25 per transaction) for reliability
 */
async function deleteByIds(ids: string[], label: string) {
  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    const batch = ids.slice(i, i + BATCH_SIZE);
    try {
      const transaction = client.transaction();
      batch.forEach((id: string) => transaction.delete(id));
      await transaction.commit();
      stats.deleted.count += batch.length;
    } catch (error) {
      console.error(`  Failed to delete batch (${label}):`, error);
    }
  }
}

/**
 * Delete all existing documents of a given type (batched)
 */
async function deleteAllOfType(type: string) {
  try {
    const docs = await client.fetch(`*[_type == "${type}"]._id`);
    if (docs.length > 0) {
      await deleteByIds(docs, type);
      console.log(`  Deleted ${docs.length} existing ${type} documents`);
    }
  } catch (error) {
    console.error(`  Failed to delete ${type} documents:`, error);
  }
}

// Image cache to avoid re-uploading the same image
const imageCache: Map<
  string,
  { _type: string; asset: { _type: string; _ref: string }; alt?: string }
> = new Map();

/**
 * Helper to read markdown files from a directory
 */
function readMarkdownFiles(dir: string) {
  if (!fs.existsSync(dir)) {
    console.warn(`  Directory not found: ${dir}`);
    return [];
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  return files.map((file) => {
    const content = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content: body } = matter(content);
    const slug = path.basename(file, ".md");
    return { slug, frontmatter: data, body };
  });
}

/**
 * Collect document ids that will be created from content dirs (for id-based cleanup)
 */
function getDocumentIdsToCreate(): string[] {
  const ids: string[] = [];
  const dirs: { dir: string; prefix: string }[] = [
    { dir: path.join(CONTENT_PATH, "posts"), prefix: "post-" },
    { dir: path.join(CONTENT_PATH, "team"), prefix: "team-" },
    { dir: path.join(CONTENT_PATH, "legal"), prefix: "legal-" },
    { dir: path.join(CONTENT_PATH, "services"), prefix: "service-" },
    { dir: path.join(CONTENT_PATH, "projects"), prefix: "project-" },
    { dir: path.join(CONTENT_PATH, "careers"), prefix: "career-" },
  ];
  for (const { dir: d, prefix } of dirs) {
    if (!fs.existsSync(d)) continue;
    const files = fs.readdirSync(d).filter((f) => f.endsWith(".md"));
    files.forEach((file) => {
      ids.push(prefix + path.basename(file, ".md"));
    });
  }
  return ids;
}

/**
 * Upload an image to Sanity and return the asset reference
 */
async function uploadImage(imagePath: string, altText: string = "") {
  // Check cache first
  const cacheKey = `${imagePath}:${altText}`;
  if (imageCache.has(cacheKey)) {
    stats.images.cached++;
    return imageCache.get(cacheKey)!;
  }

  // Convert /src/images/... path to actual file path
  const relativePath = imagePath.replace(/^\/src\/images\//, "");
  const fullPath = path.join(IMAGES_PATH, relativePath);

  if (!fs.existsSync(fullPath)) {
    console.warn(`    ⚠ Image not found: ${fullPath}`);
    stats.images.failed++;
    return null;
  }

  try {
    const imageBuffer = fs.readFileSync(fullPath);
    const asset = await client.assets.upload("image", imageBuffer, {
      filename: path.basename(fullPath),
    });

    const result = {
      _type: "image" as const,
      asset: {
        _type: "reference" as const,
        _ref: asset._id,
      },
      alt: altText,
    };

    imageCache.set(cacheKey, result);
    stats.images.uploaded++;
    return result;
  } catch (error) {
    console.error(`    ✗ Failed to upload image: ${fullPath}`, error);
    stats.images.failed++;
    return null;
  }
}

/**
 * Convert markdown to Portable Text blocks
 */
function markdownToPortableText(markdown: string) {
  if (!markdown || !markdown.trim()) {
    return [];
  }

  const blocks: any[] = [];
  const lines = markdown.split("\n");
  let currentParagraph: string[] = [];
  let inList = false;
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join("\n").trim();
      if (text) {
        blocks.push({
          _type: "block",
          _key: generateKey(),
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: generateKey(),
              text: text,
              marks: [],
            },
          ],
        });
      }
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      listItems.forEach((item) => {
        blocks.push({
          _type: "block",
          _key: generateKey(),
          style: "normal",
          listItem: "bullet",
          level: 1,
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: generateKey(),
              text: item,
              marks: [],
            },
          ],
        });
      });
      listItems = [];
      inList = false;
    }
  };

  for (const line of lines) {
    // Headers
    if (line.startsWith("#### ")) {
      flushParagraph();
      flushList();
      blocks.push({
        _type: "block",
        _key: generateKey(),
        style: "h4",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: generateKey(),
            text: line.replace(/^#### /, ""),
            marks: [],
          },
        ],
      });
    } else if (line.startsWith("### ")) {
      flushParagraph();
      flushList();
      blocks.push({
        _type: "block",
        _key: generateKey(),
        style: "h3",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: generateKey(),
            text: line.replace(/^### /, ""),
            marks: [],
          },
        ],
      });
    } else if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push({
        _type: "block",
        _key: generateKey(),
        style: "h2",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: generateKey(),
            text: line.replace(/^## /, ""),
            marks: [],
          },
        ],
      });
    } else if (line.startsWith("# ")) {
      flushParagraph();
      flushList();
      blocks.push({
        _type: "block",
        _key: generateKey(),
        style: "h1",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: generateKey(),
            text: line.replace(/^# /, ""),
            marks: [],
          },
        ],
      });
    } else if (line.match(/^[-*]\s/)) {
      // List item
      flushParagraph();
      inList = true;
      listItems.push(line.replace(/^[-*]\s/, "").trim());
    } else if (line.trim() === "") {
      flushParagraph();
      flushList();
    } else if (!line.startsWith("![") && !line.startsWith("|")) {
      // Skip images and tables, add to paragraph
      if (inList) {
        flushList();
      }
      currentParagraph.push(line);
    }
  }

  flushParagraph();
  flushList();

  return blocks;
}

// =============================================================================
// MIGRATION FUNCTIONS
// =============================================================================

/**
 * Migrate posts collection
 */
async function migratePosts() {
  console.log("\n📰 Migrating Posts...");
  const postsDir = path.join(CONTENT_PATH, "posts");
  const posts = readMarkdownFiles(postsDir);

  if (posts.length === 0) {
    console.log("  No posts found, skipping...");
    return;
  }

  for (const post of posts) {
    const { slug, frontmatter, body } = post;
    console.log(`  - ${frontmatter.title || slug}`);

    // Validate required fields
    if (!frontmatter.title) {
      console.error(`    ✗ Missing required field: title`);
      stats.posts.failed++;
      continue;
    }
    if (!frontmatter.pubDate) {
      console.error(`    ✗ Missing required field: pubDate`);
      stats.posts.failed++;
      continue;
    }

    // Upload image
    let image = null;
    if (frontmatter.image?.url) {
      image = await uploadImage(
        frontmatter.image.url,
        frontmatter.image.alt || ""
      );
    }

    // Convert body to Portable Text
    const portableTextBody = markdownToPortableText(body);

    const doc = {
      _type: "post",
      _id: `post-${slug}`,
      title: frontmatter.title,
      slug: { _type: "slug", current: slug },
      description: frontmatter.description || "",
      pubDate: new Date(frontmatter.pubDate).toISOString(),
      image,
      tags: frontmatter.tags || [],
      body: portableTextBody,
    };

    try {
      await client.createOrReplace(doc);
      console.log(`    ✓ Created`);
      stats.posts.success++;
    } catch (error) {
      console.error(`    ✗ Failed:`, error);
      stats.posts.failed++;
    }
  }
}

/**
 * Migrate team collection
 */
async function migrateTeam() {
  console.log("\n👥 Migrating Team Members...");
  const teamDir = path.join(CONTENT_PATH, "team");
  const members = readMarkdownFiles(teamDir);

  if (members.length === 0) {
    console.log("  No team members found, skipping...");
    return;
  }

  for (const member of members) {
    const { slug, frontmatter, body } = member;
    console.log(`  - ${frontmatter.name || slug}`);

    // Validate required fields
    if (!frontmatter.name) {
      console.error(`    ✗ Missing required field: name`);
      stats.team.failed++;
      continue;
    }

    // Upload image
    let image = null;
    if (frontmatter.image?.url) {
      image = await uploadImage(
        frontmatter.image.url,
        frontmatter.image.alt || ""
      );
    }

    // Convert body to Portable Text (if any extended bio)
    const portableTextBody = markdownToPortableText(body);

    // Format socials with _type and _key
    let socials = undefined;
    if (frontmatter.socials && Array.isArray(frontmatter.socials)) {
      socials = frontmatter.socials.map(
        (social: { label?: string; href?: string }) => ({
          _type: "object",
          _key: generateKey(),
          label: social.label || "",
          href: social.href || "",
        })
      );
    }

    const doc = {
      _type: "teamMember",
      _id: `team-${slug}`,
      name: frontmatter.name,
      slug: { _type: "slug", current: slug },
      role: frontmatter.role || undefined,
      bio: frontmatter.bio || undefined,
      image,
      socials,
      body: portableTextBody.length > 0 ? portableTextBody : undefined,
    };

    try {
      await client.createOrReplace(doc);
      console.log(`    ✓ Created`);
      stats.team.success++;
    } catch (error) {
      console.error(`    ✗ Failed:`, error);
      stats.team.failed++;
    }
  }
}

/**
 * Migrate legal pages collection
 */
async function migrateLegal() {
  console.log("\n📜 Migrating Legal Pages...");
  const legalDir = path.join(CONTENT_PATH, "legal");
  const pages = readMarkdownFiles(legalDir);

  if (pages.length === 0) {
    console.log("  No legal pages found, skipping...");
    return;
  }

  for (const page of pages) {
    const { slug, frontmatter, body } = page;
    console.log(`  - ${frontmatter.page || slug}`);

    // Validate required fields
    if (!frontmatter.page) {
      console.error(`    ✗ Missing required field: page`);
      stats.legal.failed++;
      continue;
    }

    // Convert body to Portable Text
    const portableTextBody = markdownToPortableText(body);

    const doc = {
      _type: "legalPage",
      _id: `legal-${slug}`,
      page: frontmatter.page,
      slug: { _type: "slug", current: slug },
      pubDate: frontmatter.pubDate
        ? new Date(frontmatter.pubDate).toISOString()
        : new Date().toISOString(),
      body: portableTextBody,
    };

    try {
      await client.createOrReplace(doc);
      console.log(`    ✓ Created`);
      stats.legal.success++;
    } catch (error) {
      console.error(`    ✗ Failed:`, error);
      stats.legal.failed++;
    }
  }
}

/**
 * Migrate services collection
 */
async function migrateServices() {
  console.log("\n🔧 Migrating Services...");
  const servicesDir = path.join(CONTENT_PATH, "services");
  const services = readMarkdownFiles(servicesDir);

  if (services.length === 0) {
    console.log("  No services found, skipping...");
    return;
  }

  for (const service of services) {
    const { slug, frontmatter, body } = service;
    console.log(`  - ${frontmatter.title || slug}`);

    // Validate required fields
    if (!frontmatter.title) {
      console.error(`    ✗ Missing required field: title`);
      stats.services.failed++;
      continue;
    }

    // Upload image
    let image = null;
    if (frontmatter.image?.url) {
      image = await uploadImage(
        frontmatter.image.url,
        frontmatter.image.alt || ""
      );
    }

    // Convert body to Portable Text
    const portableTextBody = markdownToPortableText(body);

    const doc = {
      _type: "service",
      _id: `service-${slug}`,
      title: frontmatter.title,
      slug: { _type: "slug", current: slug },
      description: frontmatter.description || "",
      excerpt: frontmatter.excerpt || undefined,
      image,
      highlights: frontmatter.highlights || undefined,
      featured: frontmatter.featured || false,
      body: portableTextBody,
    };

    try {
      await client.createOrReplace(doc);
      console.log(`    ✓ Created`);
      stats.services.success++;
    } catch (error) {
      console.error(`    ✗ Failed:`, error);
      stats.services.failed++;
    }
  }
}

/**
 * Migrate projects collection
 */
async function migrateProjects() {
  console.log("\n🏗️ Migrating Projects...");
  const projectsDir = path.join(CONTENT_PATH, "projects");
  const projects = readMarkdownFiles(projectsDir);

  if (projects.length === 0) {
    console.log("  No projects found, skipping...");
    return;
  }

  for (const project of projects) {
    const { slug, frontmatter, body } = project;
    console.log(`  - ${frontmatter.title || slug}`);

    // Validate required fields
    if (!frontmatter.title) {
      console.error(`    ✗ Missing required field: title`);
      stats.projects.failed++;
      continue;
    }

    // Upload cover image
    let cover = null;
    if (frontmatter.cover?.url) {
      cover = await uploadImage(
        frontmatter.cover.url,
        frontmatter.cover.alt || ""
      );
    }

    // Upload gallery images
    let gallery = undefined;
    if (frontmatter.gallery && Array.isArray(frontmatter.gallery)) {
      gallery = [];
      for (const img of frontmatter.gallery) {
        if (img.url) {
          const uploaded = await uploadImage(img.url, img.alt || "");
          if (uploaded) {
            gallery.push(uploaded);
          }
        }
      }
      if (gallery.length === 0) {
        gallery = undefined;
      }
    }

    // Convert body to Portable Text
    const portableTextBody = markdownToPortableText(body);

    // Format metrics with _type and _key
    let metrics = undefined;
    if (frontmatter.metrics && Array.isArray(frontmatter.metrics)) {
      metrics = frontmatter.metrics.map(
        (metric: { label?: string; value?: string }) => ({
          _type: "object",
          _key: generateKey(),
          label: metric.label || "",
          value: metric.value || "",
        })
      );
    }

    // Add _key to gallery images
    if (gallery) {
      gallery = gallery.map((img: any) => ({
        ...img,
        _key: generateKey(),
      }));
    }

    const doc = {
      _type: "project",
      _id: `project-${slug}`,
      title: frontmatter.title,
      slug: { _type: "slug", current: slug },
      description: frontmatter.description || "",
      client: frontmatter.client || undefined,
      location: frontmatter.location || undefined,
      year: frontmatter.year?.toString() || undefined,
      category: frontmatter.category || undefined,
      services: frontmatter.services || undefined,
      cover,
      gallery,
      metrics,
      featured: frontmatter.featured || false,
      body: portableTextBody,
    };

    try {
      await client.createOrReplace(doc);
      console.log(`    ✓ Created`);
      stats.projects.success++;
    } catch (error) {
      console.error(`    ✗ Failed:`, error);
      stats.projects.failed++;
    }
  }
}

/**
 * Migrate careers collection
 */
async function migrateCareers() {
  console.log("\n💼 Migrating Careers...");
  const careersDir = path.join(CONTENT_PATH, "careers");
  const careers = readMarkdownFiles(careersDir);

  if (careers.length === 0) {
    console.log("  No careers found, skipping...");
    return;
  }

  for (const career of careers) {
    const { slug, frontmatter, body } = career;
    console.log(`  - ${frontmatter.title || slug}`);

    // Validate required fields
    if (!frontmatter.title) {
      console.error(`    ✗ Missing required field: title`);
      stats.careers.failed++;
      continue;
    }

    // Convert body to Portable Text
    const portableTextBody = markdownToPortableText(body);

    const doc = {
      _type: "career",
      _id: `career-${slug}`,
      title: frontmatter.title,
      slug: { _type: "slug", current: slug },
      description: frontmatter.description || "",
      location: frontmatter.location || undefined,
      type: frontmatter.type || undefined,
      department: frontmatter.department || undefined,
      experience: frontmatter.experience || undefined,
      salary: frontmatter.salary || undefined,
      applyUrl: frontmatter.applyUrl || undefined,
      email: frontmatter.email || undefined,
      responsibilities: frontmatter.responsibilities || undefined,
      requirements: frontmatter.requirements || undefined,
      benefits: frontmatter.benefits || undefined,
      active: frontmatter.active !== false, // Default to true
      body: portableTextBody,
    };

    try {
      await client.createOrReplace(doc);
      console.log(`    ✓ Created`);
      stats.careers.success++;
    } catch (error) {
      console.error(`    ✗ Failed:`, error);
      stats.careers.failed++;
    }
  }
}

// =============================================================================
// MAIN
// =============================================================================

async function migrate() {
  console.log("🚀 Starting migration to Sanity...\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Project ID: ${projectId}`);
  console.log(`Dataset:    ${dataset}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // Verify content directory exists
  if (!fs.existsSync(CONTENT_PATH)) {
    console.error(`\n❌ Content directory not found: ${CONTENT_PATH}`);
    process.exit(1);
  }

  // List available collections
  const collections = fs
    .readdirSync(CONTENT_PATH)
    .filter(
      (f) =>
        fs.statSync(path.join(CONTENT_PATH, f)).isDirectory() &&
        !f.startsWith(".")
    );
  console.log(`\nCollections found: ${collections.join(", ")}`);

  try {
    // 1. Delete all existing documents by type (batched)
    console.log("\n🗑️  Deleting existing documents by type...");
    await deleteAllOfType("post");
    await deleteAllOfType("teamMember");
    await deleteAllOfType("legalPage");
    await deleteAllOfType("service");
    await deleteAllOfType("project");
    await deleteAllOfType("career");

    // 2. Id-based cleanup: delete exact ids that will be created (avoids "immutable _type" on create)
    const idsToCreate = getDocumentIdsToCreate();
    if (idsToCreate.length > 0) {
      console.log(`\n🗑️  Deleting ${idsToCreate.length} document ids that will be recreated...`);
      await deleteByIds(idsToCreate, "id-cleanup");
    }

    // 3. Short delay so Sanity can apply mutations (avoids replication lag)
    console.log("\n⏳ Waiting 2.5s for Sanity to apply mutations...");
    await new Promise((r) => setTimeout(r, 2500));

    // 4. Migrate all collections (creates one document per content file)
    console.log("\n📥 Creating documents...");
    await migratePosts();
    await migrateTeam();
    await migrateLegal();
    await migrateServices();
    await migrateProjects();
    await migrateCareers();

    // Print summary
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📊 Migration Summary");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    const collectionNames = [
      "posts",
      "team",
      "legal",
      "services",
      "projects",
      "careers",
    ] as const;
    let _totalSuccess = 0;
    let totalFailed = 0;

    for (const collection of collectionNames) {
      const { success, failed } = stats[collection];
      _totalSuccess += success;
      totalFailed += failed;
      const icon = failed > 0 ? "⚠" : "✓";
      console.log(
        `${icon} ${collection.padEnd(12)} ${success} migrated${failed > 0 ? `, ${failed} failed` : ""}`
      );
    }

    console.log("");
    console.log(
      `📷 Images: ${stats.images.uploaded} uploaded, ${stats.images.cached} cached, ${stats.images.failed} failed`
    );
    console.log(`🗑️  Deleted: ${stats.deleted.count} old documents`);
    console.log("");

    if (totalFailed > 0) {
      console.log(`⚠ Migration completed with ${totalFailed} errors.`);
    } else {
      console.log("✅ Migration complete!");
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Next steps:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("1. Open Sanity Studio:  pnpm dev:studio");
    console.log("2. View your content at http://localhost:3333");
    console.log(
      "3. Enable Sanity mode:  Set USE_SANITY = true in apps/web/src/lib/data.ts"
    );
    console.log("4. Start the website:   pnpm dev:web");
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  }
}

migrate();
