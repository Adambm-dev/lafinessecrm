import { useEffect, useState } from "react";
import { AppointmentsApi } from "../../api/appointmentsApi";

export default function Planning() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    AppointmentsApi.getAll().then(({ data }) => {
      setApps(data || []);
    });
  }, []);

  const grouped = apps.reduce((acc: any, app: any) => {
    acc[app.date] = acc[app.date] || [];
    acc[app.date].push(app);
    return acc;
  }, {});

  return (
    <div className="bg-white p-6 rounded shadow mt-6">
      <h2 className="text-xl font-bold mb-4">Planning</h2>

      {Object.keys(grouped).map(date => (
        <div key={date} className="mb-6">
          <h3 className="font-bold text-pink-600 mb-2">{date}</h3>

          <div className="space-y-2">
            {grouped[date].map((app: any) => (
              <div key={app.id} className="border p-3 rounded bg-gray-50">
                <b>{app.time}</b> → {app.client_name}  
                <p className="text-sm text-gray-500">{app.service_id}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
``
