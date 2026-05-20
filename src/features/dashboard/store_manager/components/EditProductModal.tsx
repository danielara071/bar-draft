

interface EditProductModalProps {
    toggleCard: () => void;
}

const EditProductModal = ({toggleCard} : EditProductModalProps) => {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4"
      onClick={() => {
        toggleCard();
      }}
    >
      <div
        className="relative z-50 w-full max-w-4xl rounded-2xl bg-brand-white p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      ></div>
    </div>
  );
};

export default EditProductModal;
