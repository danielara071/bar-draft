import { Trophy, Trash2 } from 'lucide-react';

type CardTrofeoAdminProps = {
  nombre: string;
  descripcion: string;
  coordenadas: string;
  onDeleate: () => void;
};

export default function CardTrofeoAdmin({
  nombre,
  descripcion,
  coordenadas,
  onDeleate
}: CardTrofeoAdminProps) {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border-2 border-[#001d3d] rounded-[2rem] p-6 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-4">
            <div className="bg-[#f4bd0e] p-3 rounded-full flex items-center justify-center h-12 w-12 shrink-0">
              <Trophy className="text-[#001d3d] w-6 h-6" />
            </div>

            <div className="flex flex-col">
              <h3 className="text-[#001d3d] font-bold text-lg leading-tight">
                {nombre}
              </h3>
              <span className="text-slate-500 text-sm font-medium mt-1">
                {coordenadas}
              </span>
            </div>
          </div>

          <button 
            onClick={onDeleate}
            className="bg-red-50 p-3 rounded-full group hover:bg-red-100 transition-colors"
          >
            <Trash2 className="text-red-500 w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        <div className="ml-1">
          <p className="text-gray-500 text-base leading-relaxed">
            {descripcion}
          </p>
        </div>
      </div>
    </div>
  );
}