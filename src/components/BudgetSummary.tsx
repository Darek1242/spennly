export function BudgetSummary({ balance, totalIncome, totalExpenses }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
      <p className="text-gray-500">Pozostało budżetu</p>
      <h2 className="text-3xl font-bold text-gray-900 mt-1">
        {balance.toFixed(2)} PLN
      </h2>

      <div className="flex justify-between gap-4 mt-6">
        {/* Wpływy */}
        <div className="bg-green-50 p-4 rounded-2xl flex-1 flex flex-col md:flex-row justify-center items-center gap-1 md:gap-2 text-center">
          <p className="text-green-700 font-bold">Wpływy:</p>
          <p className="text-green-800 font-bold">+{totalIncome.toFixed(2)}</p>
        </div>

        {/* Wydatki */}
        <div className="bg-red-50 p-4 rounded-2xl flex-1 flex flex-col md:flex-row justify-center items-center gap-1 md:gap-2 text-center">
          <p className="text-red-700 font-bold">Wydatki:</p>
          <p className="text-red-800 font-bold">-{totalExpenses.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
