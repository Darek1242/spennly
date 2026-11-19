import { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { pl } from "date-fns/locale/pl";
import { db } from "../db";
import { supabase } from "../supabaseClient";
import { Wallet, Plus } from "lucide-react";
import { CategorySelect } from "./CategorySelect";
registerLocale("pl", pl);

export function TransactionForms({
  categories,
  userId,
  walletId,
}: {
  categories: any[];
  userId: string;
  walletId: number | null;
}) {
  const [amount, setAmount] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [expenseDate, setExpenseDate] = useState(new Date());
  const [incomeDate, setIncomeDate] = useState(new Date());

  const inputClass =
    "w-full border border-gray-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-green-500 transition";

  const handleAddExpense = async () => {
    if (!amount || !selectedCategory || !walletId) return;

    const expenseData = {
      amount: parseFloat(amount),
      category: selectedCategory,
      date: expenseDate.toISOString(),
      user_id: userId,
      wallet_id: walletId,
      description: "",
    };

    const { data, error } = await supabase
      .from("expenses")
      .insert(expenseData)
      .select()
      .single();

    if (error) {
      alert("Błąd zapisu: " + error.message);
      return;
    }

    if (data) {
      await db.expenses.add({
        ...data,
        date: new Date(data.date),
      });
      setAmount("");
    }
  };

  const handleAddIncome = async () => {
    if (!incomeAmount || !walletId) return;

    const incomeData = {
      amount: parseFloat(incomeAmount),
      date: incomeDate.toISOString(),
      user_id: userId,
      wallet_id: walletId,
    };

    const { data, error } = await supabase
      .from("incomes")
      .insert(incomeData)
      .select()
      .single();

    if (error) {
      alert("Błąd zapisu wpłaty: " + error.message);
    } else if (data) {
      await db.incomes.add({
        ...data,
        date: new Date(data.date),
      });
      setIncomeAmount("");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* SEKCJA WPŁATY */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Plus size={20} className="text-green-600" /> Dodaj środki
        </h2>
        <div className="flex gap-2">
          <input
            type="number"
            // @ts-ignore
            inputMode="decimal"
            pattern="[0-9]*"
            value={incomeAmount}
            onChange={(e) => setIncomeAmount(e.target.value)}
            placeholder="Kwota"
            className={inputClass}
          />
          <DatePicker
            selected={incomeDate}
            onChange={(d: Date | null) => d && setIncomeDate(d)}
            dateFormat="dd/MM/yyyy"
            locale="pl"
            customInput={
              <input
                className="bg-gray-50 p-3 rounded-xl w-32 text-center cursor-pointer"
                readOnly
                // @ts-ignore
                inputMode="none"
              />
            }
          />
          <button
            onClick={handleAddIncome}
            className="bg-green-600 text-white px-6 rounded-xl font-bold hover:bg-green-700 transition"
          >
            +
          </button>
        </div>
      </div>

      {/* SEKCJA WYDATKU */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Plus size={20} className="text-red-600" /> Dodaj wydatek
        </h2>
        <input
          type="number"
          // @ts-ignore
          inputMode="decimal"
          pattern="[0-9]*"
          placeholder="Kwota"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={inputClass + " mb-3"}
        />
        <div className="flex gap-2 mb-3">
          <CategorySelect
            categories={categories}
            value={selectedCategory}
            onChange={setSelectedCategory}
          />
          <DatePicker
            selected={expenseDate}
            onChange={(d: Date | null) => d && setExpenseDate(d)}
            dateFormat="dd/MM/yyyy"
            locale="pl"
            customInput={
              <input
                className="bg-gray-50 p-3 rounded-xl w-32 text-center cursor-pointer"
                readOnly
                // @ts-ignore
                inputMode="none"
              />
            }
          />
        </div>
        <button
          onClick={handleAddExpense}
          className="w-full bg-green-600 text-white p-3 rounded-xl font-bold hover:bg-green-700 transition"
        >
          Zapisz wydatek
        </button>
      </div>
    </div>
  );
}
