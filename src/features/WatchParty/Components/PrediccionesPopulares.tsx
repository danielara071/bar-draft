type PredictionItem = {
  label: string;
  value: string;
};

type PrediccionesPopularesProps = {
  title: string;
  predictions: PredictionItem[];
};

const PrediccionesPopulares = ({
  title,
  predictions,
}: PrediccionesPopularesProps) => {
  return (
    <div className="bg-brand-white rounded-3xl p-7 w-full">
      <h3 className="text-h2 text-brand-black font-bold mb-4">{title}</h3>

      <div className="divide-y divide-brand-gray-light">
        {predictions.map((item) => (
          <div
            key={item.label}
            className="py-4 flex items-center justify-between gap-4"
          >
            <p className="text-body text-brand-gray-mid">{item.label}</p>
            <p className="text-body text-brand-crimson font-semibold text-right">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrediccionesPopulares;
