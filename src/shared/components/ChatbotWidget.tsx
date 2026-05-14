import { useState } from "react";
import { AnimatePresence, motion } from "motion/react"

const logoURL = "https://vsywrimuzdnfyztreolz.supabase.co/storage/v1/object/sign/logo/barcelona_logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85YjVhN2I1MC1iNThkLTRkMzEtOTJiZS1jMWRjNjdmZjY5MGYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsb2dvL2JhcmNlbG9uYV9sb2dvLnBuZyIsImlhdCI6MTc3ODc4NjIxMiwiZXhwIjoxODEwMzIyMjEyfQ.H2LaUn3HgO4lTLx2n8bpFjfHs3X2aXG8noWz9yDgRBQ";

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Panel del chat */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-80 h-96 bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col overflow-hidden"
          >
            <div
              className="p-4 flex items-center gap-2"
              style={{ background: "linear-gradient(135deg, #A50044, #004D98)" }}
            >
              <img src={logoURL} alt="FC Barcelona" className="w-6 h-6" />
              <span className="font-bold text-white text-sm">Asistente Barça</span>
            </div>
            <div className="flex-1 p-4 text-sm text-slate-400 flex items-center justify-center">
              Próximamente...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón con label hover */}
      <div
        className="flex items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Etiqueta azul que crece desde el botón hacia la izquierda */}
        <AnimatePresence>
          {isHovered && (
            <motion.span
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{
                originX: 1,
                background: "#004D98",
                marginRight: "-10px",
                paddingRight: "18px",
              }}
              className="text-white text-sm font-bold px-4 py-2 rounded-l-full whitespace-nowrap pointer-events-none select-none"
            >
              Asistente
            </motion.span>
          )}
        </AnimatePresence>

        {/* Botón circular principal */}
        <motion.button
          onClick={() => setOpen(!open)}
          aria-label="Abrir asistente Barça"
          animate={{ x: isHovered ? -6 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-20 h-20 rounded-full shadow-lg active:scale-95"
          style={{
            background: "conic-gradient(#A50044 0deg 180deg, #004D98 180deg 360deg)",
            padding: "8px",
          }}
        >
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
            <img
              src={logoURL}
              alt="FC Barcelona"
              className="w-9 h-9 object-contain"
            />
          </div>
        </motion.button>
      </div>
    </div>
  );
};

export default ChatbotWidget;