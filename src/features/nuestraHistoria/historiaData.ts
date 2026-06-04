import {Medal, Trophy, Calendar1, BadgePlus, Table, Crown, Earth, ScissorsLineDashed, Star } from "lucide-react";
import type { HistoriaEvent } from "./types";

export const historiaEventsFemenil: HistoriaEvent[] = [
  {
    year: "1970",
    title: "Primer partido histórico",
    description:
      "El 25 de diciembre de 1970, el FC Barcelona femenino disputa su primer partido en el Camp Nou frente a la UE Centelles, ante 60,000 espectadores, dando inicio a la sección femenina.",
    imageSrc:
      "/timeline/femenil/primerPartido.webp",
    imageAlt: "Balón de fútbol sobre el césped en un entrenamiento",
    icon: Calendar1,
  },
  {
    year: "1994",
    title: "Primer título oficial",
    description:
      "El Club Femenino Barcelona gana su primera Copa de la Reina al derrotar 2–1 al Oroquieta Villaverde en Las Rozas, con goles de Olga y África, obteniendo su primer título oficial.",
    imageSrc:
      "/timeline/femenil/primerTitulo.webp",
    imageAlt: "Futbolista golpeando el balón en un estadio",
    icon: Medal,
  },
  {
    year: "2002",
    title: "Integración oficial como sección",
    description:
      "El 26 de junio de 2002, el Club Femenino Barcelona se integra oficialmente como sección del FC Barcelona, convirtiéndose en FC Barcelona Femenino y adhiriéndose plenamente a la estructura del club.",
    imageSrc:
      "/timeline/femenil/integracionOficial.webp",
    imageAlt: "Balón de fútbol apoyado sobre la cancha",
    icon: BadgePlus,
  },
  {
    year: "2012",
    title: "Primera Liga de la historia",
    description:
      "El Barça Femení conquista su primera Liga (Primera Iberdrola) tras una dura lucha con el Athletic Club, iniciando una era de hegemonía nacional.",
    imageSrc:
      "/timeline/femenil/victoriaLiga.webp",
    imageAlt: "Vista panorámica de un estadio de fútbol lleno",
    icon: Table,
  },
  {
    year: "2021",
    title: "Primera Champions y triplete",
    description:
      "El 16 de mayo de 2021, el Barça Femení gana su primera Champions League en Gotemburgo, derrotando 4–0 al Chelsea, y completa el triplete (Liga, Copa y Champions), siendo el primer club español en lograrlo.",
    imageSrc:
      "/timeline/femenil/primeraChampions.webp",
    imageAlt: "Jugadoras celebrando una victoria en el campo",
    icon: Crown,
  },
  {
    year: "2023–2024",
    title: "Cuadruplete y reconocimiento mundial",
    description:
      "Con Jonatan Giráldez, el equipo gana cuadruplete (Liga, Copa, Supercopa y Champions), rompiendo récords de victorias consecutivas y siendo reconocido como el mejor club femenino del mundo por France Football e IFFHS por segundo año consecutivo.",
    imageSrc:
      "/timeline/femenil/cuadruplete.webp",
    imageAlt: "Estadio iluminado durante un partido nocturno",
    icon: Earth,
  },
];

export const historiaEventsVaronil: HistoriaEvent[] = [
  {
    year: "1899",
    title: "Fundación del club",
    description:
      "El 29 de noviembre de 1899, Hans Gamper convoca a aficionados al fútbol en el Gimnasio Solé y funda el Foot-Ball Club de Barcelona. Se adoptan los colores azulgrana y el escudo de la ciudad, dando inicio a una de las instituciones deportivas más importantes del mundo.",
    imageSrc:
      "/timeline/varonil/fundador.webp",
    imageAlt: "Estadio de fútbol visto desde la grada",
    icon: Calendar1,
  },
  {
    year: "1929",
    title: "Primer campeón de Liga",
    description:
      "El Barcelona se convierte en el primer campeón de la historia de la Liga española tras ganar la primera edición del Campeonato de Liga, superando al Real Madrid en la última jornada.",
    imageSrc:
      "/timeline/varonil/primerCampeonLiga.webp",
    imageAlt: "Futbolista conduciendo el balón sobre el césped",
    icon: Medal,
  },
  {
    year: "1952",
    title: "Les 5 Copes",
    description:
      "Bajo la conducción de Kubala, el Barça gana Liga, Copa, Copa Latina, Copa Eva Duarte y Copa Martini & Rossi en una sola temporada, consolidando su primera gran época dorada.",
    imageSrc:
      "/timeline/varonil/les5Copes.webp",
    imageAlt: "Balón de fútbol en el centro del campo",
    icon: Trophy,
  },
  {
    year: "1957",
    title: "Inauguración del Camp Nou",
    description:
      "El 24 de septiembre de 1957 se inaugura el Camp Nou, el estadio más grande de Europa, que se convierte en el hogar emblemático del club y multiplica su masa social.",
    imageSrc:
      "/timeline/varonil/inauguracionCampNou.webp",
    imageAlt: "Estadio iluminado en una noche de partido",
    icon: ScissorsLineDashed,
  },
  {
    year: "1992",
    title: "Primera Champions League",
    description:
      "El Dream Team de Johan Cruyff gana la primera Copa de Europa en Wembley con un gol de Ronald Koeman en la prórroga contra la Sampdoria, marcando un antes y un después en la historia del club.",
    imageSrc:
      "/timeline/varonil/primeraChampions (1).webp",
    imageAlt: "Equipo celebrando en un estadio europeo",
    icon: Star,
  },
  {
    year: "2009",
    title: "Sextete histórico",
    description:
      "Bajo Pep Guardiola, el Barcelona se convierte en el primer club en ganar el sextete: Liga, Copa, Champions, Supercopa de España, Supercopa de Europa y Mundial de Clubes, consolidando el tiki-taka como marca global.",
    imageSrc:
      "/timeline/varonil/sextete.webp",
    imageAlt: "Balón de fútbol apoyado sobre la cancha",
    icon: Crown,
  },
];
