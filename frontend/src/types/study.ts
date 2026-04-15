export interface Study {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  notionUrl?: string;
  tags: string[];
  period?: string;
  sortOrder: number;
}
