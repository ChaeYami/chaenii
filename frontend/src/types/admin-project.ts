export interface AdminProject {
  id: number;
  slug: string;
  name: string;
  description: string;
  period: string;
  role: string;
  skills: string[];
  category: string;
  githubUrl?: string;
  notionUrl?: string;
  status: "completed" | "building";
  progress?: number;
  detailContent: string;
  sortOrder: number;
}

export interface ProjectFormData {
  slug: string;
  name: string;
  description: string;
  period: string;
  role: string;
  skills: string[];
  category: string;
  githubUrl?: string;
  notionUrl?: string;
  status: "completed" | "building";
  progress?: number;
  detailContent: string;
}
