export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { createSupabaseServerClient, supabaseAdmin } from "@/lib/supabase/server";
import { pineconeIndex } from "@/lib/pinecone";

export async function POST(req: Request) {
    try {
        const { documentId } = await req.json();

        if (!documentId) {
            return NextResponse.json({ error: "Missing documentId" }, { status: 400 });
        }

        // 1. Authenticate User
        const supabase = await createSupabaseServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Verify Ownership (Optional but good practice to check if doc exists and belongs to user first)
        // However, RLS on Supabase deletion will handle the DB part security.
        // For Pinecone, we must manually ensure we only delete this user's vectors.

        // 3. Delete from Pinecone
        // We delete by filter: documentId AND userId (safety check)
        try {
            await pineconeIndex.deleteMany({
                filter: {
                    documentId: { $eq: documentId },
                    userId: { $eq: user.id }
                }
            });
        } catch (pineconeError) {
            console.error("Pinecone deletion error:", pineconeError);
            // We continue to delete from DB even if Pinecone fails, to avoid "ghost" documents in UI
        }

        // 4. Delete from Supabase
        // RLS should enforce that we can only delete our own rows
        const { error: dbError } = await supabaseAdmin
            .from("documents")
            .delete()
            .eq("id", documentId)
            .eq("user_id", user.id); // Explicitly check user_id for safety with Admin client

        if (dbError) {
            console.error("Database deletion error:", dbError);
            return NextResponse.json({ error: "Failed to delete from database" }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Deletion error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
