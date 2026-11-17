export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  message,
}: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[200]">
      <div className="bg-white p-8 rounded-3xl w-full max-w-sm shadow-2xl text-center">
        <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h2 className="font-bold text-xl mb-2">
          {onConfirm ? "Czy na pewno?" : "Uwaga"}
        </h2>
        <p className="text-gray-600 mb-8 text-sm">{message}</p>
        <div className="flex gap-2">
          {onConfirm && ( // Pokazuj Anuluj tylko jeśli jest przycisk Usuń
            <button
              onClick={onClose}
              className="flex-1 p-4 bg-gray-100 rounded-2xl font-bold hover:bg-gray-200 transition"
            >
              Anuluj
            </button>
          )}
          {onConfirm ? (
            <button
              onClick={onConfirm}
              className="flex-1 p-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition"
            >
              Usuń
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full p-4 bg-gray-800 text-white rounded-2xl font-bold hover:bg-black transition"
            >
              Zamknij
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
