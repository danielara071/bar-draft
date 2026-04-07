

const Footer = () => {
    return (
        <div className="bg-brand-white py-5 px-4 md:px-8 lg:px-20">
            <div className="flex flex-row gap-8">
                <p className="text-xs font-bold">Términos y Condiciones</p>
                <p className="text-xs font-bold">FAQ</p>
                <p className="text-xs font-bold">Jela'an</p>
            </div>
            <div className="flex flex-row gap-8 py-10">
                <img src="https://upload.wikimedia.org/wikipedia/sco/4/47/FC_Barcelona_%28crest%29.svg" className="w-5 h-5 shrink-0"/>
                <p className="text-xs text-brand-gray-mid">@ Més Que Un Club.</p>
                <p className="text-xs text-brand-gray-mid">2026</p>
                <p className="text-xs text-brand-gray-mid ml-auto">Todos los Derechos Reservados.</p>
            </div>
        </div>
    );
};

export default Footer;