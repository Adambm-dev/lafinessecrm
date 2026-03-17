import { useEffect, useState } from "react";
import { ServicesApi } from "../../api/servicesApi";

export default function ServicesList() {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    ServicesApi.getAll().then(({ data }) => setServices(data || []));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4 font-bold text-pink-600">Nos Services</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {services.map(s => (
          <div key={s.id} className="border p-3 rounded shadow-sm">
            <b>{s.name}</b>
            <p>{s.duration} min</p>
            <p className="text-pink-600 text-xl">{s.price}€</p>
          </div>
        ))}
      </div>
    </div>
  );
}
