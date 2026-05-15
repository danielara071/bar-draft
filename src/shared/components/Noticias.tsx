import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import NewsCard from "../components/NewsCard";
import type { Article } from "../components/NewsCard";

export default function Noticias() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from("selected_articles")
        .select("*")
        .order("pub_date", { ascending: false })
        .limit(4); 

      if (error) throw error;

      setArticles(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchNews();
}, []);

  if (loading) return <p className="text-center py-8">Cargando noticias…</p>;
  if (error)   return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-7 p-5 md:p-6">
      {articles.map((article, i) => (
        <NewsCard key={i} article={article} />
      ))}
    </div>
  );
}

