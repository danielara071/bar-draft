import { useEffect, useState } from "react";
import useProducts from "../hooks/useProducts";
import ProductCard from "./ProductCard";
import SearchBar from "./SearchBar";
import EditProductModal from "./EditProductModal";
import type { ProductWithCategory } from "../interfaces/productWithCategory";
import CreateProductModal from "./CreateProductModal";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/shared/services/supabaseClient";

const ProductPanel = () => {
  const { products, loading, fetchProducts } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<ProductWithCategory | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductWithCategory | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    console.log(products);
  }, [products]);

  const handleDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productToDelete.id);

    if (!error) {
      await fetchProducts();
    }
    setDeleting(false);
    setProductToDelete(null);
  };

  return (
    <div className="border border-slate-200 rounded-2xl bg-brand-white p-5 mt-4 min-h-52 flex flex-col relative">
      <div className="flex flex-row gap-x-20">
        <SearchBar />
        <button
          onClick={() => setShowCreateModal(true)}
          className="rounded-xl bg-[#EDBB00] px-5 py-2 font-semibold text-white transition flex flex-row justify-center items-center gap-x-3 mr-1 hover:cursor-pointer"
        >
          <Plus />
          Agregar
        </button>
      </div>

      {showCreateModal && (
        <CreateProductModal
          toggleCard={() => setShowCreateModal(false)}
          onCreated={async () => {
            await fetchProducts();
            setShowCreateModal(false);
          }}
        />
      )}

      <div className="mt-5 flex flex-col gap-y-5 h-140 overflow-y-auto">
        {products.map((item) => (
          <ProductCard
            key={item.id}
            name={item.name}
            image_url={item.image_url}
            price={item.price}
            premium={item.premium}
            category={item.categories.name}
            onEdit={() => setSelectedProduct(item)}
            onDelete={() => setProductToDelete(item)}
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

      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl flex flex-col items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <Trash2 className="h-8 w-8 text-red-600" strokeWidth={1.8} />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-[#0d2b4d]">
                ¿Eliminar producto?
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Estás a punto de eliminar{" "}
                <span className="font-semibold text-slate-700">
                  {productToDelete.name}
                </span>
                . Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex w-full gap-3">
              <button
                onClick={() => setProductToDelete(null)}
                disabled={deleting}
                className="flex-1 rounded-xl border border-slate-200 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPanel;
