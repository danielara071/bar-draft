import { useEffect, useState } from "react";
import type { AdminReel } from "../interfaces/AdminReel";
import { supabase } from "../../../shared/services/supabaseClient";



export function useReelsAdmin(){
    const [videos, setVideos] = useState<AdminReel[]>([]);

    useEffect(() => {
        const fetchVideos = async () => {
            const {data, error} = await supabase.from('videos')
          .select(`
            id,
            video_url,
            thumbnail_url,
            caption,
            duration, 
            category, 
            order_index, 
            is_active,
            created_at
          `)
          .limit(20);

          if (error){
            console.log(error)
            return;
          }

          setVideos(data)
        }
        fetchVideos();
    }, [])

    return {videos}
}

