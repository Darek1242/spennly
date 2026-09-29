import { useState, useEffect } from "react";
import { registerLocale } from "react-datepicker";
import { pl } from "date-fns/locale/pl";
import "react-datepicker/dist/react-datepicker.css";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";
import { BudgetSummary } from "./components/BudgetSummary";
import { TransactionForms } from "./components/TransactionForms";
import { TransactionList } from "./components/TransactionList";
import { ReportView } from "./components/ReportView";
import { ChartComponent } from "./components/ChartComponent";
import { IncomeHistory } from "./components/IncomeHistory";
import { CategoryManager } from "./components/CategoryManager";
import { WalletItem } from "./components/WalletItem";
import { MonthPicker } from "./components/MonthPicker";
import { supabase } from "./supabaseClient";
import { Auth } from "./components/Auth";
registerLocale("pl", pl);
import {
  ChevronLeft,
  ChevronRight,
  Wallet as WalletIcon,
  Settings,
  Trash2,
  Edit2,
} from "lucide-react";
export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"dashboard" | "reports">(
    "dashboard",
  );
  const [currentDate, setCurrentDate] = useState(new Date());

  // NOWE STANY DLA PORTFELI
  const [activeWalletId, setActiveWalletId] = useState<number | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [newWalletName, setNewWalletName] = useState("");
  const [editingWallet, setEditingWallet] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [editingIncome, setEditingIncome] = useState<{
    id: number;
    amount: number;
  } | null>(null);
  const [editingExpense, setEditingExpense] = useState<any | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const syncData = async (userId: string) => {
    // 1. Najpierw synchronizujemy PORTFELE
    let { data: wallets } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId);

    // Jeśli brak portfeli, stwórz domyślny
    if (!wallets || wallets.length === 0) {
      const { data: newWallet } = await supabase
        .from("wallets")
        .insert({ name: "Portfel Główny", user_id: userId })
        .select()
        .single();
      if (newWallet) wallets = [newWallet];
    }

    if (wallets) {
      await db.wallets.clear();
      await db.wallets.bulkPut(wallets);
      // Ustaw aktywny portfel jeśli żaden nie jest wybrany
      if (!activeWalletId) setActiveWalletId(wallets[0].id);
    }

    // 2. Pobieramy profil i status Premium
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_premium")
      .match({ id: userId }) // Czasem .match działa stabilniej niż .eq
      .single();
    if (profile) setIsPremium(profile.is_premium);

    // 3. Pobieramy resztę danych (expenses, incomes, categories)
    const { data: expenses } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", userId);
    const { data: incomes } = await supabase
      .from("incomes")
      .select("*")
      .eq("user_id", userId);
    const { data: categories } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", userId);

    if (expenses) {
      await db.expenses.clear();
      const formatted = expenses.map((e) => ({ ...e, date: new Date(e.date) }));
      await db.expenses.bulkPut(formatted);
    }

    if (incomes) {
      await db.incomes.clear();
      const formatted = incomes.map((i) => ({ ...i, date: new Date(i.date) }));
      await db.incomes.bulkPut(formatted);
    }

    if (categories) {
      await db.categories.clear();
      await db.categories.bulkPut(categories);
    }
  };

  useEffect(() => {
    if (session) {
      syncData(session.user.id);
    }
  }, [session]);

  const handleCheckout = async (
    priceId: string,
    isSubscription: boolean = false,
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "create-checkout-session",
        {
          body: {
            userId: session.user.id,
            userEmail: session.user.email,
            returnUrl: window.location.origin,
            priceId: priceId,
            isSubscription: isSubscription, // Przekazujemy to do funkcji Supabase
          },
        },
      );
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (err: any) {
      alert("Błąd: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      // Pobieramy ID klienta ze Stripe przypisane do użytkownika
      const { data: profile } = await supabase
        .from("profiles")
        .select("stripe_customer_id") // Upewnij się, że używasz podkreślnika!
        .eq("id", session.user.id)
        .single();

      if (!profile?.stripe_customer_id) {
        alert("Nie znaleziono subskrypcji dla tego konta.");
        return;
      }

      // Wywołujemy funkcję w Supabase, która wygeneruje link do portalu
      const { data, error } = await supabase.functions.invoke(
        "create-portal-link",
        {
          body: {
            userId: session.user.id,
            stripeCustomerId: profile.stripe_customer_id,
          },
          // Dodaj to, żeby wymusić nagłówki
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url; // Przekierowanie do portalu Stripe
      }
    } catch (err: any) {
      alert("Błąd: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWallet = async () => {
    // Sprawdzenie Premium: darmowy użytkownik może mieć max 1 portfel (tylko ten domyślny)
    if (!isPremium && (allWallets?.length || 0) >= 1) {
      alert(
        "Wersja darmowa pozwala tylko na jeden portfel. Przejdź na Premium!",
      );
      return;
    }

    if (!newWalletName.trim()) return;

    const { data, error } = await supabase
      .from("wallets")
      .insert({ name: newWalletName, user_id: session.user.id })
      .select()
      .single();

    if (!error && data) {
      await db.wallets.add(data);
      setNewWalletName("");
      setActiveWalletId(data.id);
      setIsWalletModalOpen(false);
    }
  };

  const handleRenameWallet = async (id: number, name: string) => {
    const { error } = await supabase
      .from("wallets")
      .update({ name })
      .eq("id", id);
    if (!error) {
      await db.wallets.update(id, { name });
    }
  };

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  // AKTUALIZACJA QUERY DLA DEXIE (filtrowanie po portfelu)
  const allWallets = useLiveQuery(() => db.wallets.toArray());
  const expenses = useLiveQuery(
    () =>
      db.expenses
        .where("wallet_id")
        .equals(activeWalletId || 0)
        .toArray(),
    [activeWalletId],
  );

  const incomes = useLiveQuery(
    () =>
      db.incomes
        .where("wallet_id")
        .equals(activeWalletId || 0)
        .toArray(),
    [activeWalletId],
  );

  const categories = useLiveQuery(
    () =>
      db.categories
        .where("wallet_id")
        .equals(activeWalletId || 0)
        .toArray(),
    [activeWalletId],
  );
  const filteredExpenses =
    expenses?.filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === month && d.getFullYear() === year;
    }) || [];

  const filteredIncomes =
    incomes?.filter((i) => {
      const d = new Date(i.date);
      return d.getMonth() === month && d.getFullYear() === year;
    }) || [];

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = filteredIncomes.reduce((sum, i) => sum + i.amount, 0);
  const balance = totalIncome - totalExpenses;

  if (loading) return <div>Ładowanie...</div>;
  if (!session) return <Auth />;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* GÓRNY PASEK - SELEKTOR PORTFELI */}
      <div className="max-w-6xl mx-auto mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 w-full md:w-auto">
          <div className="bg-blue-600 p-2 rounded-xl text-white">
            <WalletIcon size={20} />
          </div>
          <select
            value={activeWalletId || ""}
            onChange={(e) => setActiveWalletId(Number(e.target.value))}
            className="font-bold text-gray-800 outline-none bg-transparent cursor-pointer pr-4"
          >
            {allWallets?.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
          {!isPremium && (
            <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg font-bold">
              FREE
            </span>
          )}
          {isPremium && (
            <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-1 rounded-lg font-bold">
              PREMIUM
            </span>
          )}
        </div>

        {/* PRZYCISK USTAWIEŃ - TERAZ DLA WSZYSTKICH */}
        <button
          onClick={() => setIsWalletModalOpen(true)}
          className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition"
        >
          <Settings size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Pasek nawigacji - Zakładki + Data + Wyloguj */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-col md:flex-row justify-between items-center bg-white p-2 rounded-2xl shadow-sm border border-gray-100 gap-4">
        {/* Lewa: Zakładki */}
        <div className="flex bg-gray-100 p-1 rounded-2xl w-full md:w-auto justify-center">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-8 py-2 rounded-xl font-bold transition flex-1 md:flex-none ${activeTab === "dashboard" ? "bg-gray-800 text-white shadow-sm" : "text-gray-500"}`}
          >
            Operacje
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-8 py-2 rounded-xl font-bold transition flex-1 md:flex-none ${activeTab === "reports" ? "bg-gray-800 text-white shadow-sm" : "text-gray-500"}`}
          >
            Raporty
          </button>
        </div>

        {/* Środek: Data */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100 w-full md:w-auto justify-center">
          <button
            onClick={() => setCurrentDate(new Date(year, month - 1))}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-800"
          >
            <ChevronLeft size={20} />
          </button>
          <MonthPicker currentDate={currentDate} onChange={setCurrentDate} />
          <button
            onClick={() => setCurrentDate(new Date(year, month + 1))}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-800"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Prawy: Wyloguj w kafelku */}
        <button
          onClick={() => supabase.auth.signOut()}
          className="bg-red-50 text-red-600 px-6 py-2 rounded-2xl font-bold hover:bg-red-100 transition w-full md:w-auto text-center"
        >
          Wyloguj
        </button>
      </div>

      {activeTab === "dashboard" ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <div className="flex flex-col gap-6">
            <BudgetSummary
              balance={balance}
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
            />
            <IncomeHistory
              incomes={filteredIncomes || []}
              onEdit={setEditingIncome}
            />
            <ChartComponent
              expenses={filteredExpenses}
              categories={categories || []}
            />
          </div>

          <div className="flex flex-col gap-6">
            <TransactionForms
              categories={categories || []}
              userId={session.user.id}
              walletId={activeWalletId}
            />
            <CategoryManager walletId={activeWalletId} />

            <TransactionList
              expenses={filteredExpenses}
              onEditExpense={setEditingExpense}
            />
          </div>
        </div>
      ) : (
        <ReportView walletId={activeWalletId} />
      )}

      {/* Modal Edycji Wpłaty */}
      {editingIncome && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-3xl w-full max-w-sm shadow-xl">
            <h2 className="font-bold text-lg mb-4">Edytuj wpłatę</h2>
            <input
              type="number"
              value={editingIncome.amount}
              onChange={(e) =>
                setEditingIncome({
                  ...editingIncome,
                  amount: parseFloat(e.target.value),
                })
              }
              className="w-full border p-3 rounded-xl mb-6 outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setEditingIncome(null)}
                className="flex-1 p-3 rounded-xl bg-gray-200 font-bold hover:bg-gray-300 transition"
              >
                Anuluj
              </button>
              <button
                onClick={async () => {
                  const { error } = await supabase
                    .from("incomes")
                    .update({ amount: editingIncome.amount })
                    .eq("id", editingIncome.id)
                    .eq("user_id", session.user.id);

                  if (!error) {
                    await db.incomes.update(editingIncome.id, {
                      amount: editingIncome.amount,
                    });
                    setEditingIncome(null);
                  } else {
                    alert("Błąd: " + error.message);
                  }
                }}
                className="flex-1 p-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition"
              >
                Zapisz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edycji Wydatku */}
      {editingExpense && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-3xl w-full max-w-sm shadow-xl">
            <h2 className="font-bold text-lg mb-4">Edytuj wydatek</h2>
            <input
              type="number"
              value={editingExpense.amount}
              onChange={(e) =>
                setEditingExpense({
                  ...editingExpense,
                  amount: parseFloat(e.target.value),
                })
              }
              className="w-full border p-3 rounded-xl mb-6 outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setEditingExpense(null)}
                className="flex-1 p-3 rounded-xl bg-gray-200 font-bold hover:bg-gray-300 transition"
              >
                Anuluj
              </button>
              <button
                onClick={async () => {
                  const { error } = await supabase
                    .from("expenses")
                    .update({ amount: editingExpense.amount })
                    .eq("id", editingExpense.id)
                    .eq("user_id", session.user.id);

                  if (!error) {
                    await db.expenses.update(editingExpense.id, {
                      amount: editingExpense.amount,
                    });
                    setEditingExpense(null);
                  } else {
                    alert("Błąd: " + error.message);
                  }
                }}
                className="flex-1 p-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition"
              >
                Zapisz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal edycji nazwy portfela */}
      {editingWallet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white p-6 rounded-3xl w-full max-w-sm shadow-xl">
            <h2 className="font-bold text-xl mb-4">Zmień nazwę</h2>
            <input
              className="w-full border p-3 rounded-xl mb-6 outline-none focus:ring-2 focus:ring-blue-500"
              value={editingWallet.name}
              onChange={(e) =>
                setEditingWallet({ ...editingWallet, name: e.target.value })
              }
            />
            <div className="flex gap-2">
              <button
                onClick={() => setEditingWallet(null)}
                className="flex-1 p-3 bg-gray-100 rounded-xl font-bold"
              >
                Anuluj
              </button>
              <button
                onClick={async () => {
                  await handleRenameWallet(
                    editingWallet.id,
                    editingWallet.name,
                  );
                  setEditingWallet(null);
                }}
                className="flex-1 p-3 bg-blue-600 text-white rounded-xl font-bold"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {isWalletModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-3xl w-full max-w-sm shadow-xl">
            <h2 className="font-bold text-xl mb-6 text-gray-800">
              Twoje Portfele
            </h2>

            {/* Lista portfeli */}
            <div className="space-y-3 mb-6">
              {allWallets?.map((w) => (
                <WalletItem
                  key={w.id}
                  wallet={w}
                  isPremium={isPremium}
                  onEditClick={(wallet: any) => setEditingWallet(wallet)} // Otwiera modal
                  onDelete={async () => {
                    if (confirm("Czy na pewno usunąć portfel?")) {
                      await supabase.from("wallets").delete().eq("id", w.id);
                      await db.wallets.delete(w.id!);
                      setActiveWalletId(
                        allWallets.find((x) => x.id !== w.id)?.id || null,
                      );
                    }
                  }}
                />
              ))}
            </div>
            {/* Dodawanie portfela */}
            {isPremium ? (
              <div className="flex gap-2 mb-6">
                <input
                  value={newWalletName}
                  onChange={(e) => setNewWalletName(e.target.value)}
                  placeholder="Nazwa nowego portfela..."
                  className="flex-1 border-2 border-gray-100 p-3 rounded-2xl outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleAddWallet}
                  className="bg-blue-600 text-white px-5 rounded-2xl font-bold hover:bg-blue-700"
                >
                  +
                </button>
              </div>
            ) : (
              <div className="bg-yellow-50 p-4 rounded-2xl mb-6 text-center">
                <p className="text-sm text-yellow-800 font-medium">
                  Wersja Free: 1 portfel
                </p>
              </div>
            )}

            {/* Przycisk Premium / Zarządzaj */}
            {isPremium ? (
              <button
                onClick={handleManageSubscription}
                className="w-full p-3 bg-white border-2 border-gray-200 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition mb-3"
              >
                Zarządzaj subskrypcją
              </button>
            ) : (
              <button
                onClick={() => setIsPackageModalOpen(true)}
                className="w-full p-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition mb-3 shadow-lg"
              >
                🚀 Ulepsz do Premium
              </button>
            )}

            <button
              onClick={() => setIsWalletModalOpen(false)}
              className="w-full p-3 bg-gray-800 text-white rounded-2xl font-bold hover:bg-gray-900 transition"
            >
              Zamknij
            </button>
          </div>
        </div>
      )}

      {/* Modal wyboru pakietu */}
      {isPackageModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-3xl w-full max-w-sm shadow-xl">
            <h2 className="font-bold text-xl mb-6 text-center text-gray-800">
              Wybierz swój plan
            </h2>
            <div className="space-y-3">
              {/* Subskrypcja - wyróżniona */}
              <button
                onClick={() =>
                  handleCheckout("price_1UDmMFRyZ488ciU9nL0kJ24e", true)
                }
                className="w-full p-4 border-2 border-blue-600 rounded-2xl text-blue-600 font-bold hover:bg-blue-50 transition"
              >
                Miesięczna subskrypcja (Karta)
              </button>

              {/* Pakiety BLIK */}
              <button
                onClick={() =>
                  handleCheckout("price_1UKhNJRyZ488ciU9VwgkY7ZL", false)
                }
                className="w-full p-4 bg-gray-50 rounded-2xl font-bold hover:bg-gray-100 transition text-gray-700"
              >
                Pakiet 3 miesiące (BLIK)
              </button>
              <button
                onClick={() =>
                  handleCheckout("price_1UKhNtRyZ488ciU9vnunbhdR", false)
                }
                className="w-full p-4 bg-gray-50 rounded-2xl font-bold hover:bg-gray-100 transition text-gray-700"
              >
                Pakiet 6 miesięcy (BLIK)
              </button>
              <button
                onClick={() =>
                  handleCheckout("price_1UKhOTRyZ488ciU99VVeBvfN", false)
                }
                className="w-full p-4 bg-gray-50 rounded-2xl font-bold hover:bg-gray-100 transition text-gray-700"
              >
                Pakiet 12 miesięcy (BLIK)
              </button>
            </div>

            <button
              onClick={() => setIsPackageModalOpen(false)}
              className="w-full mt-6 p-3 bg-gray-800 text-white rounded-2xl font-bold hover:bg-gray-900 transition"
            >
              Zamknij
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
