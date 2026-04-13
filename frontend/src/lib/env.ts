import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
});

function parseEnv() {
  const result = envSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  });

  if (!result.success) {
    const formatted = result.error.flatten().fieldErrors;
    throw new Error(
      `Missing or invalid environment variables:\n${JSON.stringify(formatted, null, 2)}`
    );
  }

  return result.data;
}

export const env = parseEnv();
