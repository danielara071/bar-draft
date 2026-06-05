type HistoriaImagenProps = {
  src: string;
  alt: string;
};

const HistoriaImagen = ({ src, alt }: HistoriaImagenProps) => {
  return (
    <div className="group flex h-full min-h-100 overflow-hidden rounded-[2rem] border border-brand-gray-light/70 bg-linear-to-br from-brand-white via-brand-white to-brand-navy/5 p-2 shadow-[0_24px_60px_rgba(15,45,82,0.16)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,45,82,0.2)]">
      <div className="relative h-full min-h-100 w-full overflow-hidden rounded-[1.6rem] bg-brand-white">
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-tr from-brand-navy/10 via-transparent to-brand-crimson/10" />
      </div>
    </div>
  );
};

export default HistoriaImagen;
