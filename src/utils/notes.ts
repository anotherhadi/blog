export function getCategory(n: {
  id: string;
  data: { category?: string };
}): string {
  if (n.data.category) return n.data.category;
  const parts = n.id.split("/");
  return parts.length > 1 ? parts[0] : "General";
}

export function extractInlineHashtags(body: string): string[] {
  const re = /#(\w+)/g;
  const tags: string[] = [];
  let m;
  while ((m = re.exec(body)) !== null) tags.push(m[1].toLowerCase());
  return [...new Set(tags)];
}

// Mirrors github-slugger: keeps _, keeps unicode letters/numbers, spaces → hyphens
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .trim()
    .replace(/ +/g, "-");
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
    month: "short",
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
