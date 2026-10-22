import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function HelpView({ onClose }: { onClose: () => void }) {
  const sections = [
    {
      title: "Zarządzanie Portfelami",
      content:
        "Możesz tworzyć wiele portfeli (np. Dom, Firma). Wybierz portfel w lewym górnym rogu. Wersja Free pozwala na 1 portfel, wersja Premium odblokowuje ich nielimitowaną liczbę.",
    },
    {
      title: "Dodawanie środków i wydatków",
      content:
        "Użyj sekcji 'Dodaj środki' dla wpływów i 'Dodaj wydatek' dla kosztów. Pamiętaj o wybraniu kategorii – dzięki temu wykresy w zakładce Raporty będą pokazywać dokładny podział Twoich finansów.",
    },
    {
      title: "Raporty i analiza",
      content:
        "W zakładce 'Raporty' możesz ustawić zakres dat. Wykres kołowy automatycznie zsumuje wydatki w kategoriach, pozwalając Ci zobaczyć, na co wydajesz najwięcej.",
    },
    {
      title: "Zarządzanie subskrypcją",
      content:
        "Kliknij ikonę ustawień (zębatkę) w pasku portfeli. Tam znajdziesz przycisk do zarządzania subskrypcją w Stripe, gdzie w każdej chwili możesz anulować plan lub pobrać fakturę.",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-3xl w-full max-w-sm shadow-xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-6 text-gray-800">
          Instrukcja obsługi
        </h2>
        <div className="space-y-4">
          {sections.map((s, i) => (
            <AccordionItem key={i} title={s.title} content={s.content} />
          ))}
        </div>
        <button
          onClick={onClose}
          className="w-full mt-8 p-3 bg-gray-800 text-white rounded-2xl font-bold hover:bg-gray-900 transition"
        >
          Zamknij
        </button>
      </div>
    </div>
  );
}

function AccordionItem({
  title,
  content,
}: {
  title: string;
  content: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-2xl bg-gray-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex justify-between items-center font-bold text-sm text-gray-700"
      >
        {title} {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-xs text-gray-600 leading-relaxed">
          {content}
        </div>
      )}
    </div>
  );
}
