import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { supabase } from "@/shared/services/supabaseClient";

type ChangeNameProps = {
  user_id: string;
  currentName: string;
  onUpdateSuccess?: (newName: string) => void; // Callback para avisar al componente padre
};

export default function ChangeName({
  user_id,
  currentName,
  onUpdateSuccess,
}: ChangeNameProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showConfirm, setShowConfirm] = useState(false);
  const [newName, setNewName] = useState(currentName);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConfirmSelection = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newName.trim();
    if (!cleanName) {
      setErrorMessage("El nombre no puede estar vacío.");
      return;
    }
    if (cleanName === currentName) {
      setErrorMessage("El nombre es igual al actual.");
      return;
    }

    setStatus('loading');
    setErrorMessage(null);

    try {
      const { data, error: searchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('nombre', cleanName) 
        .neq('id', user_id) 
        .maybeSingle();
      if (searchError) throw searchError;

      if (data) {
        setErrorMessage("Este nombre ya está en uso por otro usuario.");
        setStatus('idle');
        return;
      }
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ nombre: cleanName })
        .eq('id', user_id);

      if (updateError) throw updateError;
      setStatus('success');
      if (onUpdateSuccess) onUpdateSuccess(cleanName);
      setTimeout(() => {
        setShowConfirm(false);
        setStatus('idle');
      }, 1500);

    } catch (error) {
      setErrorMessage("Ocurrió un error inesperado. Inténtalo de nuevo.");
      setStatus('error');
    }
  };

  return (
    <div>
      <button 
        className="text-black bg-brand-yellow hover:bg-[#ffd11f] px-4 py-4 rounded-full text-md transition-colors" 
        data-cy="editar-nombre-perfil"
        onClick={() => {
          setNewName(currentName);
          setErrorMessage(null);
          setShowConfirm(true);
        }}
      > 
        <FiEdit size={20} />
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <form 
            onSubmit={handleConfirmSelection}
            className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full mx-4 text-gray-800 flex flex-col"
          >
            
            <h3 className="text-xl font-bold mb-1">Cambiar Nombre de Perfil</h3>
            <p className="text-sm text-gray-600 mb-4">
              Ingresa tu nuevo nombre de usuario
            </p>

            {/* Input de Texto */}
            <div className="mb-4">
              <input
                data-cy="text-edit-nombre-perfil"
                type="text"
                maxLength={30}
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  if (errorMessage) setErrorMessage(null); // Limpiar error mientras escribe
                }}
                disabled={status === 'loading' || status === 'success'}
                placeholder="Escribe tu nuevo nombre..."
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent text-gray-900 disabled:bg-gray-100"
              />
              
              {errorMessage && (
                <p className="text-xs text-red-500 mt-2 font-medium">
                  {errorMessage}
                </p>
              )}
              {status === 'success' && (
                <p className="text-xs text-green-600 mt-2 font-medium">
                  Nombre actualizado
                </p>
              )}
            </div>
            
            {/* Acciones */}
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
              <button 
                type="button"
                onClick={() => {
                  setShowConfirm(false);
                  setErrorMessage(null);
                }}
                className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={status === 'loading'}
              >
                Cancelar
              </button>
              <button 
                type="submit"
                disabled={status === 'loading' || status === 'success' || !newName.trim() || newName.trim() === currentName}
                className="px-4 py-2 bg-[#A50044] text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? 'Verificando...' : status === 'success' ? '¡Listo!' : 'Confirmar'}
              </button>
            </div>

          </form>
        </div>
      )}
    </div>
  );
}