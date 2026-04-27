import type { ReactNode } from "react";
import type { TeamType } from "../types";

const MALE_BG = "#0A1D3A";
const FEMALE_BG = "#9B2743";

type CardProps = {
  teamType: TeamType;
  children: ReactNode;
};

function TeamCard({ teamType, children }: CardProps) {
  const bg = teamType === "male" ? MALE_BG : FEMALE_BG;
  return (
    <article
      className="rounded-3xl p-5 md:p-6 text-white shadow-lg"
      style={{ backgroundColor: bg }}
    >
      {children}
    </article>
  );
}

export default TeamCard;
