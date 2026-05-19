import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import NewsCardEditor from "./NewsCardEditor";
import type { Article } from "@/shared/components/NewsCard";
import ArticleCounter from "./ArticleCounter";
import ConfirmationPopup from "../ConfirmationPopUp";

interface NewsProps {
    refetchTrigger: number;
    onRefetch: () => void;
}

export default function News({ refetchTrigger, onRefetch }: NewsProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [popup, setPopup] = useState<{ message: string; success: boolean } | null>(null);  
  
  const fetchArticles = async () => {
      const { data, error } = await supabase
        .from("news_articles")
        .select("*")
        .order("pub_date", { ascending: false })
        .limit(32); 
      
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setArticles(data || []);
      setLoading(false);
  };

  useEffect(() => {
    fetchArticles();
    }, [refetchTrigger]);

  const toggleSelect = (id: string) => {
      setSelectedIds(prev => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          if (next.size >= 4) return prev;
            next.add(id);
        }
        return next;
      });
   };

  const saveSelection = async () => {
    const selected = articles.filter(a => selectedIds.has(a.id));
        if (selected.length === 0) return;

        setSaving(true);

        const { error: deleteError } = await supabase
            .from('selected_articles')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); 

        if (deleteError) {
            console.error('Error borrando articulos:', deleteError);
            setSaving(false);
            return;
        }

        const toInsert = selected.map(a => ({
            title: a.title,
            link: a.link,
            description: a.description,
            image_url: a.image_url,
            pub_date: a.pub_date,
        }));

        const { error: insertError } = await supabase
            .from('selected_articles')
            .insert(toInsert);

        if (insertError) {
            setPopup({ message: 'Error al guardar la selección!', success: false });    } 
        else {
            setPopup({ message: 'Selección guardada correctamente!', success: true });
        }

        setSaving(false);
    };

  if (loading) return <p className="text-center py-8">Cargando noticias…</p>;
  if (error)   return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <>
    <ArticleCounter count={selectedIds.size} onSave={saveSelection} onClear={() => setSelectedIds(new Set())} saving={saving} />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-7 p-5 md:p-6">
      {articles.map((article, i) => (
        <NewsCardEditor key={i} article={article} isSelected={selectedIds.has(article.id)} onToggle={() => toggleSelect(article.id)} onEdited={onRefetch}/>
      ))}
    </div>
    
    {popup && (
        <ConfirmationPopup message={popup.message} success={popup.success} onClose={() => setPopup(null)} />
    )}

    </>
  );
}

