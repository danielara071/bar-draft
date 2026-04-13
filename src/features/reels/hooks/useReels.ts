import { useEffect, useState } from "react";
import { supabase } from "../../../shared/services/supabaseClient";
import type { VideoReel } from "../interfaces/VideoReel";





export function useReels(userId: any) {
    const [videos, setVideos] = useState<VideoReel[]>([]);


    useEffect(() => {
    if (!userId) return;
  
    const fetchVideos = async () => {
        const { data, error } = await supabase
          .from('videos')
          .select(`
            id,
            video_url,
            thumbnail_url,
            caption,
            user_video_actions(liked, user_id, watched)
          `)
          .eq('is_active', true)
          .limit(5);
          

          if (error) {
            console.log(error)
            return;
          }

          const formatted = data.map((video) => {
            const action = video.user_video_actions?.find((a: any) => a.user_id === userId);
            return {
                id: video.id,
                thumbnail_url: video.thumbnail_url,
                video_url: video.video_url,
                caption: video.caption,
                watched: action?.watched ?? false,
                liked: action?.liked ?? false
            }
          })
          setVideos(formatted);
    }
    fetchVideos();
    },[userId])

    const reelWatched = async (videoId: string) => {

      setVideos( 
            (prev) => prev.map(v => v.id === videoId ? {...v, watched: true} : v)
        );

        await supabase.from('user_video_actions').upsert({
        user_id: userId,
        video_id: videoId,
        watched: true
        });
    }

    const toggleLike = async (videoId: string) => {
        let newLike: boolean | undefined;
        setVideos( 
            (prev) => prev.map(v => {
              if (v.id === videoId){
                newLike = !v.liked;
                return {...v, newLike }
              }
              return v;
            }
        ));

        await supabase.from('user_video_actions').upsert({
        user_id: userId,
        video_id: videoId,
        liked: newLike
        });
}
    
    return {videos, toggleLike, reelWatched};
}