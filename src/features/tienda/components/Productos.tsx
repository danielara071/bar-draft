import {useState, useEffect, useRef} from "react";
import ProductoCard from "./ProductoCard";
import prod1 from "@/data/img/imagenbarca.jpg";
import prod2 from "@/data/img/imagenbarca2.jpg";
import prod3 from "@/data/img/imagenbarca3.jpg";
import prod4 from "@/data/img/imagenbarca4.jpg";

const productos = [
    { id: 1, imagen: prod1, categoria: "Rifa de Experiencia", nombre: "Tour por el Camp Nou", precio: "10 Monedas" },
    { id: 2, imagen: prod2, categoria: "Rifa de Viaje", nombre: "Visita al vestuario", precio: "15 monedas" },
    { id: 3, imagen: prod3, categoria: "Insignea Virtual", nombre: "Clase de fútbol", precio: "10 monedas" },
    { id: 4, imagen: prod4, categoria: "Rifa de Experiencia", nombre: "Entrenamiento con el equipo", precio: "5 monedas" }
]

const Productos = () => {
    return (
        <div>
            <div className="w-full h-28 bg-brand-navy" />
            <h1 className=" text-2xl font-bold mt-4 px-20">Tienda FC Barcelona</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6 px-20">
                {productos.map((producto) => (
                    <ProductoCard key={producto.id} producto={producto} />
                ))}
            </div>

        </div>
    );
};

export default Productos;