import { supabaseAdmin } from "@/lib/supabase";

export async function getAvailableDocuments() {
  const { data, error } = await supabaseAdmin
    .from("documents")
    .select("id, file_name");

  if (error) throw error;

  return data.map((d) => ({
    id: d.id,
    fileName: d.file_name,
  }));
}