import { useState, useEffect } from "react";

interface Article {
  category: string;
  title: string;
  description: string;
  image: string;
}

export default function Noticias() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/rss/cat/masculino").then((r) => r.text()),
      //fetch("/rss/last-posts").then((r) => r.text()),
      fetch("/rss/cat/femenino").then((r) => r.text()),
    ])
      .then(([varXml, femXml]) => {
        const varArticles   = parseRss(varXml,  "masculino").slice(0, 2);
        const femArticles = parseRss(femXml, "femenino").slice(0, 2);

        setArticles([...varArticles, ...femArticles]);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
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
     <div className="flex flex-col">
      <hr className="mb-10 border-brand-gray-light" />

      <div className="h-64 md:h-72 lg:h-80 overflow-hidden">
        {article.image && !imgBroken ? (
          <img
            src={article.image}
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
        <p className="text-xs md:text-sm text-gray-500 mt-1.5 mb-0">
          {article.description}
        </p>
      </div>
    </div>
  );
}

function parseRss(xml: string, category: string): Article[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "application/xml");

  return Array.from(doc.querySelectorAll("item")).map((item): Article => {
    const rawDesc = item.querySelector("description")?.textContent ?? "";
    const imgMatch = rawDesc.match(/<img[^>]+src=["']([^"']+)["']/i);
    const image =
      item.querySelector("enclosure")?.getAttribute("url") ??
      item.querySelector("content")?.getAttribute("url")  ??
      imgMatch?.[1] ??
      "";

    return {
      category,
      title:       item.querySelector("title")?.textContent?.trim() ?? "",
      description: rawDesc.replace(/<[^>]*>/g, "").trim().slice(0, 200),
      image,
    };
  });
}