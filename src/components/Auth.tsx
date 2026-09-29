import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
    else navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Witaj w PinemMF</h2>
        {error && (
          <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded-lg">
            {error}
          </p>
        )}
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded-xl mb-3 bg-gray-50 outline-none"
        />
        <input
          type="password"
          placeholder="Hasło"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded-xl mb-4 bg-gray-50 outline-none"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-green-600 text-white p-3 rounded-xl font-bold mb-2 hover:bg-green-700 transition"
        >
          Zaloguj się
        </button>
        <button
          onClick={() => navigate("/register")}
          className="w-full bg-gray-200 text-gray-700 p-3 rounded-xl font-bold hover:bg-gray-300 transition"
        >
          Zarejestruj się
        </button>
      </div>
    </div>
  );
}
