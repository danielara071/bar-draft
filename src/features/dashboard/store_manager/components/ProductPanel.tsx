import ProductCard from "./ProductCard";
import SearchBar from "./SearchBar";

const ProductPanel = () => {
  return (
    <div className="border border-slate-200 rounded-2xl bg-brand-white p-5 mt-4 min-h-52 flex flex-col">
      <SearchBar />
      <div className="mt-5">
        <ProductCard
          name="Insignia de Hincha Legendario"
          image_url="https://vsywrimuzdnfyztreolz.supabase.co/storage/v1/object/sign/productos/hinchalegendario.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85YjVhN2I1MC1iNThkLTRkMzEtOTJiZS1jMWRjNjdmZjY5MGYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwcm9kdWN0b3MvaGluY2hhbGVnZW5kYXJpby5qcGciLCJpYXQiOjE3NzY3MTczMTMsImV4cCI6MTgwODI1MzMxM30.G8LyoqVS0MGTgGb09ycXL80IkA0txhm_z4KgxMK4OH4"
          price={10}
          premium={true}
        />
      </div>
    </div>
  );
};

export default ProductPanel;
