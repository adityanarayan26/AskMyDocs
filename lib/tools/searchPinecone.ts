import { pineconeIndex } from "@/lib/pinecone";
import { embeddings } from "@/lib/embeddings";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function searchKnowledgeBase(query: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.log("No user found in searchKnowledgeBase");
    return [];
  }

  const queryEmbedding = await embeddings.embedQuery(query);

  const result = await pineconeIndex.query({
    vector: queryEmbedding,
    topK: 5,
    includeMetadata: true,
    filter: {
      userId: user.id
    }
  });

  return result.matches?.map((m) => ({
    content: m.metadata?.content as string,
    fileName: m.metadata?.fileName as string,
  })) || [];
}