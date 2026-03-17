import { useEffect, useState } from "react";
import { StockApi } from "../../api/stockApi";

export default function StockAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ name: "", quantity: "", min_quantity: "", category: "" });

  const load = async () => {
    const { data } = await StockApi.getAll();
    setItems(data || []);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    await StockApi.create(form);
    setForm({ name: "", quantity: "", min_quantity: "", category: "" });
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Gestion du Stock</h2>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {["name", "quantity", "min_quantity", "category"].map(k => (
          <input className="border p-2" key={k} placeholder={k}
            value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })}
          />
        ))}
      </div>

      <button onClick={save} className="px-4 py-2 bg-green-600 text-white rounded">Ajouter</button>

      <ul className="mt-6">
        {items.map(i => (
          <li key={i.id} className={`border p-3 mb-2 flex justify-between ${i.quantity <= i.min_quantity ? "bg-red-100" : ""}`}>
            <span>
              {i.name} — {i.quantity} unités (Min {i.min_quantity})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
``
