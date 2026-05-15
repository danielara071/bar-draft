type CardAgregarTrofeoProps = {
  onUpload: () => void;
  onConfirmar: () => void;
};

function CardAgregarTrofeo({
  onUpload,
  onConfirmar
}: CardAgregarTrofeoProps) {
  return (
        <div className="flex items-center justify-center  p-5">
            <div className="w-full bg-brand-navy rounded-[2.5rem]  p-6 px-10">
              <h2 className="text-xl font-semibold text-white font-sans ">Nuevo Trofeo</h2>
              {/* Columnas */}
              <div className="grid grid-cols-2 gap-8 mt-4 mb-4">
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-brand-yellow font-sans ">
                      NOMBRE DEL TROFEO
                    </label>
                    <input
                      type="text"
                      placeholder="Trofeo Barcelona"
                      className="w-full bg-white text-gray-500 rounded-full py-3 px-6 outline-none focus:ring-2 focus:ring-[#f4bd0e]"
                      />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-brand-yellow">
                    DESCRIPCIÓN
                  </label>
                  <input
                    type="text"
                    placeholder="Trofeo Barcelona"
                    className="w-full bg-white text-gray-500 rounded-full py-3 px-6 outline-none focus:ring-2 focus:ring-[#f4bd0e]"
                   />
                </div>
              </div>
              {/*Fin Columnas*/}
              <label className="text-sm text-brand-yellow font-sans">COORDENADAS</label>
              <input
                  type="text"
                  placeholder="Trofeo Barcelona"
                  className="w-full bg-white text-gray-500 rounded-full py-3 px-6 outline-none focus:ring-2 focus:ring-[#f4bd0e]"
                  />
              {/*botones*/}
              <div className="flex justify-between items-center mt-8">
                <button className="bg-brand-yellow hover:bg-[#d9a90d] text-[#001d3d] font-bold py-3 px-10 rounded-full transition-colors duration-200"
                  onClick={onUpload}>
                  Agregar Objeto
                </button>
                
                <button className="bg-brand-yellow hover:bg-[#d9a90d] text-[#001d3d] font-bold py-3 px-14 rounded-full transition-colors duration-200"
                  onClick={onConfirmar}>
                  Confirmar
                </button>
              </div>
          </div>
        </div>
  );
}

export default CardAgregarTrofeo