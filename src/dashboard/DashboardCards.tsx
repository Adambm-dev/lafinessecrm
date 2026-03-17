import { useEffect, useState } from "react";
import { AppointmentsApi } from "../api/appointmentsApi";
import { ServicesApi } from "../api/servicesApi";
import { StockApi } from "../api/stockApi";

export default function DashboardCards() {
  const [stats, setStats] = useState({
    appointmentsToday: 0,
    lowStock: 0,
    servicesTotal: 0,
  });

  const load = async () => {
    const today = new Date().toISOString().split("T")[0];

    const [{ data: apps }, { data: services }, { data: stock }] = await Promise.all([
      AppointmentsApi.getAll(),
      ServicesApi.getAll(),
      StockApi.getAll(),
    ]);

    setStats({
      appointmentsToday: apps?.filter(a => a.date === today).length || 0,
      lowStock: stock?.filter(s => s.quantity <= s.min_quantity).length || 0,
      servicesTotal: services?.length || 0,
    });
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
      <div className="p-6 bg-white rounded shadow">
        <h3 className="text-gray-500">RDV Aujourd’hui</h3>
        <p className="text-3xl font-bold">{stats.appointmentsToday}</p>
      </div>

      <div className="p-6 bg-white rounded shadow">
        <h3 className="text-gray-500">Stock Faible</h3>
        <p className="text-3xl font-bold">{stats.lowStock}</p>
      </div>

      <div className="p-6 bg-white rounded shadow">
        <h3 className="text-gray-500">Total Services</h3>
        <p className="text-3xl font-bold">{stats.servicesTotal}</p>
      </div>
    </div>
  );
}
