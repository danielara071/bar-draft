type Props = {
    title: string;
    message: React.ReactNode;
    onClose: () => void;
}

const AlertModal = ({ title, message, onClose }: Props) => {
    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-2xl">
                <h2 className="text-2xl font-black text-gray-900 mb-2">{title}</h2>
                <p className="mb-6">{message}</p>
                <button
                    type="button"
                    className="w-full py-3 rounded-xl bg-[#A50044] text-white font-bold"
                    onClick={onClose}
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default AlertModal;