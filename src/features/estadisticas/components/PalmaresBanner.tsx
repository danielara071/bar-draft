function PalmaresBanner({ count, label }: { count: number; label: string }) {
  return (
    <article
      className="rounded-2xl px-4 py-5 md:px-6 md:py-6 text-center shadow-md"
      style={{
        background: "linear-gradient(180deg, #0A1D3A 0%, #9B2743 100%)",
      }}
    >
      <p className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: "#D4A017" }}>
        {count}
      </p>
      <p className="mt-1 text-xl md:text-base font-medium text-white">{label}</p>
    </article>
  );
}

export default PalmaresBanner;
