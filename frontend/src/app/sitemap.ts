import type { MetadataRoute } from "next";

const SITE_URL = "https://chaenii.me";

async function getProjectSlugs(): Promise<string[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
    const res = await fetch(`${apiUrl}/api/projects`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as { slug: string }[];
    return data.map((p) => p.slug).filter((s) => s && s !== "_placeholder");
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const slugs = await getProjectSlugs();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...slugs.map((slug) => ({
      url: `${SITE_URL}/projects/${slug}/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
