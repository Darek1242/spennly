import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import { X } from "lucide-react";
import { supabase } from "../supabaseClient";
import { DeleteConfirmModal } from "./DeleteConfirmModal"; // Zakładam istnienie tego komponentu

export function CategoryManager({
  walletId,
  isPremium,
  setIsPremiumRequiredOpen,
}: {
  walletId: number | null;
  isPremium: boolean;
  setIsPremiumRequiredOpen: (isOpen: boolean) => void;
}) {
  const [newCategory, setNewCategory] = useState("");
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const categories = useLiveQuery(
    () =>
      db.categories
        .where("wallet_id")
        .equals(walletId || 0)
        .toArray(),
    [walletId],
  );

  const expenses = useLiveQuery(() => db.expenses.toArray(), []);

  const addCategory = async () => {
    const categoryCount = categories?.length || 0;

    // Blokada tylko jeśli nie ma Premium I przekroczono limit
    if (!isPremium && categoryCount >= 6) {
      setIsPremiumRequiredOpen(true);
      return;
    }

    if (!newCategory.trim() || !walletId) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const catData = {
        name: newCategory,
        user_id: user.id,
        wallet_id: walletId,
      };

      const { data, error } = await supabase
        .from("categories")
        .insert(catData)
        .select()
        .single();

      if (error) {
        alert("Błąd: " + error.message);
        return;
      }

      if (data) {
        await db.categories.add(data);
        setNewCategory("");
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <h2 className="font-bold text-gray-800 mb-4">
        {isPremium
          ? "Twoje kategorie (nielimitowane)"
          : `Kategorie (${categories?.length || 0}/6)`}
      </h2>

      <div className="flex gap-2 mb-4">
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Nowa kategoria"
          className="flex-1 border border-gray-200 p-3 rounded-xl bg-gray-50 outline-none"
        />
        <button
          onClick={addCategory}
          className="bg-blue-600 text-white px-6 rounded-xl font-bold hover:bg-blue-700"
        >
          +
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories?.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg text-sm text-gray-700"
          >
            {c.name}
            <button
              onClick={() => {
                const hasExpenses = expenses?.some(
                  (e) => e.category === c.name,
                );
                if (hasExpenses) {
                  // Otwórz modal OSTRZEŻENIE (tylko z przyciskiem Zamknij)
                  setDeleteTarget({
                    id: null,
                    message:
                      "Nie możesz usunąć kategorii, do której przypisano wydatki.",
                  });
                } else {
                  // Otwórz modal POTWIERDZENIE (z przyciskiem Usuń)
                  setDeleteTarget(c);
                }
              }}
              className="hover:text-red-500"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Modal potwierdzenia */}
      {deleteTarget && (
        <DeleteConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          // Jeśli id jest null, to znaczy że to tylko komunikat o błędzie -> nie pokazuj usuwania
          onConfirm={
            deleteTarget.id
              ? async () => {
                  await db.categories.delete(deleteTarget.id);
                  await supabase
                    .from("categories")
                    .delete()
                    .eq("id", deleteTarget.id);
                  setDeleteTarget(null);
                }
              : null
          }
          message={
            deleteTarget.id
              ? "Kategoria zostanie trwale usunięta. Czy chcesz kontynuować?"
              : deleteTarget.message
          }
        />
      )}
    </div>
  );
}
