type HistoriaInfoProps = {
  year: string;
  title: string;
  description: string;
  badge: string;
  align: "left" | "right";
};

const HistoriaInfo = ({ year, title, description, badge, align }: HistoriaInfoProps) => {
  const isLeft = align === "left";

  return (
    <div
      className={`order-1 flex flex-col gap-5 ${
        isLeft
          ? "md:col-start-1 md:justify-self-end md:text-right"
          : "md:col-start-3 md:justify-self-start md:text-left"
      }`}
    >
      <div
        className={`inline-flex w-fit items-center rounded-full bg-brand-crimson px-4 py-2 text-xs font-bold tracking-spaced text-brand-white shadow-[0_12px_30px_rgba(181,23,75,0.2)] ${
          isLeft ? "md:self-end" : "md:self-start"
        }`}
      >
        {year}
      </div>

      <div className="space-y-4 max-w-xl">
        <div
          className={`inline-flex items-center gap-2 rounded-full bg-brand-crimson/10 px-4 py-2 text-xs font-semibold text-brand-crimson ${
            isLeft ? "md:ml-auto" : ""
          }`}
        >
          {badge}
        </div>

        <h3 className="text-2xl md:text-[2rem] leading-tight font-bold text-brand-navy">
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
