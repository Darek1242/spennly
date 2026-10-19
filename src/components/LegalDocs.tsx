import React from "react";

export function LegalDocs({
  type,
  onClose,
}: {
  type: "regulamin" | "polityka";
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 sm:p-8 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {type === "regulamin"
              ? "Regulamin serwisu Spennly"
              : "Polityka Prywatności"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1"
            aria-label="Zamknij"
          >
            ✕
          </button>
        </div>

        <div className="text-gray-700 space-y-4 text-sm leading-relaxed">
          {type === "regulamin" ? (
            <div className="prose text-gray-800 text-sm max-w-none">
              <p className="italic text-gray-500 mb-4">
                Wersja: 1.0 | Data wejścia w życie: 28.09.2026
              </p>

              <h3 className="font-bold text-base mt-6 mb-2">
                1. Postanowienia ogólne
              </h3>
              <p className="mb-2">
                Niniejszy Regulamin określa zasady korzystania z aplikacji
                internetowej Spennly (dalej: „Serwis”), dostępnej pod adresem{" "}
                <a
                  href="https://spennly.pl"
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://spennly.pl
                </a>
                .
              </p>
              <p className="mb-2">
                Właścicielem i operatorem Serwisu jest Dariusz Milczanowski
                (dalej: „Operator”).
              </p>
              <p className="mb-2">
                Kontakt:{" "}
                <a
                  href="mailto:app.spennly@gmail.com"
                  className="text-blue-600 underline"
                >
                  app.spennly@gmail.com
                </a>
              </p>

              <h3 className="font-bold text-base mt-6 mb-2">2. Definicje</h3>
              <ul className="list-disc pl-5 space-y-1 mb-2">
                <li>
                  <strong>Aplikacja</strong> – serwis internetowy Spennly
                  służący do zarządzania finansami osobistymi.
                </li>
                <li>
                  <strong>Użytkownik</strong> – osoba fizyczna korzystająca z
                  Aplikacji.
                </li>
                <li>
                  <strong>Konto</strong> – indywidualne konto Użytkownika w
                  Aplikacji.
                </li>
                <li>
                  <strong>Portfel</strong> – wirtualna przestrzeń do grupowania
                  wydatków.
                </li>
                <li>
                  <strong>Premium</strong> – płatna wersja Aplikacji
                  odblokowująca dodatkowe funkcje, w tym wiele portfeli.
                </li>
              </ul>

              <h3 className="font-bold text-base mt-6 mb-2">
                3. Rodzaje usług
              </h3>
              <p className="mb-2">Serwis oferuje:</p>
              <ul className="list-disc pl-5 space-y-1 mb-2">
                <li>
                  <strong>Wersję bezpłatną</strong> – 1 portfel, podstawowe
                  raporty.
                </li>
                <li>
                  <strong>Wersję Premium</strong> – nielimitowane portfele,
                  zaawansowane raporty, eksport danych.
                </li>
              </ul>

              <h3 className="font-bold text-base mt-6 mb-2">
                4. Rejestracja i konto
              </h3>
              <ol className="list-decimal pl-5 space-y-1 mb-2">
                <li>
                  Aby korzystać z Aplikacji, Użytkownik musi założyć Konto,
                  podając adres e-mail i ustawiając hasło.
                </li>
                <li>
                  Użytkownik jest odpowiedzialny za zachowanie poufności hasła.
                </li>
                <li>
                  Użytkownik może usunąć Konto w dowolnym momencie poprzez
                  ustawienia konta lub kontakt z Operatorem.
                </li>
              </ol>

              <h3 className="font-bold text-base mt-6 mb-2">
                5. Płatności i subskrypcje
              </h3>
              <ol className="list-decimal pl-5 space-y-1 mb-2">
                <li>
                  Płatności za wersję Premium obsługiwane są przez Stripe ({" "}
                  <a
                    href="https://stripe.com"
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    https://stripe.com
                  </a>
                  ).
                </li>
                <li>
                  Ceny Premium są podane na stronie cennika i wyrażone w PLN.
                </li>
                <li>
                  Subskrypcja Premium odnawia się automatycznie co miesiąc/rok,
                  chyba że Użytkownik anuluje subskrypcję przed datą odnowienia.
                </li>
                <li>
                  Użytkownik może anulować subskrypcję w dowolnym momencie
                  poprzez panel Stripe lub kontakt z Operatorem.
                </li>
              </ol>

              <h3 className="font-bold text-base mt-6 mb-2">
                6. Prawo odstąpienia od umowy
              </h3>
              <ol className="list-decimal pl-5 space-y-1 mb-2">
                <li>
                  Użytkownik będący konsumentem ma prawo odstąpić od umowy w
                  ciągu 14 dni od jej zawarcia, bez podania przyczyny.
                </li>
                <li>
                  <strong>Wyjątek:</strong> Prawo odstąpienia nie przysługuje w
                  odniesieniu do treści cyfrowych dostarczanych natychmiast po
                  zakupie, jeśli Użytkownik wyraził uprzednią zgodę na
                  rozpoczęcie świadczenia i przyjął do wiadomości utratę prawa
                  odstąpienia (art. 38 ust. 1 pkt 13 ustawy o prawach
                  konsumenta).
                </li>
                <li>
                  Aby skorzystać z wyjątku, Użytkownik musi zaznaczyć odpowiedni
                  checkbox podczas zakupu Premium.
                </li>
                <li>
                  Potwierdzenie zawarcia umowy wraz z informacją o utracie prawa
                  odstąpienia zostanie przesłane na adres e-mail Użytkownika.
                </li>
              </ol>

              <h3 className="font-bold text-base mt-6 mb-2">
                7. Odpowiedzialność
              </h3>
              <ol className="list-decimal pl-5 space-y-1 mb-2">
                <li>
                  Operator dokłada starań, aby Aplikacja działała poprawnie, ale
                  nie gwarantuje nieprzerwanej dostępności.
                </li>
                <li>
                  Operator nie odpowiada za utratę danych wynikłą z winy
                  Użytkownika (np. udostępnienie hasła).
                </li>
                <li>
                  Operator nie odpowiada za skutki finansowe decyzji
                  podejmowanych przez Użytkownika na podstawie danych z
                  Aplikacji.
                </li>
              </ol>

              <h3 className="font-bold text-base mt-6 mb-2">
                8. Zmiany Regulaminu
              </h3>
              <ol className="list-decimal pl-5 space-y-1 mb-2">
                <li>
                  Operator może zmienić Regulamin, informując Użytkowników
                  e-mailem z 14-dniowym wyprzedzeniem.
                </li>
                <li>
                  Dalsze korzystanie z Aplikacji po wejściu w życie zmian
                  oznacza akceptację nowego Regulaminu.
                </li>
              </ol>

              <h3 className="font-bold text-base mt-6 mb-2">
                9. Prawo właściwe
              </h3>
              <p className="mb-2">
                Niniejszy Regulamin podlega prawu polskiemu. W sprawach
                nieuregulowanych zastosowanie mają przepisy Kodeksu cywilnego i
                ustawy o prawach konsumenta.
              </p>

              <h3 className="font-bold text-base mt-6 mb-2">10. Kontakt</h3>
              <p className="mb-2">
                W sprawach dotyczących Regulaminu:{" "}
                <a
                  href="mailto:app.spennly@gmail.com"
                  className="text-blue-600 underline"
                >
                  app.spennly@gmail.com
                </a>
              </p>

              <h3 className="font-bold text-base mt-6 mb-2">
                11. Polityka prywatności
              </h3>
              <p className="mb-2">
                Pełna informacja o przetwarzaniu danych osobowych znajduje się w
                Polityce prywatności:{" "}
                <a
                  href="https://spennly.pl/polityka-prywatnosci"
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://spennly.pl/polityka-prywatnosci
                </a>
              </p>

              <h3 className="font-bold text-base mt-6 mb-2">
                12. Informacja o Stripe
              </h3>
              <p className="mb-2">
                Płatności w Serwisie obsługiwane są przez Stripe. Zasady
                przetwarzania danych przez Stripe opisuje jego Polityka
                prywatności:{" "}
                <a
                  href="https://stripe.com/privacy"
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://stripe.com/privacy
                </a>
                .
              </p>
            </div>
          ) : (
            <div className="prose text-gray-800 text-sm max-w-none">
              <p className="italic text-gray-500 mb-4">
                Wersja: 1.0 | Data wejścia w życie: 28.09.2026
              </p>

              <h3 className="font-bold text-base mt-6 mb-2">
                1. Administrator danych
              </h3>
              <p className="mb-2">
                Administratorem danych osobowych jest Dariusz Milczanowski
                (dalej: „Administrator”).
              </p>
              <p className="mb-2">
                Kontakt:{" "}
                <a
                  href="mailto:app.spennly@gmail.com"
                  className="text-blue-600 underline"
                >
                  app.spennly@gmail.com
                </a>
              </p>

              <h3 className="font-bold text-base mt-6 mb-2">
                2. Cele i podstawy prawne przetwarzania
              </h3>
              <div className="overflow-x-auto my-4">
                <table className="w-full border-collapse border border-gray-200 text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-200 p-2 font-semibold">
                        Cel
                      </th>
                      <th className="border border-gray-200 p-2 font-semibold">
                        Podstawa prawna
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 p-2">
                        Świadczenie usługi (rejestracja, przechowywanie
                        wydatków)
                      </td>
                      <td className="border border-gray-200 p-2">
                        Umowa – art. 6(1)(b) RODO
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 p-2">
                        Rozliczenia i obsługa subskrypcji
                      </td>
                      <td className="border border-gray-200 p-2">
                        Umowa + obowiązek prawny – art. 6(1)(b), (c) RODO
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 p-2">
                        Komunikacja e-mail (potwierdzenia, powiadomienia)
                      </td>
                      <td className="border border-gray-200 p-2">
                        Umowa – art. 6(1)(b) RODO
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 p-2">
                        Bezpieczeństwo i zapobieganie nadużyciom
                      </td>
                      <td className="border border-gray-200 p-2">
                        Uzasadniony interes – art. 6(1)(f) RODO
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 p-2">
                        Marketing (jeśli dotyczy)
                      </td>
                      <td className="border border-gray-200 p-2">
                        Zgoda – art. 6(1)(a) RODO
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="font-bold text-base mt-6 mb-2">
                3. Kategorie danych
              </h3>
              <ul className="list-disc pl-5 space-y-1 mb-2">
                <li>Adres e-mail</li>
                <li>Hasło (w formie zaszyfrowanej)</li>
                <li>Dane wydatków (kwoty, kategorie, daty, portfele)</li>
                <li>Adres IP i logi serwerowe</li>
                <li>Identyfikatory urządzeń (jeśli dotyczy)</li>
              </ul>

              <h3 className="font-bold text-base mt-6 mb-2">
                4. Odbiorcy danych
              </h3>
              <p className="mb-2">Dane mogą być przekazywane do:</p>
              <ul className="list-disc pl-5 space-y-1 mb-2">
                <li>
                  <strong>Stripe</strong> – obsługa płatności i subskrypcji ({" "}
                  <a
                    href="https://stripe.com/privacy"
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    https://stripe.com/privacy
                  </a>
                  )
                </li>
                <li>
                  <strong>Supabase</strong> – hosting bazy danych ({" "}
                  <a
                    href="https://supabase.com/privacy"
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    https://supabase.com/privacy
                  </a>
                  )
                </li>
                <li>
                  <strong>Resend</strong> – wysyłka e-maili transakcyjnych ({" "}
                  <a
                    href="https://resend.com/privacy"
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    https://resend.com/privacy
                  </a>
                  )
                </li>
                <li>
                  <strong>Hosting (np. Vercel / Netlify)</strong> – utrzymanie
                  infrastruktury
                </li>
              </ul>

              <h3 className="font-bold text-base mt-6 mb-2">
                5. Transfer danych poza EOG
              </h3>
              <p className="mb-2">
                Niektóre z powyższych podmiotów (np. Stripe, Supabase, Resend)
                mogą przetwarzać dane poza Europejskim Obszarem Gospodarczym.
                Transfer odbywa się na podstawie odpowiednich zabezpieczeń (np.
                Data Privacy Framework, standardowe klauzule umowne).
              </p>

              <h3 className="font-bold text-base mt-6 mb-2">
                6. Okres przechowywania
              </h3>
              <ul className="list-disc pl-5 space-y-1 mb-2">
                <li>
                  <strong>Dane konta:</strong> do momentu usunięcia konta przez
                  Użytkownika.
                </li>
                <li>
                  <strong>Dane rozliczeniowe:</strong> 5 lat od zakończenia roku
                  podatkowego (wymóg podatkowy).
                </li>
                <li>
                  <strong>Logi serwerowe:</strong> 30 dni.
                </li>
                <li>
                  <strong>Dane marketingowe:</strong> do momentu wycofania
                  zgody.
                </li>
              </ul>

              <h3 className="font-bold text-base mt-6 mb-2">
                7. Prawa użytkownika
              </h3>
              <p className="mb-2">Masz prawo do:</p>
              <ul className="list-disc pl-5 space-y-1 mb-2">
                <li>Dostępu do danych (art. 15 RODO)</li>
                <li>Sprostowania (art. 16 RODO)</li>
                <li>Usunięcia („prawo do bycia zapomnianym”, art. 17 RODO)</li>
                <li>Ograniczenia przetwarzania (art. 18 RODO)</li>
                <li>Przenoszenia danych (art. 20 RODO)</li>
                <li>Sprzeciwu (art. 21 RODO)</li>
                <li>
                  Cofnięcia zgody w dowolnym momencie (jeśli przetwarzanie
                  opiera się na zgodzie)
                </li>
              </ul>

              <h3 className="font-bold text-base mt-6 mb-2">8. Prawo skargi</h3>
              <p className="mb-2">
                Masz prawo wnieść skargę do Prezesa Urzędu Ochrony Danych
                Osobowych (UODO), jeśli uważasz, że przetwarzanie danych narusza
                RODO.
              </p>

              <h3 className="font-bold text-base mt-6 mb-2">9. Cookies</h3>
              <p className="mb-2">Serwis może używać plików cookies w celu:</p>
              <ul className="list-disc pl-5 space-y-1 mb-2">
                <li>Utrzymania sesji i logowania (niezbędne).</li>
                <li>Analityki (jeśli dotyczy).</li>
                <li>Personalizacji (jeśli dotyczy).</li>
              </ul>
              <p className="mb-2">
                Szczegóły znajdują się w Polityce cookies:{" "}
                <a
                  href="https://spennly.pl/polityka-cookies"
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://spennly.pl/polityka-cookies
                </a>
              </p>

              <h3 className="font-bold text-base mt-6 mb-2">
                10. Zautomatyzowane podejmowanie decyzji
              </h3>
              <p className="mb-2">
                Serwis nie stosuje zautomatyzowanego podejmowania decyzji ani
                profilowania w rozumieniu art. 22 RODO.
              </p>

              <h3 className="font-bold text-base mt-6 mb-2">11. Kontakt</h3>
              <p className="mb-2">
                W sprawach danych osobowych:{" "}
                <a
                  href="mailto:app.spennly@gmail.com"
                  className="text-blue-600 underline"
                >
                  app.spennly@gmail.com
                </a>
              </p>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full p-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-900 transition"
        >
          Zamknij
        </button>
      </div>
    </div>
  );
}
