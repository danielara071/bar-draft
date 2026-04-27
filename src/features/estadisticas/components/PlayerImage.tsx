function PlayerImage({ src, alt }: { src: string | null; alt: string }) {
  return (
    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br  p-1">
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover rounded-xl"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full rounded-xl bg-black/20 flex items-center justify-center text-sm text-white/80">
          Sin imagen
        </div>
      )}
    </div>
  );
}

export default PlayerImage;
