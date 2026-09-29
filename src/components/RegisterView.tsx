import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export function RegisterView() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (email !== confirmEmail) {
      setError("E-maile nie są identyczne!");
      return;
    }
    if (!accepted) {
      setError("Musisz zaakceptować regulamin!");
      return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      return;
    }
    if (data.user) {
      await supabase
        .from("profiles")
        .update({ full_name: fullName })
        .eq("id", data.user.id);
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6">
          {step === 1 ? "Stwórz konto" : "Twój profil"}
        </h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {step === 1 ? (
          <>
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-3 rounded-xl mb-3 bg-gray-50"
            />
            <input
              type="email"
              placeholder="Powtórz email"
              onChange={(e) => setConfirmEmail(e.target.value)}
              className="w-full border p-3 rounded-xl mb-3 bg-gray-50"
            />
            <input
              type="password"
              placeholder="Hasło (min. 6 znaków)"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-3 rounded-xl mb-6 bg-gray-50"
            />
            <div className="flex items-center gap-2 mb-6">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                id="terms"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                Akceptuję{" "}
                <a
                  href="/regulamin"
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  regulamin
                </a>
              </label>
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold"
            >
              Dalej
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Imię i nazwisko"
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border p-3 rounded-xl mb-6 bg-gray-50"
            />
            <button
              onClick={handleRegister}
              className="w-full bg-green-600 text-white p-3 rounded-xl font-bold"
            >
              Zakończ rejestrację
            </button>
            <button
              onClick={() => setStep(1)}
              className="w-full mt-3 text-gray-500 text-sm"
            >
              Wróć
            </button>
          </>
        )}
      </div>
    </div>
  );
}
