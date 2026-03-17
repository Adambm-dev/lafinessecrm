import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: any) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setError(error.message);

    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <form onSubmit={handleLogin} className="bg-white p-8 shadow rounded w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6">Connexion Admin</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded mb-4"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full p-3 border rounded mb-6"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button className="w-full bg-pink-600 text-white py-3 rounded">Se connecter</button>
      </form>
    </div>
  );
}
