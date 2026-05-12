import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";


// interface Article {
//   category: string;
//   title: string;
//   description: string;
//   image: string;
// }

interface Article {
  id: string;
  guid: string;
  title: string;
  description: string;
  image_url: string;
  link: string;
  pub_date: string;
}

export default function Noticias() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from("news_articles")
        .select("*")
        .order("pub_date", { ascending: false })
        .limit(4); // 2 masculino + 2 femenino (already inserted)

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

interface NewsCardProps {
  article: Article;
}

function NewsCard({ article }: NewsCardProps) {
  const [imgBroken, setImgBroken] = useState(false);

  return (
     <a href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col no-underline text-inherit"
    >
      <hr className="mb-10 border-brand-gray-light" />

      <div className="h-64 md:h-72 lg:h-80 overflow-hidden">
        {article.image_url && !imgBroken ? (
          <img
            src={article.image_url}
            alt={article.title}
            onError={() => setImgBroken(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src="https://pbs.twimg.com/media/GxwEjq0XIAALuQp.jpg"
            alt={article.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="pt-3">
        <h2 className="text-sm md:text-base font-normal m-0 leading-tight">
          {article.title}
        </h2>
      </div>
    </a>
  
  );
}

