import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const blog = await getCollection("blog");

  const blogItems = blog.map((post) => ({
    title: post.data.title,
    pubDate: post.data.publishDate,
    description: post.data.description,
    link: `/blog/${post.id}/`,
    enclosure: {
      url: new URL(post.data.image.src, context.site).toString(),
      length: 0,
      type: "image/png",
    },
  }));

  const allItems = [...blogItems].sort(
    (a, b) => b.pubDate.getTime() - a.pubDate.getTime(),
  );

  return rss({
    title: "Another Hadi - Blog posts",
    description:
      "Thoughts, insights, and tutorials on cybersecurity, OSINT, and technology.",
    site: context.site!,
    items: allItems,
    customData: `<language>en</language>`,
  });
}
