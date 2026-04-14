import ProjectDetailClient from "./ProjectDetailClient";

export function generateStaticParams() {
  return [];
}

export default function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return <ProjectDetailClient slug={params.slug} />;
}
