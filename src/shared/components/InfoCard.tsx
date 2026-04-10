interface InfoProps {
  icon: string;
  title: string;
  description?: string;
  text: string;
}

function InfoCard({ icon, title, description, text }: InfoProps) {
  return (
    <div className="flex flex-col pt-3">
      <hr className="mb-10 border-gray-200" />
      <div className="flex flex-col gap-2">
        <span className="material-symbols-outlined text-sm md:text-base mb-2">{icon}</span>
        <h2 className="text-sm md:text-base mb-2 font-light">{title}</h2>
        <p className="text-xs md:text-sm text-brand-gray-mid">
          <span className="font-medium">{description}</span>
          {text}
        </p>
      </div>
    </div>
  );
}

export default InfoCard;