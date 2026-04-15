import ProjectDetailClient from "./ProjectDetailClient";

export async function generateStaticParams() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
    const res = await fetch(`${apiUrl}/api/projects`, { cache: "no-store" });
    if (!res.ok) throw new Error("API unavailable");
    const data = await res.json();
    return data.map((p: { slug: string }) => ({ slug: p.slug }));
  } catch {
    return [{ slug: "_placeholder" }];
  }
}

export default function ProjectDetailPage() {
  return <ProjectDetailClient />;
}
