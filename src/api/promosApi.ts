import { supabase } from "../lib/supabase";

export const PromosApi = {
  getAll: () => supabase.from("promos").select("*").order("created_at", { ascending: false }),
  create: (data: any) => supabase.from("promos").insert(data),
  update: (id: string, data: any) => supabase.from("promos").update(data).eq("id", id),
  delete: (id: string) => supabase.from("promos").delete().eq("id", id),
};
