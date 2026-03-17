import { useEffect, useState } from "react";
import { AppointmentsApi } from "../api/appointmentsApi";

export default function ChartAppointments() {
  const [data, setData] = useState([]);

  useEffect(() => {
    AppointmentsApi.getAll().then(({ data }) => {
      if (!data) return;

      const grouped = data.reduce((acc: any, app: any) => {
        acc[app.date] = (acc[app.date] || 0) + 1;
        return acc;
      }, {});

      setData(Object.entries(grouped));
    });
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow mt-6">
      <h3 className="text-lg font-bold mb-4">Statistiques RDV</h3>

      {data.map(([date, count]) => (
        <div key={date} className="flex justify-between border-b py-2">
          <span>{date}</span>
          <span className="font-bold">{count} RDV</span>
        </div>
      ))}
    </div>
  );
}
``
