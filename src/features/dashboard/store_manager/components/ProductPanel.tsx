import { useEffect, useState } from "react";
import useProducts from "../hooks/useProducts";
import ProductCard from "./ProductCard";
import SearchBar from "./SearchBar";
import EditProductModal from "./EditProductModal";

const ProductPanel = () => {
  const { products, loading } = useProducts();
  const [toggleModal, setToggleModal] = useState(false);

  useEffect(() => {
    console.log(products);
  }, [products]);

  return (
    <div className="border border-slate-200 rounded-2xl bg-brand-white p-5 mt-4 min-h-52 flex flex-col">
      <SearchBar />
      <div className="mt-5 flex flex-col gap-y-5 h-140 overflow-y-auto">
        {products.map((item, _) => (
          <ProductCard
            key={item.id}
            name={item.name}
            image_url={item.image_url}
            price={item.price}
            premium={item.premium}
            category={item.categories.name}
            onEdit={() => setToggleModal((prev) => !prev)}
          />
        ))}
        { toggleModal &&
          <EditProductModal
            toggleCard={() => setToggleModal((prev) => !prev)}
          />
        }
      </div>
    </div>
  );
};

export default ProductPanel;
