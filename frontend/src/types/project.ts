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
}

export interface ProjectDetail extends Project {
  detailContent: string;
}
