import { useState } from "react";
import { AppointmentsApi } from "../../api/appointmentsApi";

export default function AppointmentForm() {
  const [form, setForm] = useState({
    client_name: "",
    client_phone: "",
    client_email: "",
    date: "",
    time: ""
  });

  const submit = async (e: any) => {
    e.preventDefault();
    await AppointmentsApi.create(form);
    alert("Votre demande a été envoyée !");
    setForm({
      client_name: "",
      client_phone: "",
      client_email: "",
      date: "",
      time: ""
    });
  };

  return (
    <form onSubmit={submit} className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold text-pink-600 mb-4">
        Prendre un rendez-vous
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <input
          className="border p-2 rounded"
          placeholder="Nom complet"
          value={form.client_name}
          onChange={e => setForm({ ...form, client_name: e.target.value })}
          required
        />

        <input
          className="border p-2 rounded"
          placeholder="Téléphone"
          value={form.client_phone}
          onChange={e => setForm({ ...form, client_phone: e.target.value })}
          required
        />

        <input
          className="border p-2 rounded md:col-span-2"
          placeholder="Email"
          value={form.client_email}
          onChange={e => setForm({ ...form, client_email: e.target.value })}
        />

        <input
          type="date"
          className="border p-2 rounded"
          value={form.date}
          onChange={e => setForm({ ...form, date: e.target.value })}
          required
        />

        <input
          type="time"
          className="border p-2 rounded"
          value={form.time}
          onChange={e => setForm({ ...form, time: e.target.value })}
          required
        />
      </div>

      <button className="mt-4 px-6 py-2 bg-pink-600 text-white rounded">
        Envoyer
      </button>
    </form>
  );
}
