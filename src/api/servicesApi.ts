import { supabase } from "../lib/supabase";

export const ServicesApi = {
  async getAll() {
    return supabase.from("services").select("*").order("name");
  },

  async create(data: any) {
    return supabase.from("services").insert(data);
  },

  async update(id: string, data: any) {
    return supabase.from("services").update(data).eq("id", id);
  },

  async delete(id: string) {
    return supabase.from("services").delete().eq("id", id);
  }
};
