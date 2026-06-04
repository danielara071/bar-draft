import { Building2, Medal, Trophy, Users } from "lucide-react";
import type { HistoriaEvent } from "./types";

export const historiaEventsFemenil: HistoriaEvent[] = [
  {
    year: "2001",
    title: "Fundación del Equipo",
    description:
      "El FC Barcelona femení inicia su historia oficial, marcando el comienzo de una nueva era en el fútbol femenino.",
    imageSrc:
      "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Balón de fútbol sobre el césped en un entrenamiento",
    icon: Building2,
  },
  {
    year: "2012",
    title: "Primera Copa de la Reina",
    description:
      "Conquista del primer título importante, la Copa de la Reina, estableciendo el dominio del equipo.",
    imageSrc:
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Futbolista golpeando el balón en un estadio",
    icon: Trophy,
  },
  {
    year: "2013",
    title: "Tricampeonato Nacional",
    description:
      "Tres ligas consecutivas demuestran la supremacía del equipo en el fútbol español.",
    imageSrc:
      "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Balón de fútbol apoyado sobre la cancha",
    icon: Medal,
  },
  {
    year: "2019",
    title: "Récord de Asistencia",
    description:
      "El Camp Nou se llena con 60,000 aficionados para un partido del equipo femenil.",
    imageSrc:
      "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Vista panorámica de un estadio de fútbol lleno",
    icon: Users,
  },
];

export const historiaEventsVaronil: HistoriaEvent[] = [
  {
    year: "1899",
    title: "Nacimiento del Club",
    description:
      "La historia comienza con la fundación del FC Barcelona, el punto de partida del trayecto azulgrana masculino.",
    imageSrc:
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Estadio de fútbol visto desde la grada",
    icon: Building2,
  },
  {
    year: "2006",
    title: "Época de consolidación",
    description:
      "El equipo encuentra una base competitiva sólida que abre la puerta a una de las eras más dominantes del club.",
    imageSrc:
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Futbolista conduciendo el balón sobre el césped",
    icon: Trophy,
  },
  {
    year: "2009",
    title: "Triplete histórico",
    description:
      "Una campaña inolvidable marca el comienzo del reconocimiento internacional del club masculino.",
    imageSrc:
      "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Balón de fútbol en el centro del campo",
    icon: Medal,
  },
  {
    year: "2015",
    title: "Dominio global",
    description:
      "El equipo continúa ampliando su historia con títulos y noches memorables en competiciones nacionales e internacionales.",
    imageSrc:
      "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Estadio iluminado en una noche de partido",
    icon: Users,
  },
];
