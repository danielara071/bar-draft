import { useState } from "react";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { PrimaryButton, LoginButton } from "./Buttons";

type Team = "men" | "women";

const Links = {
  men: {
    instagram: "https://www.instagram.com/fcbarcelona/",
    x: "https://x.com/FCBarcelona",
    tiktok: "https://www.tiktok.com/@fcbarcelona",
  },
  women: {
    instagram: "https://www.instagram.com/fcbfemeni/",
    x: "https://x.com/FCBfemeni",
    tiktok: "https://www.tiktok.com/@fcbfemeni",
  },
};

export default function Socials() {
  const [team, setTeam] = useState<Team>("men");

  const color = team === "men" ? "text-brand-navy" : "text-brand-crimson";

  const toggleTeam = () => {
    setTeam(team === "men" ? "women" : "men");
  };

  return (
    <div className="flex flex-col items-center my-10">
      <div className="flex gap-20 text-3xl">
        <a
          href={Links[team].instagram}
          target="_blank"
          className={`${color} transform transition duration-200 hover:scale-125 hover:rotate-3`}
        >
          <FaInstagram />
        </a>

        <a
          href={Links[team].x}
          target="_blank"
          className={`${color} transform transition duration-200 hover:scale-125 hover:-rotate-3`}
        >
          <FaXTwitter />
        </a>

        <a
          href={Links[team].tiktok}
          target="_blank"
          className={`${color} transform transition duration-200 hover:scale-125 hover:rotate-6`}
        >
          <FaTiktok />
        </a>
        <div className="flex ml-30">
        {team === "men" ?
        <PrimaryButton onClick={toggleTeam} size="sm">Ver Links Femenil</PrimaryButton> :
        <LoginButton onClick={toggleTeam}  size="sm">Ver Links Varonil</LoginButton>}
      </div>
      </div>
    </div>
  );
}