import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const blog = await getCollection("blog");
  const projects = await getCollection("projects");

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

  const projectItems = projects.map((project) => ({
    title: `[Project] ${project.data.title}`,
    pubDate: new Date(),
    description: project.data.description,
    link: `/projects/${project.id}/`,
    enclosure: {
      url: new URL(project.data.image.src, context.site).toString(),
      length: 0,
      type: "image/png",
    },
  }));

  const allItems = [...blogItems, ...projectItems].sort(
    (a, b) => b.pubDate.getTime() - a.pubDate.getTime(),
  );

  return rss({
    title: "Another Hadi",
    description:
      "Thoughts, insights, and tutorials on cybersecurity, OSINT, and technology.",
    site: context.site!,
    items: allItems,
    customData: `<language>en</language>`,
  });
}
