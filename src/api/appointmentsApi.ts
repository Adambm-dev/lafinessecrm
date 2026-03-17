import { supabase } from "../lib/supabase";

export const AppointmentsApi = {
  getAll: () => supabase.from("appointments").select("*").order("date"),
  create: (data: any) => supabase.from("appointments").insert(data),
  update: (id: string, data: any) => supabase.from("appointments").update(data).eq("id", id),
  delete: (id: string) => supabase.from("appointments").delete().eq("id", id),
};
