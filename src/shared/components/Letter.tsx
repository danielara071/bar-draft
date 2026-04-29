type LetterProps = {
  letter: string;
  bgColor?: string;
  textColor?: string;
};

const Letter = ({ letter, bgColor = "bg-brand-gray-light", textColor = "text-black" }: LetterProps) => {
  return (
    <div className={`flex items-center justify-center w-[54px] h-[54px]  rounded text-3xl font-bold uppercase ${bgColor} ${textColor}`}> {letter}</div>
  );
};

export default Letter;