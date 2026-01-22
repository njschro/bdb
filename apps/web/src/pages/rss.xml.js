import rss from "@astrojs/rss";
import { sanityFetch, allPostsQuery, transformPost } from "../lib/sanity";

export async function GET(context) {
  const sanityPosts = await sanityFetch(allPostsQuery);
  const posts = sanityPosts.map(transformPost);

  return rss({
    title: "Lexington Themes",
    description:
      "Free and premium multipage themes and UI Kits For freelancers, developers, businesses, and personal use. Beautifully crafted with Astro.js, and Tailwind CSS — Simple & easy to customise.",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/posts/${post.slug}/`,
    })),
  });
}
