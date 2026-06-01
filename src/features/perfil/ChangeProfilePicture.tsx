import { useState, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import { supabase } from "@/shared/services/supabaseClient";


type ChangeProfilePictureProps = {
  user_id: string;
  onUpdateSuccess?: (newUrl: string) => void; // Callback opcional para avisar al padre
};

const BUCKET_BASE_URL = "https://vsywrimuzdnfyztreolz.supabase.co/storage/v1/object/public/profile-pictures/";

export default function ChangeProfilePicture({
  user_id,
  onUpdateSuccess,
}: ChangeProfilePictureProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showConfirm, setShowConfirm] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loadingImages, setLoadingImages] = useState(false);

  // Cargar las imágenes secuencialmente hasta encontrar un 404
  useEffect(() => {
    async function discoverImages() {
      setLoadingImages(true);
      const foundImages: string[] = [];
      let index = 1;
      let hasMore = true;

      while (hasMore) {
        const fileName = `${String(index).padStart(4, '0')}.png`;
        const fullUrl = `${BUCKET_BASE_URL}${fileName}`;

        try {
          const response = await fetch(fullUrl, { method: 'HEAD' });
          
          if (response.ok) {
            foundImages.push(fullUrl);
            index++;
          } else {
            // cuando da 404 u otro error, detenemos la búsqueda
            hasMore = false;
          }
        } catch (error) {
          console.error("Error verificando imagen:", error);
          hasMore = false;
        }
      }

      setImages(foundImages);
      setLoadingImages(false);
    }

    discoverImages();
  }, []);

  const handleConfirmSelection = async () => {
    if (!selectedImage) return;

    setStatus('loading');
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ url_avatar: selectedImage })
        .eq('id', user_id); 
      if (error) throw error;
      setStatus('success');
      if (onUpdateSuccess) onUpdateSuccess(selectedImage);
      
      setTimeout(() => {
        setShowConfirm(false);
        setStatus('idle');
      }, 1000);

    } catch (error) {
      console.error("Error actualizando el avatar:", error);
      setStatus('error');
    }
  };

  return (
    <div>
      <button 
        className="text-black bg-brand-yellow hover:bg-[#ffd11f] px-4 py-4 rounded-full text-md transition-colors" 
        onClick={() => setShowConfirm(true)}
      > 
        <FiEdit size={20} />
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full mx-4 text-gray-800 flex flex-col max-h-[85vh]">
            
            <h3 className="text-xl font-bold mb-1">Cambiar Foto de Perfil</h3>
            <p className="text-sm text-gray-600 mb-4">
              Selecciona uno de los avatares disponibles.
            </p>

            {/* Contenedor del Grid con Scroll */}
            <div className="flex-1 overflow-y-auto min-h-[200px] max-h-[400px] mb-6 pr-2">
              {loadingImages ? (
                <div className="flex items-center justify-center h-full py-12">
                  <p className="text-sm text-gray-500 animate-pulse">Buscando avatares disponibles...</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {images.map((url) => {
                    const isSelected = selectedImage === url;
                    return (
                      <button
                        key={url}
                        onClick={() => setSelectedImage(url)}
                        className={`relative aspect-square rounded-full overflow-hidden border-4 transition-all bg-gray-50 
                          ${
                          isSelected 
                            ? 'border-brand-yellow scale-95 shadow-md' 
                            : 'border-transparent hover:border-gray-200'
                        }`}
                      >
                        <img 
                          src={url} 
                          alt="Avatar Option" 
                          className="w-full h-full object-cover rounded-full"
                          loading="lazy"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Acciones */}
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
              <button 
                onClick={() => {
                  setShowConfirm(false);
                  setSelectedImage(null);
                }}
                className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={status === 'loading'}
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmSelection}
                disabled={status === 'loading' || !selectedImage}
                className="px-4 py-2 bg-[#A50044] text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? 'Guardando...' : status === 'success' ? '¡Listo!' : 'Confirmar'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}