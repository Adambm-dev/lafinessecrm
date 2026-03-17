import { useState } from "react";
import ServicesAdmin from "./ServicesAdmin";
import PromosAdmin from "./PromosAdmin";
import StockAdmin from "./StockAdmin";
import AppointmentsAdmin from "./AppointmentsAdmin";

export default function AdminTabs() {
  const [tab, setTab] = useState("appointments");

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-6">
        {["appointments", "services", "promos", "stock"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded ${tab === t ? "bg-pink-600 text-white" : "bg-gray-200"}`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {tab === "appointments" && <AppointmentsAdmin />}
      {tab === "services" && <ServicesAdmin />}
      {tab === "promos" && <PromosAdmin />}
      {tab === "stock" && <StockAdmin />}
    </div>
  );
}
