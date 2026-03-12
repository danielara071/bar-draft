interface GridProps {
  guesses: string[];
  currentGuess: string;
}

const ROWS = 6;
const COLS = 5;

const Grid = ({ guesses, currentGuess }: GridProps) => {
  const allGuesses = [...guesses];
  if (currentGuess) allGuesses.push(currentGuess);
  while (allGuesses.length < ROWS) allGuesses.push("");

  return (
    <div className="flex flex-col items-center gap-1 p-2">
      {allGuesses.map((guess, rowIndex) => (
        <div key={rowIndex} className="flex gap-1">
          {Array(COLS)
            .fill("")
            .map((_, colIndex) => {
              const letter = guess[colIndex] || "";
              return (
                <div
                  key={colIndex}
                  className="flex items-center justify-center w-[62px] h-[62px] border-0 border-gray rounded text-2xl font-bold bg-gray-200 uppercase"
                >
                  {letter}
                </div>
              );
            })}
        </div>
      ))}
    </div>
  );
};

export default Grid;