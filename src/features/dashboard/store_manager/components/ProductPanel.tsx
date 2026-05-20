import { useEffect, useState } from "react";
import useProducts from "../hooks/useProducts";
import ProductCard from "./ProductCard";
import SearchBar from "./SearchBar";
import EditProductModal from "./EditProductModal";
import type { ProductWithCategory } from "../interfaces/productWithCategory";

const ProductPanel = () => {
  const { products, loading, fetchProducts } = useProducts();
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithCategory | null>(null);

  useEffect(() => {
    console.log(products);
  }, [products]);

  return (
    <div className="border border-slate-200 rounded-2xl bg-brand-white p-5 mt-4 min-h-52 flex flex-col">
      <SearchBar />

      <div className="mt-5 flex flex-col gap-y-5 h-140 overflow-y-auto">
        {products.map((item) => (
          <ProductCard
            key={item.id}
            name={item.name}
            image_url={item.image_url}
            price={item.price}
            premium={item.premium}
            category={item.categories.name}
            onEdit={() => {
              setSelectedProduct(item);
            }}
          />
        ))}

        {selectedProduct && (
          <EditProductModal
            toggleCard={() => setSelectedProduct(null)}
            product={selectedProduct}
            onUpdated={async () => {
              await fetchProducts();
              setSelectedProduct(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProductPanel;