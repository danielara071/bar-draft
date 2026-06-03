type HistoriaImagenProps = {
  src: string;
  alt: string;
};

const HistoriaImagen = ({ src, alt }: HistoriaImagenProps) => {
  return (
    <div className="group overflow-hidden rounded-[2rem] border border-brand-gray-light/70 bg-brand-white p-2 shadow-[0_24px_60px_rgba(15,45,82,0.16)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,45,82,0.2)]">
      <div className="relative overflow-hidden rounded-[1.6rem] bg-brand-gray-light/30">
        <img
          src={src}
          alt={alt}
          className="h-full w-full min-h-[250px] object-cover transition duration-500 group-hover:scale-105 md:min-h-[320px]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-navy/5 via-transparent to-brand-crimson/10" />
      </div>
    </div>
  );
};

export default HistoriaImagen;
