import {useState} from "react";

const ProductoCard = ({producto}: {producto: {id: number, imagen: string, categoria: string, nombre: string, precio: string}}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className="bg-white rounded-lg shadow-md overflow-hidden py-10"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img src={producto.imagen} alt={producto.nombre} className="w-full h-48 object-cover" />

            <div className="p-4">
                <p className="text-gray-600">{producto.categoria}</p>
                <h2 className="text-lg font-bold">{producto.nombre}</h2>
                <p className="text-xl font-bold text-[#A50044]">{producto.precio}</p>
            </div>

            <div className="absolote inset-0 px-10 flex items-center justify-center">
            <button className="text-xl bg-[#A50044] text-white font-bold px-10 py-3 rounded-xl hover:bg-[#A50044]/90 transition-colors duration-200"
            onClick={()=>alert('Comprando')}
            >
                Comprar
            </button>
            </div>
        </div>
    );
};

export default ProductoCard;
