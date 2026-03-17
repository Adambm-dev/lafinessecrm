import { supabase } from "../lib/supabase";

export const ServicesApi = {
  getAll() {
    return supabase.from("services").select("*").order("name");
  },
  create(data: any) {
    return supabase.from("services").insert(data);
  },
  update(id: string, data: any) {
    return supabase.from("services").update(data).eq("id", id);
  },
  delete(id: string) {
    return supabase.from("services").delete().eq("id", id);
  }
};
