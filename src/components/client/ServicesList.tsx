import { useEffect, useState } from "react";
import { ServicesApi } from "../../api/servicesApi";

export default function ServicesList() {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    ServicesApi.getAll().then(({ data }) => setServices(data || []));
  }, []);

  return (
    <div>
      <h2 className="text-2xl mb-4 font-bold text-pink-600">Nos Services</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map(s => (
          <div key={s.id} className="border p-4 bg-white rounded shadow">
            <b>{s.name}</b>
            <p>{s.duration} min</p>
            <p className="text-pink-600">{s.price}€</p>
          </div>
        ))}
      </div>
    </div>
  );
}
