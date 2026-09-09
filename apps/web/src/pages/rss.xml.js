import rss from "@astrojs/rss";
import { getAllNews } from "@/lib/data";

export async function GET(context) {
  const articles = await getAllNews();
  return rss({
    title: 'Lexington Themes',
    description: 'Free and premium multipage themes and UI Kits For freelancers, developers, businesses, and personal use.Beautifully crafted with Astro.js, and Tailwind CSS — Simple & easy to customise.',
    site: context.site,
    items: articles
      .sort(
        (a, b) =>
          new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf(),
      )
      .map((article) => ({
        title: article.data.title,
        description: article.data.description,
        pubDate: new Date(article.data.pubDate),
        link: `/news/articles/${article.slug}/`,
      })),
  });
}
