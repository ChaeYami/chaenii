import { z } from "zod";

export const guestbookSchema = z.object({
  nickname: z.string().min(1, "이름을 입력해주세요").max(20, "20자 이내로 입력해주세요"),
  content: z.string().min(1, "메시지를 입력해주세요").max(200, "200자 이내로 입력해주세요"),
  password: z.string().min(4, "4자 이상 입력해주세요").max(20, "20자 이내로 입력해주세요"),
  // 하니팟: 화면에 안 보이는 함정 필드. 사람은 비워둠
  website: z.string().optional(),
});

export type GuestbookFormData = z.infer<typeof guestbookSchema>;

export const deleteSchema = z.object({
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

export type DeleteFormData = z.infer<typeof deleteSchema>;
