import { supabase } from "../lib/supabase";

export const StockApi = {
  getAll: () => supabase.from("stock").select("*").order("name"),
  create: (d: any) => supabase.from("stock").insert(d),
  update: (id: string, d: any) => supabase.from("stock").update(d).eq("id", id),
  delete: (id: string) => supabase.from("stock").delete().eq("id", id),
};
