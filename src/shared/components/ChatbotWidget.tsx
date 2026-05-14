import { useState } from "react";

const BARCA_RED = "#A50044";
const BARCA_BLUE = "#004D98";

// Cambia esta URL por la del bucket de Supabase cuando esté lista
const LOGO_URL =
  "https://vsywrimuzdnfyztreolz.supabase.co/storage/v1/object/sign/logo/barcelona_logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtl eV85YjVhN2I1MC1iNThkLTRkMzEtOTJiZS1jMWRjNjdmZjY5MGYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsb2dvL2JhcmNlbG9uYV9sb2dvLnBuZyIsImlhdCI6MTc3ODcyNzc0NywiZXhwIjoxODEwMjYzNzQ3fQ.ThhzjH9iwzc35JmvbFMXfx-p24cpCcgOCMvBiAJ87ac";

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-80 h-96 bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col overflow-hidden">
          <div
            className="p-4 flex items-center gap-2"
            style={{
              background: `linear-gradient(135deg, ${BARCA_RED}, ${BARCA_BLUE})`,
            }}
          >
            <img src={LOGO_URL} alt="FC Barcelona" className="w-6 h-6" />
            <span className="font-bold text-white text-sm">Asistente Barça</span>
          </div>
          <div className="flex-1 p-4 text-sm text-slate-400 flex items-center justify-center">
            Próximamente...
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        aria-label="Abrir asistente Barça"
        className="relative w-16 h-16 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform duration-200"
        style={{
          background: `conic-gradient(${BARCA_RED} 0deg 180deg, ${BARCA_BLUE} 180deg 360deg)`,
          padding: "3px",
        }}
      >
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
          <img
            src={LOGO_URL}
            alt="FC Barcelona"
            className="w-9 h-9 object-contain"
          />
        </div>
      </button>
    </div>
  );
};

export default ChatbotWidget;