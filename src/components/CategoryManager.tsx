import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import { X } from "lucide-react";
import { supabase } from "../supabaseClient";

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

  const categories = useLiveQuery(
    () =>
      db.categories
        .where("wallet_id")
        .equals(walletId || 0)
        .toArray(),
    [walletId],
  );

  const addCategory = async () => {
    // 1. Sprawdzenie limitu (6 kategorii dla wersji FREE)
    if (!isPremium && (categories?.length || 0) >= 6) {
      setIsPremiumRequiredOpen(true); // Otwiera nowy modal Premium
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
        Kategorie ({categories?.length || 0}/6 w planie Free)
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
              onClick={async () => {
                await db.categories.delete(c.id!);
                await supabase.from("categories").delete().eq("id", c.id!);
              }}
              className="hover:text-red-500"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
