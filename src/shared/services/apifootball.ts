import type { ApiResponse } from "../interfaces/apiResponse";


const API_KEY = import.meta.env.VITE_API_KEY
const base_url = "https://v3.football.api-sports.io"
 // https://v3.football.api-sports.io/fixtures?season=2024&team=529&from=2024-09-00&to=2025-05-00

async function handleResponse<T>(response: Response, defaultMessage: string): Promise<T> {
  if (!response.ok) {
    throw new Error(defaultMessage);
  }

  return response.json() as Promise<T>;
}

export async function fetchPastResults() : Promise<ApiResponse>{
    const url = `${base_url}/fixtures?season=2024&team=529&from=2025-04-05&to=2025-04-12`;
    const response = await fetch(url, {
        headers: {
            "x-apisports-key" : API_KEY
        }
    });

    return handleResponse<ApiResponse>(
        response,
        "No se pudieron cargar los datos"
    );

}


export async function fetchFixtureEvents(fixtureId: number) : Promise<ApiResponse> {

    const url = `${base_url}/fixtures/events?fixture=${fixtureId}`;
    const response = await fetch(url, {
        headers: {
            "x-apisports-key" : API_KEY
        }
    });
    
    return handleResponse<ApiResponse>(response, "Error");
}

