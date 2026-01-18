import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getAvailableDocuments() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("documents")
    .select("id, file_name")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching documents:", error);
    return [];
  }

  return data.map((d) => ({
    id: d.id,
    fileName: d.file_name,
  }));
}