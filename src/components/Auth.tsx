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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showLegal, setShowLegal] = useState<null | "regulamin" | "polityka">(
    null,
  );

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (isSignUp) {
      if (email !== confirmEmail) {
        alert("Adresy e-mail nie są takie same!");
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        alert("Hasła nie są takie same!");
        setLoading(false);
        return;
      }
      if (!accepted) {
        alert("Musisz zaakceptować regulamin!");
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) setErrorMsg(error.message);
      else alert("Sprawdź e-mail, aby potwierdzić konto!");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === "Invalid login credentials") {
          setErrorMsg("Nieprawidłowy e-mail lub hasło.");
        } else if (error.message.includes("User not found")) {
          setErrorMsg("Konto o tym adresie e-mail nie istnieje.");
        } else {
          setErrorMsg(error.message);
        }
      } else {
        navigate("/");
      }
    }
    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`, // Musisz mieć taką stronę w apce
    });
    if (error) setErrorMsg(error.message);
    else alert("Sprawdź e-mail, aby zresetować hasło!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      {errorMsg && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[200]">
          <div className="bg-white p-8 rounded-3xl w-full max-w-sm text-center shadow-2xl">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="font-bold text-xl mb-2 text-gray-800">Ups!</h2>
            <p className="text-gray-600 mb-8 text-sm">{errorMsg}</p>
            <button
              onClick={() => setErrorMsg(null)}
              className="w-full bg-gray-800 text-white p-4 rounded-2xl font-bold hover:bg-black transition"
            >
              Rozumiem
            </button>
          </div>
        </div>
      )}
      <form
        onSubmit={isResetMode ? handleResetPassword : handleAuth}
        className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-sm border border-gray-100 transition-all transform hover:scale-[1.01]"
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
            <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
              {isSignUp ? "Dołącz do Spennly" : "Witaj ponownie"}
            </h2>
            <input
              className="w-full border-2 border-gray-100 p-4 rounded-2xl mb-4 bg-gray-50 focus:border-blue-500 outline-none transition"
              placeholder="Adres e-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {isSignUp && (
              <input
                className="w-full border-2 border-gray-100 p-4 rounded-2xl mb-4 bg-gray-50 focus:border-blue-500 outline-none transition"
                placeholder="Powtórz adres e-mail"
                type="email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
              />
            )}
            <input
              className="w-full border-2 border-gray-100 p-4 rounded-2xl mb-4 bg-gray-50 focus:border-blue-500 outline-none transition"
              placeholder="Hasło"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {isSignUp && (
              <input
                className="w-full border-2 border-gray-100 p-4 rounded-2xl mb-6 bg-gray-50 focus:border-blue-500 outline-none transition"
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

            <button className="w-full bg-green-600 text-white p-4 rounded-2xl font-bold text-lg hover:bg-green-700 transition shadow-lg shadow-green-200 mb-4">
              {loading
                ? "Ładowanie..."
                : isSignUp
                  ? "Zarejestruj się"
                  : "Zaloguj się"}
            </button>
            <p
              className="text-center text-sm text-gray-400 mt-6 cursor-pointer hover:text-gray-600"
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
