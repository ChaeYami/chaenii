export interface GuestbookEntry {
  id: number;
  nickname: string;
  content: string;
  reply: string | null;
  createdAt: string;
}

export interface GuestbookPage {
  content: GuestbookEntry[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  number: number;
}
