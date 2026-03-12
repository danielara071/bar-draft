
import { useEffect, useState } from "react";
import { fetchFixtureEvents } from "../services/apifootball";
import type { MatchEvent } from "../interfaces/fixtureEvents";


export function useFixtureEvents(fixtureId: number) {
    const [fixtureEvents, setFixtureEvents] = useState<MatchEvent[]>([]);

    useEffect(() => {
        async function loadFixtureEvents(){
            try{
                const data = await fetchFixtureEvents(fixtureId);
                setFixtureEvents(data.response);
            }
            catch(error){
                console.log(error)
            }
        }

        void loadFixtureEvents();
    }, []);

    return fixtureEvents;
}

