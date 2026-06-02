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
  // 목록 API도 detailContent를 내려주므로 카드에서 상세보기 노출 여부 판단에 사용
  detailContent?: string;
}

export interface ProjectDetail extends Project {
  detailContent: string;
}
