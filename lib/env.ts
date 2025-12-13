import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  PINECONE_API_KEY: z.string(),
  PINECONE_INDEX_NAME: z.string(),
  OPENAI_API_KEY: z.string(),
  LANGFUSE_PUBLIC_KEY: z.string(),
  LANGFUSE_SECRET_KEY: z.string(),
  LANGFUSE_HOST: z.string().url(),
});

envSchema.parse(process.env);