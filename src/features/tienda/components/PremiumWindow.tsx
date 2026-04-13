type PremiumWindowPros = {
    onClose: () => void;
    onSubscribe: () => void;
}

const PremiumWindow = ({ onClose, onSubscribe }: PremiumWindowPros) => {

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            role="presentation"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className="bg-white rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row relative"
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Botón de cerrar*/}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Parte izquierda de la ventana*/}
                <div className="w-full md:w-5/12 bg-gradient-to-br from-[#A50044] via-[#7B0031] to-[#004D98] p-10 flex flex-col justify-center items-center text-white text-center">
                    <h2 className="text-3xl font-bold mb-2">Hazte Miembro Premium</h2>
                    <p className="text-sm opacity-80 mb-8">Desbloquea beneficios exclusivos</p>
                    
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 w-full max-w-[200px] border border-white/20">
                        <div className="flex items-center justify-center gap-1">
                            <span className="text-5xl font-bold">$50</span>
                            <span className="text-xl opacity-80">/mes</span>
                        </div>
                        <p className="text-xs mt-2 opacity-70">Cancela cuando quieras</p>
                    </div>
                </div>

                {/* Parte derecha de la ventana */}
                <div className="w-full md:w-7/12 p-10 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Beneficios Exclusivos</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-10">
                        {[
                            "Acceso a Rifas Exclusivas",
                            "Descuentos Especiales",
                            "100 Monedas Bonus/Mes",
                            "Insignias Exclusivas"
                        ].map((text) => (
                            <div key={text} className="flex items-center gap-3">
                                <div className="bg-[#A50044] rounded-full p-1">
                                    <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-sm font-semibold text-gray-700">{text}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto space-y-3">
                        <button
                            onClick={onSubscribe} 
                            className="w-full bg-[#F5BF00] hover:bg-[#D4A400] text-[#004D98] font-bold py-3 rounded-full transition-colors shadow-md"
                        >
                            Subscribirme
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full border border-gray-300 hover:bg-gray-50 text-gray-500 font-semibold py-3 rounded-full transition-colors text-sm"
                        >
                            Quizás más tarde
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PremiumWindow;