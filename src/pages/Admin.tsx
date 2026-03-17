import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import AdminTabs from "../components/admin/AdminTabs";

export default function Admin() {
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return navigate("/login");

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profile?.role !== "admin") return navigate("/");

      setIsAllowed(true);
    });
  }, []);

  if (isAllowed === null) return <p className="p-10 text-center">Chargement...</p>;
  return <AdminTabs />;
}
