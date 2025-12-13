import { pineconeIndex } from "@/lib/pinecone";
import { embeddings } from "@/lib/embeddings";

export async function searchKnowledgeBase(query: string) {
  const queryEmbedding = await embeddings.embedQuery(query);

  const result = await pineconeIndex.query({
    vector: queryEmbedding,
    topK: 5,
    includeMetadata: true,
  });

  return result.matches?.map((m) => ({
    content: m.metadata?.content as string,
    fileName: m.metadata?.fileName as string,
  })) || [];
}