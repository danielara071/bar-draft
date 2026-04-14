import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Countdown from '../../shared/components/Countdown'
import { SecondaryButton } from '../../shared/components/Buttons';
import Noticias from '../../shared/components/Noticias'
import useSession from "../../shared/hooks/useSession"
import { useProfile } from "../../shared/hooks/useProfile"
import catLocked from "../../data/img/catLocked.png"
import catLevel1 from "../../data/img/catLevel1.png"

function LoggedIn() {
    const navigate = useNavigate()
    const session = useSession();
    const profile = useProfile();
    const name = profile?.nombre || session?.user?.user_metadata?.full_name.split(" ")[0];
    const levelXP = 2000;
    const progreso = profile ? ((profile.puntos % levelXP) / levelXP) * 100 : 0;
    const [category, setCategory] = useState<"varonil" | "femenil" | null>(null);
    return (
        <>
            <section className="relative bg-cover bg-center min-h-screen flex items-center justify-center text-center bg-[url('https://www.fcbarcelona.com/photo-resources/2025/11/15/43dcea0d-71dc-414f-9bcc-4e827c927693/JCAG3702.jpg?width=3200&_gl=1*1t7pif5*_gcl_aw*R0NMLjE3NzMzNDE0MTcuQ2p3S0NBand5TW5OQmhCTkVpd0EtS2NndTVneXE2dEVQNGZldjVWZmNwa2dJRGZ0clpiZGxNZTVDZGNwTXo4UkNZUnFWVmZuM19GcW5Sb0NTNGdRQXZEX0J3RQ..*_gcl_dc*R0NMLjE3NzMzNDE0MTcuQ2p3S0NBand5TW5OQmhCTkVpd0EtS2NndTVneXE2dEVQNGZldjVWZmNwa2dJRGZ0clpiZGxNZTVDZGNwTXo4UkNZUnFWVmZuM19GcW5Sb0NTNGdRQXZEX0J3RQ..*_gcl_au*OTk4NjYyNjc0LjE3NzA5MjMxMDM.')]">
                <div className="relative py-5 mt-30 text-white">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-sans tracking-tight">Benvingut {name}!</h2>
                </div>
            </section>

            <div className="relative pt-10 px-4 md:px-8 lg:px-20">
                <div>
                    <div className="flex items-center justify-between my-5">
                        <div>
                            <p className="text-2xl md:text-3xl lg:text-4xl font-sans text-black">
                                <span className="text-black">Tu Nivel </span>
                                <span className="text-brand-crimson">Culé</span>
                            </p>
                            <p className="text-sm md:text-base font-sans text-brand-navy">Nivel {profile?.nivel} de 5</p>
                        </div>
                        <p className="text-6xl md:text-7xl lg:text-8xl font-light text-brand-gray-mid">0{profile?.nivel}</p>
                    </div>

                    <div className="flex items-center justify-between my-20 mx-5">
                        <img src={catLevel1} className="w-32" />
                        <div className="flex-1 mx-8">
                            <p className="text-end px-2 pb-1 text-sm md:text-base font-sans">{profile?.puntos} / {profile ? profile.nivel * levelXP : 0} XP </p>
                            <div className="w-full bg-brand-gray-light rounded-md h-5">
                                <div className="bg-yellow-400 h-5 rounded-md" style={{ width: `${progreso}%` }} />
                            </div>
                            <p className="pt-1 text-sm md:text-base font-sans">
                                <span>Necesitas </span>
                                <span className="text-brand-crimson">{profile ? levelXP - (profile.puntos % levelXP) : 0} XP más </span>
                                <span>para llegar al Nivel {profile ? profile.nivel + 1 : 0}</span>
                            </p>
                        </div>
                        <img src={catLocked} className="w-26" />
                    </div>

                    <div className="flex items-center justify-start gap-20 my-15 mx-15">
                        <div>
                            <p className="text-brand-navy text-3xl md:text-4xl font-bold">{profile?.puntos ?? 0}</p>
                            <p className="text-sm text-brand-gray-mid font-sans">Puntos Totales</p>
                        </div>

                        <div>
                            <p className="text-brand-navy text-3xl md:text-4xl font-bold">{profile?.logros ?? 0}</p>
                            <p className="text-sm text-brand-gray-mid font-sans">Logros</p>
                        </div>

                        <div>
                            <p className="text-brand-navy text-3xl md:text-4xl font-bold">{profile?.predicciones ?? 0}</p>
                            <p className="text-sm text-brand-gray-mid font-sans">Predicciones Acertadas</p>
                        </div>
                    </div>


                </div>

                <div className="flex md:flex-row items-center justify-between mb-10">
                    <p className="text-xl md:text-2xl lg:text-3xl font-sans text-black">Faltan ...</p>
                    <div className="grid grid-cols-2 gap-2 mt-4 md:mt-0">
                        <div className="grid grid-cols-2 gap-1 pt-1">
                            <span className={`material-icons ${category === "varonil" ? "text-brand-crimson" : "text-brand-gray-mid"}`}>
                                sports_soccer
                            </span>
                            <span className={`material-symbols-outlined ${category === "femenil" ? "text-brand-crimson" : "text-brand-gray-mid"}`}>
                                chess_queen
                            </span>
                        </div>
                        <SecondaryButton onClick={() => navigate("/watchpartyHUB")} size="sm">Ver más</SecondaryButton>
                    </div>
                </div>
                <div className="flex justify-center my-15">
                    <Countdown onCategoryLoad={setCategory} />
                </div>
                <div className="flex justify-end mt-10">
                    <p className="text-xl md:text-2xl lg:text-3xl font-sans text-black">... para vernos otra vez</p>
                </div>
                <hr className="mt-15 border-brand-gray-light" />
                <p className="py-10 text-sm md:text-base font-sans text-brand-navy ">Lo Último</p>
                <p className="text-2xl md:text-3xl lg:text-4xl font-sans text-black">
                    <span className="text-black">Noticias del </span>
                    <span className="text-brand-yellow">Club</span>
                </p>
                <div className="relative">
                    <Noticias />
                </div>
            </div>
            <section className="relative h-[500px] md:h-[800px] bg-cover bg-center flex items-center mt-15 items-start justify-start text-center bg-[url('https://www.fcbarcelona.com/photo-resources/2025/05/24/7f4cd67e-658f-431a-bbc0-63ad6f52610b/_GP13348.jpg?width=2400&height=1500')]">
                <div className="relative text-white pt-24 pl-24 md:pt-32 md:pl-80 max-w-xl">
                    <h2 className="text-2xl sm:text-4xl md:text-4xl font-bold mb-4 font-sans tracking-tight text-left">Som Un Equip!</h2>
                </div>
            </section>
        </>
    )
}

export default LoggedIn;