import { useState } from "react";
import News from "../components/News";
import { LoginButton } from "@/shared/components/Buttons";
import { supabase } from "@/lib/supabase";
import ConfirmationPopup from "../components/ConfirmationPopUp";


export default function NewsManagerPage() {
    const [refreshKey, setRefreshKey]= useState(0);
    const [popup, setPopup] = useState<{message: string; success: boolean;} | null>(null);

    const refreshNews = () => {
        setRefreshKey(prev => prev + 1);
    };

    const fetchNews = async() => {
        const { error } = await supabase.functions.invoke('fetch-news')
        if (error) {
            setPopup({ message: 'Error al actualizar las noticias!', success: false });
            return;
        }

        refreshNews();

        setPopup({ message: 'Noticias actualizadas correctamente!', success: true });
    };

    return (
       <>
       <div className="py-10 px-5 flex md:flex-row items-center justify-between">
            <p className="text-2xl md:text-3xl lg:text-4xl font-sans text-black">
                <span className="text-black">Gestión de </span>
                <span className="text-brand-yellow">Noticias</span>
            </p>
            <LoginButton  onClick={fetchNews} size="sm">Actualizar API</LoginButton>
        </div>
       <News refetchTrigger={refreshKey} onRefetch={refreshNews}/>
        {popup && (
            <ConfirmationPopup
                message={popup.message}
                success={popup.success}
                onClose={() => {
                setPopup(null);
                }}
            />
        )}
       </> 
    );
};
