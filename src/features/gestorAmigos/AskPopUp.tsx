
type AskPopUpProps = {
  pregunta: string;
  texto: string;
  textConf: string;
  textDeny: string;

  onConfirm: () => void;
  onDeny: () => void;
};

export default function AskPopUp({
  pregunta,
  texto,
  textConf,
  textDeny,

  onConfirm = () => {},
  onDeny = () => {},

}: AskPopUpProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 text-gray-800">
        <h3 className="text-xl font-bold mb-2">{pregunta} </h3>
        <p className="text-sm text-gray-600 mb-6">
          {texto}
        </p>
        
        <div className="flex gap-3 justify-end">
          <button 
            onClick={onConfirm}
            className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {textConf}
          </button>
          <button 
            onClick={onDeny}
            className="px-4 py-2 bg-[#A50044] text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50"
            
          >
            {textDeny}
          </button>
        </div>
      </div>
    </div>
  );
}