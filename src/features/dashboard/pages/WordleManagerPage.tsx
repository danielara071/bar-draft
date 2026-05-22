import ActiveWordCard from "../components/wordle/ActiveWordCard";
import AddWordCard from "../components/wordle/AddWordCard";
import ProgrammedWords from "../components/wordle/ProgrammedWords";
import StatsCard from "../components/wordle/StatsCard";
import UsedWords from "../components/wordle/UsedWords";
import { useCallback, useState } from "react";

export default function WordleManagerPage() {
    const [refreshKey, setRefreshKey] = useState(0);
  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);

    return (
        <>
         <div className="py-10 px-5 flex">
            <p className="text-2xl md:text-3xl lg:text-4xl font-sans font-bold">
               <span className="text-brand-navy">Palabras </span>
               <span className="text-brand-yellow">Wordle</span>
            </p>
        </div>

        <AddWordCard onAdded={refresh}/>
        <ActiveWordCard />
        <StatsCard />
        <div className="flex flex-row gap-4">
            <div className="flex flex-col flex-1">
                <ProgrammedWords key={refreshKey} />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
                <UsedWords />
            </div>
        </div>
        </>
    )

}