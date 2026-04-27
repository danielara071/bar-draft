import { useState, useEffect } from 'react'
import Grid from '../shared/components/Grid';
import Keyboard from '../shared/components/Keyboard';
import PopUp from '../shared/components/PopUp';
import WinPopUp from '../shared/components/WinPopUp';
import LosePopUp from '../shared/components/LosePopUp';
import HelpPopUp from '../shared/components/HelpPopUp';
import { useWordle } from '../features/wordle/hooks/useWordle';

function Wordle() {
  const {guesses, dailyWord, status, loading, submitGuess } = useWordle();
  const [guesses_, setGuesses_] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [openWin, setOpenWin] = useState<boolean>(false);
  const [openLose, setOpenLose] = useState<boolean>(false);
  const [openHelp, setOpenHelp] = useState<boolean>(false);

  const won = guesses.length > 0 && guesses[guesses.length - 1] === dailyWord;
  const lost = !won && guesses.length === 6;
  const gameOver = won || lost;

  useEffect(() => {
  if (won) {
    setOpenWin(true);
  }
  }, [won]);

  useEffect(() => {
  if (lost) {
    setOpenLose(true);
  }
  }, [lost]);
  
 const handleKeyPress = (key: string) => {
  if (gameOver) return;

  if (key === 'ENTER') {
    if (currentGuess.length === 5) {
      submitGuess(currentGuess);
      setCurrentGuess('');
    }
  } else if (key === 'BACKSPACE') {
    setCurrentGuess((prev) => prev.slice(0, -1));
  } else if (currentGuess.length < 5) {
    setCurrentGuess((prev) => prev + key.toLowerCase());
  }
};

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6 bg-[#002244]">
      <div className="relative w-full flex items-center justify-center">
        <h1 className='text-3xl font-extrabold text-white'>Barca Wordle</h1>
        <div className="absolute left-1/2 translate-x-50 flex gap-3">
          {gameOver && 
          <span className="material-symbols-outlined text-white cursor-pointer"
          onClick={() => won ? setOpenWin(true) : setOpenLose(true)}
          >leaderboard</span>
          }
          <span className="material-symbols-outlined text-white cursor-pointer" onClick={() => setOpenHelp(true)}>help</span>
        </div>
      </div>
      <Grid guesses={guesses} currentGuess={currentGuess} dailyWord={dailyWord} />
      <Keyboard onKeyPress={handleKeyPress}/>
      <PopUp open={openWin} onClose={() => setOpenWin(false)}>
        <WinPopUp guesses={guesses.length} onClose={() => setOpenWin(false)} />
      </PopUp>
      <PopUp open={openLose} onClose={() => setOpenLose(false)}>
        <LosePopUp solution={dailyWord} onClose={() => setOpenLose(false)} />
      </PopUp>
      <PopUp open={openHelp} onClose={() => setOpenHelp(false)}>
        <HelpPopUp onClose={() => setOpenHelp(false)} />
      </PopUp>
    </div>
  )
}

export default Wordle
