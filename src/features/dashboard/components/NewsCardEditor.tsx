import { useState } from "react";
import { LuPencil } from "react-icons/lu";
import { GoCheck } from "react-icons/go";
import { SecondaryButton, LoginButton } from "@/shared/components/Buttons";
import EditArticleModal from "./EditArticleModal";

export interface Article {
  id: string;
  guid: string;
  title: string;
  description: string;
  image_url: string;
  link: string;
  pub_date: string;
}

interface NewsCardEditorProps {
  article: Article;
  isSelected: boolean;
  onToggle: () => void;
  onEdited: () => void;
}

export default function NewsCardEditor({ article, isSelected, onToggle, onEdited }: NewsCardEditorProps) {
  const [imgBroken, setImgBroken] = useState(false);
  const [edit, setEdit] = useState(false);
  const [currArticle, setCurrArticle] = useState(article)

  const handleSave = (updated: Partial<Article>) => {
    setCurrArticle(prev => ({ ...prev, ...updated }));
  };

  return (
     <div
      className="flex h-full flex-col no-underline text-inherit"
    >
      <hr className="mb-10 border-brand-gray-light" />

      <div className="h-64 md:h-72 lg:h-80 overflow-hidden relative">
        {currArticle.image_url && !imgBroken ? (
          <img
            src={currArticle.image_url}
            alt={currArticle.title}
            onError={() => setImgBroken(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src="https://pbs.twimg.com/media/GxwEjq0XIAALuQp.jpg"
            alt={currArticle.title}
            className="w-full h-full object-cover"
          />
        )}
       
        <button className=" absolute top-0 left-0 bg-white rounded-full p-2 m-2" onClick={() => setEdit(true)}> <LuPencil className="text-brand-navy" /> </button>
        {isSelected ? (<button className=" absolute top-0 right-0 bg-brand-navy rounded-full p-2 m-2" onClick={() => console.log("edit")}> <GoCheck className="text-brand-white" /> </button>) : <div></div>}
      </div>

      <div className="flex flex-1 flex-col">
      <div className="pt-3">
        <h2 className="text-sm md:text-base font-normal m-0 leading-tight">
          {currArticle.title}
        </h2>
      </div>

      <div className="pt-3">
        <h2 className="text-brand-gray-mid text-xs font-normal m-0 leading-tight">
          {currArticle.description}
        </h2>
      </div>
      </div>
      
      {isSelected ? (
        <LoginButton className="my-5" onClick={onToggle} size="sm">
          Seleccionado
        </LoginButton>
      ) : (
        <SecondaryButton className="my-5" onClick={onToggle} size="sm">
          Seleccionar
        </SecondaryButton>
      )}

      {edit ? (
      <EditArticleModal article={currArticle} onClose={() => setEdit(false)} onSave={(updated) => {handleSave(updated); onEdited();}} />) : (<div></div>)}

    </div>
  );
}
