interface GridProps {
  guesses: string[];
  currentGuess: string;
  dailyWord: string;
}

const ROWS = 6;
const COLS = 5;

function getColors(guess: string, solution: string): string[] {
  const colors = Array(guess.length).fill('bg-brand-gray-mid text-white');
  const solutionLetters = solution.split('');

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === solution[i]) {
      colors[i] = 'bg-brand-yellow text-white';
      solutionLetters[i] = ''; 
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (colors[i] !== 'bg-brand-gray-mid text-white') continue;

    const index = solutionLetters.indexOf(guess[i]);
    if (index !== -1) {
      colors[i] = 'bg-brand-crimson text-white';
      solutionLetters[index] = ''; 
    }
  }

  return colors;
}

const Grid = ({ guesses, currentGuess, dailyWord }: GridProps) => {
  const rows = [];

  for (let i = 0; i < ROWS; i++) {
    if (i < guesses.length) {
      rows.push({ letters: guesses[i], isSubmitted: true });
    } else if (i === guesses.length && currentGuess) {
      rows.push({ letters: currentGuess, isSubmitted: false }); 
    } else {
      rows.push({ letters: "", isSubmitted: false }); 
    }
  }

  return (
    <div className="flex flex-col items-center gap-1 p-2">
      {rows.map((row, rowIndex) => {
        const colors = row.isSubmitted && dailyWord
          ? getColors(row.letters, dailyWord)
          : [];

        return (
          <div key={rowIndex} className="flex gap-1">
            {Array(COLS).fill("").map((_, colIndex) => {
              const letter = row.letters[colIndex] || "";
              const colorClass = row.isSubmitted
                ? colors[colIndex]
                : 'bg-brand-gray-light';

              return (
                <div
                  key={colIndex}
                  className={`flex items-center justify-center w-[62px] h-[62px] border-0 border-gray rounded text-2xl font-bold uppercase ${colorClass}`}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Grid;