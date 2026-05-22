import { useState } from "react";
import { AnimatePresence, motion } from "motion/react"
import Chat from "../../pages/Chat";

const logoURL = import.meta.env.VITE_LOGO_URL;

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
            className="w-180 h-120 bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col overflow-hidden"
          >
            <div
              className="p-4 flex items-center gap-2"
              style={{ background: "#A50044" }}
            >
              <img src={logoURL} alt="FC Barcelona" className="w-6 h-6" />
              <span className="text-xl font-bold text-white text-sm">Barçabot</span>
            </div>
            <div className="flex-1 min-h-0 flex flex-col">
              <Chat embedded />
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
                marginRight: "-35px",
                paddingRight: "18px",
              }}
              className="text-white text-m h-19 w-88 text-left p-4 font-sans rounded-l-full whitespace-normal pointer-events-none select-none"
            >
              ¡Hola! Soy el asistente virtual del Barça. 
              ¿En qué puedo ayudarte hoy?
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