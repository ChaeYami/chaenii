export interface Project {
  id: number;
  slug: string;
  name: string;
  category: string;
  period: string;
  role: string;
  description: string;
  skills: string[];
  status: "completed" | "building";
  progress?: number;
  githubUrl?: string;
  notionUrl?: string;
  coverImageUrl?: string;
  serviceUrl?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
}

export interface ProjectDetail extends Project {
  detailContent: string;
}
