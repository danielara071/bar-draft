import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import useProducts from "../hooks/useProducts";
import ProductCard from "./ProductCard";
import SearchBar from "./SearchBar";
import EditProductModal from "./EditProductModal";
import CreateProductModal from "./CreateProductModal";
import PopUp from "./PopUp";
import type { ProductWithCategory } from "../interfaces/productWithCategory";
import { supabase } from "@/shared/services/supabaseClient";

const ProductPanel = () => {
  const { products, fetchProducts } = useProducts();
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithCategory | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [productToDelete, setProductToDelete] =
    useState<ProductWithCategory | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [popup, setPopup] = useState<{
    message: string;
    success: boolean;
  } | null>(null);

  const filteredProducts = products.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.categories.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productToDelete.id);

    setDeleting(false);
    setProductToDelete(null);

    if (error) {
      setPopup({ message: "Error al eliminar el producto.", success: false });
    } else {
      await fetchProducts();
      setPopup({ message: "Producto eliminado correctamente.", success: true });
    }
  };

  return (
    <section className="mt-6 min-h-[32rem] rounded-[28px] bg-[#f4f6f9]">
      {popup && (
        <PopUp
          message={popup.message}
          success={popup.success}
          onClose={() => setPopup(null)}
        />
      )}


      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center">
        <SearchBar value={search} onChange={setSearch} />

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#EDBB00] px-5 text-sm font-bold text-[#0d2b4d] transition hover:bg-[#d4a800] hover:cursor-pointer active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
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

      <div className="flex max-h-[65vh] flex-col gap-3 overflow-y-auto pr-1">
        {filteredProducts.map((item) => (
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

        {filteredProducts.length === 0 && (
          <div className="rounded-[24px] border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
            <p className="text-sm font-semibold text-slate-600">
              No se encontraron productos
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Intenta con otro término de búsqueda.
            </p>
          </div>
        )}

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d2b4d]/45 backdrop-blur-sm">
          <div className="flex w-full max-w-sm flex-col items-center gap-5 rounded-[28px] bg-white p-8 shadow-2xl">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#a50044]/10">
              <Trash2 className="h-7 w-7 text-[#a50044]" strokeWidth={1.8} />
            </div>

            <div className="text-center">
              <h2 className="text-xl font-bold text-[#0d2b4d]">
                ¿Eliminar producto?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Estás a punto de eliminar{" "}
                <span className="font-semibold text-[#0d2b4d]">
                  {productToDelete.name}
                </span>
                . Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="flex w-full gap-3">
              <button
                onClick={() => setProductToDelete(null)}
                disabled={deleting}
                className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-2xl bg-[#a50044] py-3 text-sm font-bold text-white transition hover:bg-[#870038] disabled:opacity-50"
              >
                {deleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductPanel;