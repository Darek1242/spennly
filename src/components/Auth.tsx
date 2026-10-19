import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { LegalDocs } from "./LegalDocs";
export function Auth({ initialMode = false }: { initialMode?: boolean }) {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(initialMode);
  const [isResetMode, setIsResetMode] = useState(false);
  const [accepted, setAccepted] = useState(false); // Stan zgody
  const navigate = useNavigate();
  const [showLegal, setShowLegal] = useState<null | "regulamin" | "polityka">(
    null,
  );

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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`, // Musisz mieć taką stronę w apce
    });
    if (error) alert(error.message);
    else alert("Sprawdź e-mail, aby zresetować hasło!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={isResetMode ? handleResetPassword : handleAuth}
        className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 w-full max-w-sm"
      >
        {isResetMode ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Reset hasła</h2>
            <input
              className="w-full border p-3 rounded-xl mb-4"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold mb-4"
            >
              Wyślij link
            </button>
            <p
              className="text-center text-sm cursor-pointer text-gray-500"
              onClick={() => setIsResetMode(false)}
            >
              Wróć do logowania
            </p>
          </>
        ) : (
          <>
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
              <div className="text-sm text-gray-600 mb-6">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="mr-2"
                />
                Akceptuję
                <button
                  type="button"
                  onClick={() => setShowLegal("regulamin")}
                  className="text-blue-600 underline px-1"
                >
                  regulamin
                </button>
                oraz
                <button
                  type="button"
                  onClick={() => setShowLegal("polityka")}
                  className="text-blue-600 underline px-1"
                >
                  politykę prywatności
                </button>
                .
              </div>
            )}
            {showLegal && (
              <LegalDocs type={showLegal} onClose={() => setShowLegal(null)} />
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
            {!isSignUp && (
              <p
                className="text-center text-sm cursor-pointer text-blue-500 mt-2"
                onClick={() => setIsResetMode(true)}
              >
                Zapomniałeś hasła?
              </p>
            )}
          </>
        )}
      </form>
    </div>
  );
}
