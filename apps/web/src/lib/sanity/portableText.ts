import { toHTML, uriLooksSafe } from "@portabletext/to-html";
import type { PortableTextBlock } from "@portabletext/types";
import { getImageUrl } from "./image";

/**
 * Convert Portable Text to HTML string for rendering in Astro
 * This avoids needing React components on the frontend
 */
export function portableTextToHtml(blocks: PortableTextBlock[]): string {
  if (!blocks || blocks.length === 0) {
    return "";
  }

  return toHTML(blocks, {
    components: {
      types: {
        image: ({ value }) => {
          const url = getImageUrl(value, { width: 1200 });
          const alt = value.alt || "";
          const caption = value.caption || "";

          return `
            <figure>
              <img src="${url}" alt="${alt}" loading="lazy" decoding="async" />
              ${caption ? `<figcaption>${caption}</figcaption>` : ""}
            </figure>
          `;
        },
        code: ({ value }) => {
          const filename = value.filename
            ? `<div class="code-filename">${value.filename}</div>`
            : "";
          const language = value.language || "text";
          return `
            ${filename}
            <pre><code class="language-${language}">${escapeHtml(value.code)}</code></pre>
          `;
        },
      },
      marks: {
        link: ({ children, value }) => {
          const href = value?.href || "";
          // Safety check for URLs
          if (!uriLooksSafe(href)) {
            return children;
          }
          const target = href.startsWith("http")
            ? ' target="_blank" rel="noopener noreferrer"'
            : "";
          return `<a href="${href}"${target}>${children}</a>`;
        },
        code: ({ children }) => `<code>${children}</code>`,
      },
      block: {
        h1: ({ children }) => `<h1>${children}</h1>`,
        h2: ({ children }) => `<h2>${children}</h2>`,
        h3: ({ children }) => `<h3>${children}</h3>`,
        h4: ({ children }) => `<h4>${children}</h4>`,
        blockquote: ({ children }) => `<blockquote>${children}</blockquote>`,
        normal: ({ children }) => `<p>${children}</p>`,
      },
      list: {
        bullet: ({ children }) => `<ul>${children}</ul>`,
        number: ({ children }) => `<ol>${children}</ol>`,
      },
      listItem: {
        bullet: ({ children }) => `<li>${children}</li>`,
        number: ({ children }) => `<li>${children}</li>`,
      },
    },
  });
}

/**
 * Escape HTML entities for safe rendering
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Get plain text from Portable Text (for excerpts, reading time, etc.)
 */
export function portableTextToPlainText(blocks: PortableTextBlock[]): string {
  if (!blocks || blocks.length === 0) {
    return "";
  }

  return blocks
    .filter((block) => block._type === "block")
    .map((block) => {
      if (block.children) {
        return (block.children as Array<{ text?: string }>)
          .map((child) => child.text || "")
          .join("");
      }
      return "";
    })
    .join("\n\n");
}
