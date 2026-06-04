type HistoriaInfoProps = {
  year: string;
  title: string;
  description: string;
  align: "left" | "right";
};

const HistoriaInfo = ({
  year,
  title,
  description,
  align,
}: HistoriaInfoProps) => {
  const isLeft = align === "left";

  return (
    <div
      className={`flex h-full min-h-80 flex-col justify-center gap-5 ${
        isLeft ? "text-left md:text-right" : "text-left md:text-left"
      }`}
    >
      <div
        className={`inline-flex w-fit items-center rounded-full bg-brand-crimson px-4 py-2 text-xs font-bold tracking-spaced text-brand-white shadow-[0_12px_30px_rgba(181,23,75,0.2)] ${
          isLeft ? "self-end md:self-end" : "self-start md:self-start"
        }`}
      >
        {year}
      </div>

      <div className="space-y-4 max-w-xl">
        <h3 className="text-2xl font-bold leading-tight text-brand-navy md:text-[2rem]">
          {title}
        </h3>

        <p className="text-[0.95rem] leading-7 text-brand-navy/75">
          {description}
        </p>
      </div>
    </div>
  );
};

export default HistoriaInfo;
