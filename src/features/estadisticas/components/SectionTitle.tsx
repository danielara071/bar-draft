type SectionTitleProps = {
  prefix: string;
  highlight: string;
};

function SectionTitle({ prefix, highlight }: SectionTitleProps) {
  return (
    <h2 className="text-2xl md:text-3xl font-sans  text-black">
      {prefix} <span style={{ color: "#FBBF24" }}>{highlight}</span>
    </h2>
  );
}

export default SectionTitle;
