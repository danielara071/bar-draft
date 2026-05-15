import { useState } from "react";

export interface Article {
  id: string;
  guid: string;
  title: string;
  description: string;
  image_url: string;
  link: string;
  pub_date: string;
}

interface NewsCardProps {
  article: Article;
}

export default function NewsCard({ article }: NewsCardProps) {
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

      <div className="pt-3">
        <h2 className="text-brand-gray-mid text-xs font-normal m-0 leading-tight">
          {article.description}
        </h2>
      </div>
      
    </a>
  );
}
