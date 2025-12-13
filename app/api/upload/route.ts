export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { pineconeIndex } from "@/lib/pinecone";
import { parseFile } from "@/lib/file-parser";
import { chunkText } from "@/lib/chunker";
import { embeddings } from "@/lib/embeddings";

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
        return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const documentId = randomUUID();

    // 1. Save metadata first
    const { error: insertError } = await supabaseAdmin
        .from("documents")
        .insert({
            id: documentId,
            file_name: file.name,
            file_type: file.type,
            chunk_count: 0,
        });

    if (insertError) {
        return NextResponse.json({ error: "DB insert failed" }, { status: 500 });
    }

    // 2. Parse file
    const rawText = await parseFile(file);

    // 3. Chunk
    const chunks = await chunkText(rawText);

    // 4. Embed + upsert
    const vectors = await Promise.all(
        chunks.map(async (content: string, i: number) => ({
            id: `${documentId}-${i}`,
            values: await embeddings.embedQuery(content),
            metadata: {
                documentId,
                fileName: file.name,
                chunkIndex: i,
                content,
            },
        }))
    );

    await pineconeIndex.upsert(vectors);

    // 5. Update chunk count
    await supabaseAdmin
        .from("documents")
        .update({ chunk_count: chunks.length })
        .eq("id", documentId);

    return NextResponse.json({
        documentId,
        chunks: chunks.length,
    });
}