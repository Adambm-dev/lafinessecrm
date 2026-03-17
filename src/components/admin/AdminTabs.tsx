import { useState } from "react";

import ServicesAdmin from "./ServicesAdmin";
import PromosAdmin from "./PromosAdmin";
import StockAdmin from "./StockAdmin";
import AppointmentsAdmin from "./AppointmentsAdmin";
import Planning from "./Planning";

import DashboardCards from "../../dashboard/DashboardCards";
import ChartAppointments from "../../dashboard/ChartAppointments";

export default function AdminTabs() {
  const [tab, setTab] = useState("dashboard");

  const tabs = [
    { key: "dashboard", label: "Dashboard" },
    { key: "appointments", label: "Rendez-vous" },
    { key: "services", label: "Services" },
    { key: "promos", label: "Promotions" },
    { key: "stock", label: "Stock" },
    { key: "planning", label: "Planning" }
  ];

  return (
    <div className="p-6">
      {/* TOP TABS */}
      <div className="flex flex-wrap gap-3 mb-6">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded font-semibold transition ${
              tab === t.key
                ? "bg-pink-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      {tab === "dashboard" && (
        <div>
          <DashboardCards />
          <ChartAppointments />
        </div>
      )}

      {tab === "appointments" && <AppointmentsAdmin />}
      {tab === "services" && <ServicesAdmin />}
      {tab === "promos" && <PromosAdmin />}
      {tab === "stock" && <StockAdmin />}
      {tab === "planning" && <Planning />}
    </div>
  );
}
