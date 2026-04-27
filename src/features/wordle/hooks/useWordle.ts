import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";

function getCoins(guesses: number): number {
    const coins: Record<number, number> = {
        1:6, 2:5, 3:4, 4:3, 5:2, 6:1
    };
    return coins[guesses] ?? 0;
}

export function useWordle() {
    const [guesses, setGuesses] = useState<string[]>([]);
    const [dailyWord, setDailyWord] = useState("");
    const [status, setStatus] = useState<"in_progress" | "won" | "lost">("in_progress");
    const [loading, setLoading] = useState(true);

    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        async function load() {
            const {data: daily} = await supabase
            .from("wordle_words")
            .select("word")
            .eq("used_on", today)
            .single();

            if (!daily) {setLoading(false); return;}
            setDailyWord(daily.word);

            const {data: {user}} = await supabase.auth.getUser();
            if (!user) {setLoading(false); return;}

            const { data: session } = await supabase
            .from("wordle_sessions")
            .select("guesses, status")
            .eq("user_id", user.id)
            .eq("date", today)
            .single();

            if(session) {
                setGuesses(session.guesses);
                setStatus(session.status);
            }
            setLoading(false);  
        }
        load();
    }, []);

    async function submitGuess(guess: string) {
        const newGuesses = [...guesses, guess];
        const won = guess === dailyWord;
        const lost = !won && newGuesses.length >= 6;
        const newStatus = won ? "won" : lost ? "lost" : "in_progress";

        setGuesses(newGuesses);
        setStatus(newStatus);

        const {data: {user}} = await supabase.auth.getUser();
        if(!user || !dailyWord) return;

        await supabase
        .from("wordle_sessions")
        .upsert(
            {user_id: user.id, date:today, guesses: newGuesses, status: newStatus},
            {onConflict: "user_id,date"}
        );

        if(won) {
            const { data: sessionData } = await supabase
            .from("wordle_sessions")
            .select("coins_awarded")
            .eq("user_id", user.id)
            .eq("date", today)
            .single();

        if (!sessionData?.coins_awarded) {
            const coins = getCoins(newGuesses.length);

            await supabase.rpc("add_monedas", {
            p_user_id: user.id,
            p_amount: coins,
            });

            await supabase
            .from("wordle_sessions")
            .update({ coins_awarded: true })
            .eq("user_id", user.id)
            .eq("date", today);
            }
        }
    }
    return {guesses, dailyWord, status, loading, submitGuess };
}