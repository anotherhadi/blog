export function getCategory(n: {
  id: string;
  data: { category?: string };
}): string {
  if (n.data.category) return n.data.category;
  const parts = n.id.split("/");
  return parts.length > 1 ? parts[0] : "General";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .trim()
    .replace(/ +/g, "-");
}

export function extractExternalLinks(body: string): { url: string; label: string }[] {
  const seen = new Set<string>();
  const links: { url: string; label: string }[] = [];

  // Markdown: [label](https://...)
  const mdRe = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
  let m;
  while ((m = mdRe.exec(body)) !== null) {
    if (!seen.has(m[2])) {
      seen.add(m[2]);
      links.push({ url: m[2], label: m[1] });
    }
  }

  // HTML: <a href="https://...">...</a> — use h4 content as label if present, else href host
  const htmlRe = /<a\s[^>]*href="(https?:\/\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
  while ((m = htmlRe.exec(body)) !== null) {
    const url = m[1];
    if (seen.has(url)) continue;
    seen.add(url);
    const h4 = m[2].match(/<h4[^>]*>([\s\S]*?)<\/h4>/);
    const label = h4 ? h4[1].trim() : new URL(url).hostname;
    links.push({ url, label });
  }

  return links;
}

export function extractLinks(body: string): string[] {
  const re = /\(\/notes\/([^)#\s]+)(?:#[^)\s]*)?\)/g;
  const ids: string[] = [];
  let m;
  while ((m = re.exec(body)) !== null) ids.push(m[1]);
  return [...new Set(ids)];
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function extractHeadings(
  body: string,
): { depth: number; text: string; id: string }[] {
  const headings: { depth: number; text: string; id: string }[] = [];
  const re = /^(#{2,4}) (.+)$/gm;
  let m;
  while ((m = re.exec(body)) !== null) {
    const raw = m[2]
      .trim()
      .replace(/`[^`]*`/g, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/(?<!\p{L}\p{N})__(.*?)__(?!\p{L}\p{N})/gu, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/(?<!\p{L}\p{N})_(.*?)_(?!\p{L}\p{N})/gu, "$1")
      .replace(/[*]/g, "");
    headings.push({ depth: m[1].length, text: raw, id: slugify(raw) });
  }
  return headings;
}
