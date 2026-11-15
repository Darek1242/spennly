export function PremiumRequiredModal({ onClose, onShowPlans }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[200]">
      <div className="bg-white p-8 rounded-3xl w-full max-w-sm shadow-2xl text-center">
        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🚀</span>
        </div>
        <h2 className="font-bold text-xl mb-2">Limit osiągnięty</h2>
        <p className="text-gray-600 mb-8 text-sm">
          Osiągnąłeś limit darmowej wersji. Przejdź na Premium, aby korzystać z
          pełnych możliwości bez ograniczeń!
        </p>
        <button
          onClick={onShowPlans}
          className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold mb-3 hover:bg-blue-700 transition"
        >
          Zobacz pakiety
        </button>
        <button
          onClick={onClose}
          className="w-full p-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition"
        >
          Zamknij
        </button>
      </div>
    </div>
  );
}
