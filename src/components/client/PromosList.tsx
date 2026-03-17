import { useEffect, useState } from "react";
import { PromosApi } from "../../api/promosApi";

export default function PromosList() {
  const [promos, setPromos] = useState<any[]>([]);

  useEffect(() => {
    PromosApi.getAll().then(({ data }) =>
      setPromos((data || []).filter(p => p.active))
    );
  }, []);

  return (
    <div>
      <h2 className="text-2xl mb-4 font-bold text-pink-600">Promotions</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {promos.map(p => (
          <div key={p.id} className="border p-4 bg-pink-50 rounded shadow">
            <b>{p.title}</b>
            <p>-{p.discount}%</p>
            <p className="text-sm">Jusqu'à {p.valid_until}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
