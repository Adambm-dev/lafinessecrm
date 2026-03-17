import { useEffect, useState } from "react";
import { ServicesApi } from "../../api/servicesApi";

export default function ServicesAdmin() {
  const [services, setServices] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    duration: "",
    category: ""
  });

  const load = async () => {
    const { data } = await ServicesApi.getAll();
    setServices(data || []);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.name) return;
    await ServicesApi.create(form);
    setForm({ name: "", price: "", duration: "", category: "" });
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Gestion des Services</h2>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {["name","price","duration","category"].map(k => (
          <input
            key={k}
            className="border p-2"
            placeholder={k}
            value={form[k]}
            onChange={e => setForm({ ...form, [k]: e.target.value })}
          />
        ))}
      </div>

      <button onClick={save} className="px-4 py-2 bg-green-600 text-white rounded">
        Ajouter
      </button>

      <ul className="mt-6">
        {services.map(s => (
          <li key={s.id} className="border p-3 mb-2 rounded">
            {s.name} — {s.price}€ — {s.duration}min ({s.category})
          </li>
        ))}
      </ul>
    </div>
  );
}
