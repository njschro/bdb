import rss from "@astrojs/rss";
import { getAllNews } from "@/lib/data";

export async function GET(context) {
  const news = await getAllNews();
  
  return rss({
    title: 'Berg Design + Build',
    description: 'Berg Design + Build is built on integrity and built to last. Berg Design + Build is a full-service construction company based in Napoleon, proudly serving clients within a 50-mile radius. We specialize in residential, commercial, and custom construction projects.',
    site: context.site,
    items: news
      .sort(
        (a, b) =>
          new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf(),
      )
      .map((article) => ({
        title: article.data.title,
        description: article.data.description,
        pubDate: new Date(article.data.pubDate),
        // Note: If you renamed your folder from /blog/posts/ to /news/, 
        // you will need to update the link path below to match your actual route!
        link: `/blog/posts/${article.slug}/`, 
      })),
  });
}