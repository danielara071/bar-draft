import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Countdown from '../../shared/components/Countdown'
import { PrimaryButton, SecondaryButton } from '../../shared/components/Buttons';
import Noticias from '../../shared/components/Noticias'
import StatCard from '../../shared/components/StatCard'
import InfoCard from '../../shared/components/InfoCard';
import fan from "../../data/img/fanBarca.jpeg"

function LoggedOut() {
    const navigate = useNavigate()
    const [category, setCategory] = useState<"var" | "fem" | null>(null);
    return (
        <>
            <section className="relative bg-cover bg-center min-h-screen flex items-center justify-center text-center bg-[url('https://www.fcbarcelona.com/photo-resources/2025/11/15/43dcea0d-71dc-414f-9bcc-4e827c927693/JCAG3702.jpg?width=3200&_gl=1*1t7pif5*_gcl_aw*R0NMLjE3NzMzNDE0MTcuQ2p3S0NBand5TW5OQmhCTkVpd0EtS2NndTVneXE2dEVQNGZldjVWZmNwa2dJRGZ0clpiZGxNZTVDZGNwTXo4UkNZUnFWVmZuM19GcW5Sb0NTNGdRQXZEX0J3RQ..*_gcl_dc*R0NMLjE3NzMzNDE0MTcuQ2p3S0NBand5TW5OQmhCTkVpd0EtS2NndTVneXE2dEVQNGZldjVWZmNwa2dJRGZ0clpiZGxNZTVDZGNwTXo4UkNZUnFWVmZuM19GcW5Sb0NTNGdRQXZEX0J3RQ..*_gcl_au*OTk4NjYyNjc0LjE3NzA5MjMxMDM.')]">
                <div className="relative py-5 mt-30 text-white">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-sans tracking-tight">Benvinguts al FC Barcelona!</h2>
                </div>
            </section>

            <div className="relative pt-10 px-4 md:px-8 lg:px-20">
                <div className="flex md:flex-row items-center justify-between mb-10">
                    <p className="text-xl md:text-2xl lg:text-3xl font-sans text-black">Faltan...</p>
                    <div className="grid grid-cols-2 gap-2 mt-4 md:mt-0">
                        <div className="grid grid-cols-2 gap-1 pt-1">
                        <span className={`material-icons ${category === "var" ? "text-brand-crimson" : "text-brand-gray-mid"}`}>
                            sports_soccer
                        </span>
                        <span className={`material-symbols-outlined ${category === "fem" ? "text-brand-crimson" : "text-brand-gray-mid"}`}>
                            chess_queen
                        </span>
                        </div>
                        <SecondaryButton onClick={() => navigate("/login")} size="sm">Ver más</SecondaryButton>
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
                <div className="relative flex justify-center my-20">
                    <div className="grid grid-cols-3 justify-between gap-6 md:gap-8 lg:gap-12">
                        <StatCard number="2" text="Equipos" />
                        <StatCard number="124" text="Años de Historia" />
                        <StatCard number="400M+" text="Fans Globales" />
                    </div>
                </div>
                <img src='https://www.fcbarcelona.com/fcbarcelona/photo/2024/03/13/13a9d23d-c41b-4bf1-b6a8-ab5a4dfc3f3c/FCB_Oporto-035.jpg' className="w-full h-auto" />
               <div className="relative flex justify-center my-20">
                <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-brand-crimson">Més Que Un Club</h1>
               </div>
               <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 text-justify">
                <InfoCard icon="globe" title="Desde Cualquier Lugar" description="Vive el Barca sin importar donde estes. " text="Contenido exclusivo, noticias y momentos de todas las disciplinas del club, en tiempo real" />
                <InfoCard icon="joystick" title="Juega y Gana Puntos" text="Participa en trivias, encuestas y minijuegos para acumular puntos que puedes canjear por experiencias únicas dentro del club." />
                <InfoCard icon="trophy" title="Colecciona Trofeos" text="Usa la realidad aumentada para llenar tu vitrina virtual." />
                <InfoCard icon="stadium" title="Aparece en el Camp Nou" text="Canjea tus puntos para que tu video sea transmitido en pantalla durante un partido oficial. Sé parte del espectáculo desde donde estés." />
                </div>
                <hr className="mt-15 pt-15 border-brand-gray-light" />
                <div className="relative flex text-center justify-center flex-col gap-8 mt-15">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-light">Tu Historia Comienza Aquí</h1>
                    <p className="text-xs md:text-sm text-brand-gray-mid">Únete al equipo blaugrana. Participa, interactúa y disfruta de tu club, todo en un mismo lugar.</p>
                    <div className="mt-6">
                        <PrimaryButton onClick={() => navigate("/login")} size="md" className="w-96 md:w-148 lg:w-164">Registrarme</PrimaryButton>
                    </div>
                </div>
                <div className="relative grid grid-cols-2 gap-10 mt-30 ">
                    <img src={fan} className="w-full h-auto" />
                    <div className="flex flex-col gap-10">
                        <hr className="border-brand-gray-light" />
                        <p className="text-1xl md:text-3xl lg:text-4xl font-light">“Era fan del Barça, pero solo del varonil. Entré a Més Que Un Club, me enganché con el equipo femenino, acumulé puntos — y gané un viaje al Camp Nou para verlas en vivo. Nunca lo hubiera imaginado.”</p>
                        <div className="flex flex-col gap-1 leading-tight">
                            <p className="text-sm md:text-md font-medium">Carlos M.</p>
                            <p className="text-xs md:text-sm font-light text-brand-navy">Culé Mexicano</p>
                        </div>
                    </div>
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

export default LoggedOut;