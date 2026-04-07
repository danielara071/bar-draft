type InfoCardProps = {
  label: string;
  title: string;
  subtitle: string;
};

const InfoCard = ({ label, title, subtitle }: InfoCardProps) => {
  return (
    <div className="bg-brand-white rounded-3xl p-7 flex-1 min-w-0">
      <p className="text-label tracking-spaced text-brand-gray-mid font-semibold mb-4">
        {label}
      </p>

      <h3 className="text-h2 text-brand-black font-bold mb-2">{title}</h3>

      <p className="text-body text-brand-gray-mid">{subtitle}</p>
    </div>
  );
};

export default InfoCard;
