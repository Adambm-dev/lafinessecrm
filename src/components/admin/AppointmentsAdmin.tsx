import { useEffect, useState } from "react";
import { AppointmentsApi } from "../../api/appointmentsApi";

export default function AppointmentsAdmin() {
  const [appointments, setAppointments] = useState<any[]>([]);

  const load = async () => {
    const { data } = await AppointmentsApi.getAll();
    setAppointments(data || []);
  };

  const updateStatus = async (id: string, status: string) => {
    await AppointmentsApi.update(id, { status });
    load();
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Rendez-vous</h2>

      <ul className="space-y-4">
        {appointments.map(app => (
          <li key={app.id} className="border p-3">
            <p><b>{app.client_name}</b> ({app.client_phone})</p>
            <p>{app.date} à {app.time}</p>
            <p>Service : {app.service_id}</p>
            <p>Status : {app.status}</p>

            <div className="flex gap-2 mt-2">
              <button onClick={() => updateStatus(app.id, "accepted")} className="px-3 py-1 bg-green-600 text-white rounded">Accepter</button>
              <button onClick={() => updateStatus(app.id, "refused")} className="px-3 py-1 bg-red-600 text-white rounded">Refuser</button>
              <button onClick={() => updateStatus(app.id, "rescheduled")} className="px-3 py-1 bg-blue-600 text-white rounded">Décaler</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
