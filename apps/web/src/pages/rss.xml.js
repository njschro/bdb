import rss from "@astrojs/rss";
import { getAllPosts } from "@/lib/data";

export async function GET(context) {
  const posts = await getAllPosts();
  return rss({
    title: 'Lexington Themes',
    description: 'Free and premium multipage themes and UI Kits For freelancers, developers, businesses, and personal use.Beautifully crafted with Astro.js, and Tailwind CSS — Simple & easy to customise.',
    site: context.site,
    items: posts
      .sort(
        (a, b) =>
          new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf(),
      )
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: new Date(post.data.pubDate),
        link: `/blog/posts/${post.slug}/`,
      })),
  });
}
