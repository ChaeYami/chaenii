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
  coverImageUrl?: string;
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
  coverImageUrl?: string;
}

export interface AdminStudy {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  notionUrl?: string;
  tags: string[];
  sortOrder: number;
}

export interface StudyFormData {
  title: string;
  description?: string;
  imageUrl?: string;
  notionUrl?: string;
  tags: string[];
}
