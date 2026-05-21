import { useEffect, useState } from "react";
import type { ProductWithCategory } from "../interfaces/productWithCategory";
import { supabase } from "@/shared/services/supabaseClient";

export default function useProducts() {
    const [products, setProducts] = useState<ProductWithCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchProducts = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from("products")
            .select(`
                *,
                categories(id, name)
            `)
            .order("id");

        if (error) {
            console.log(error);
            setLoading(false);
            return;
        }

        setProducts(data as ProductWithCategory[]);
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return { products, loading, fetchProducts };
}