import { useEffect, useState } from "react";
import { PromosApi } from "../../api/promosApi";

export default function PromosAdmin() {
  const [promos, setPromos] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    discount: "",
    valid_until: "",
    active: true,
  });

  const load = async () => {
    const { data } = await PromosApi.getAll();
    setPromos(data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    await PromosApi.create(form);
    setForm({
      title: "",
      description: "",
      discount: "",
      valid_until: "",
      active: true
    });
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Gestion des Promotions</h2>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <input
          className="border p-2 rounded"
          placeholder="Titre"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Réduction (%)"
          value={form.discount}
          onChange={(e) => setForm({ ...form, discount: e.target.value })}
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={form.valid_until}
          onChange={(e) => setForm({ ...form, valid_until: e.target.value })}
        />
        <input
          className="border p-2 rounded col-span-2"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>
      <button
        onClick={save}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Ajouter
      </button>
      <ul className="mt-6">
        {promos.map((p) => (
          <li key={p.id} className="border p-3 mb-2 rounded bg-white shadow">
            <b>{p.title}</b> — -{p.discount}% (Jusqu’au {p.valid_until})
          </li>
        ))}
      </ul>
    </div>
  );
}
