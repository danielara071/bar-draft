import { useEffect, useState } from "react";

type PredictionItem = {
  label: string;
  value: string;
};

type PredictionsPayload = {
  predictions?: PredictionItem[];
};

const fallbackPredictions: PredictionItem[] = [
  { label: "Equipo con más probabilidad", value: "Sin dato disponible" },
  { label: "Marcador estimado", value: "Sin marcador estimado" },
  { label: "Probabilidad de empate", value: "Sin dato disponible" },
];

export const useMatchPredictions = () => {
  const [predictions, setPredictions] = useState<PredictionItem[]>(fallbackPredictions);

  const getPredictions = async () => {
    try {
      const response = await fetch("/api/watchparty/predictions");
      const data = (await response.json()) as PredictionsPayload & { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Error fetching predictions");
      }

      if (Array.isArray(data.predictions) && data.predictions.length > 0) {
        setPredictions(data.predictions.slice(0, 3));
        return;
      }

      setPredictions(fallbackPredictions);
    } catch (error) {
      console.error(error);
      setPredictions(fallbackPredictions);
    }
  };

  useEffect(() => {
    void getPredictions();

    const intervalId = setInterval(() => {
      void getPredictions();
    }, 600000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return { predictions };
};
