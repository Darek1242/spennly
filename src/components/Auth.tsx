import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export function Auth({ initialMode = false }: { initialMode?: boolean }) {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(initialMode);
  const [accepted, setAccepted] = useState(false); // Stan zgody
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      if (email !== confirmEmail) {
        alert("Adresy e-mail nie są takie same!");
        return;
      }
      if (password !== confirmPassword) {
        alert("Hasła nie są takie same!");
        return;
      }
      if (!accepted) {
        alert("Musisz zaakceptować regulamin!");
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) alert(error.message);
      else alert("Sprawdź e-mail, aby potwierdzić konto!");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) alert(error.message);
      else navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleAuth}
        className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isSignUp ? "Zarejestruj się w Spennly" : "Witaj w Spennly"}
        </h2>
        <input
          className="w-full border p-3 rounded-xl mb-4 bg-gray-50 outline-none"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {isSignUp && (
          <input
            className="w-full border p-3 rounded-xl mb-4 bg-gray-50 outline-none"
            placeholder="Powtórz Email"
            type="email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
          />
        )}
        <input
          className="w-full border p-3 rounded-xl mb-6 bg-gray-50 outline-none"
          placeholder="Hasło"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isSignUp && (
          <input
            className="w-full border p-3 rounded-xl mb-6 bg-gray-50 outline-none"
            placeholder="Powtórz hasło"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}

        {/* Checkbox regulaminu - tylko przy rejestracji */}
        {isSignUp && (
          <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="w-4 h-4"
            />
            <span>
              Akceptuję{" "}
              <a href="/regulamin" className="text-blue-600 underline">
                regulamin
              </a>{" "}
              i politykę prywatności.
            </span>
          </div>
        )}

        <button className="w-full bg-green-600 text-white p-3 rounded-xl font-bold mb-4 hover:bg-green-700 transition">
          {isSignUp ? "Zarejestruj się" : "Zaloguj się"}
        </button>
        <p
          className="text-center text-sm cursor-pointer text-gray-500"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp
            ? "Masz już konto? Zaloguj się"
            : "Nie masz konta? Zarejestruj się"}
        </p>
      </form>
    </div>
  );
}
