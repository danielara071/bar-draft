import ProductPanel from "../store_manager/components/ProductPanel";

const StoreManager = () => {
  return (
    <div className="flex flex-col">
      <div className="py-10 px-5 flex md:flex-row items-center justify-between">
        <p className="text-2xl md:text-3xl lg:text-4xl font-sans text-black">
          <span className="text-black">Gestión de </span>
          <span className="text-brand-yellow">Tienda</span>
        </p>
      </div>
      <ProductPanel/>
    </div>
  );
};

export default StoreManager;
