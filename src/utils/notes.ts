export function getCategory(n: { id: string; data: { category?: string } }): string {
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
