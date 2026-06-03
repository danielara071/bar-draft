import { Building2, Medal, Trophy, Users } from "lucide-react";
import HistoriaTimeline from "../features/nuestraHistoria/components/HistoriaTimeline";
import type { HistoriaEvent } from "../features/nuestraHistoria/types";

const historiaEvents: HistoriaEvent[] = [
	{
		year: "2001",
		title: "Fundación del Equipo",
		description:
			"El FC Barcelona femení inicia su historia oficial, marcando el comienzo de una nueva era en el fútbol femenino.",
		badge: "Primera plantilla profesional formada",
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
		badge: "Inicio de la era dorada",
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
		badge: "3 títulos de liga",
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
		badge: "Récord mundial de asistencia",
		imageSrc:
			"https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80",
		imageAlt: "Vista panorámica de un estadio de fútbol lleno",
		icon: Users,
	},
];

const NuestraHistoria = () => {
	return (
		<div className="min-h-screen bg-[linear-gradient(180deg,rgba(15,45,82,0.03),rgba(255,255,255,0)_240px)]">
			<HistoriaTimeline
				title="Nuestra Historia"
				subtitle="Un viaje a través del tiempo"
				events={historiaEvents}
			/>
		</div>
	);
};

export default NuestraHistoria;

