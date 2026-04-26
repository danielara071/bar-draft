import React from "react";

type PopUpProps = {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

const PopUp = ({ open, onClose, children }: PopUpProps) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-200" onClick={onClose}>
            <div className="bg-white rounded-lg p-6 shadow max-w-md w-full relative transform transition-all duration-200 scale-100 opacity-100"
                onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

export default PopUp;