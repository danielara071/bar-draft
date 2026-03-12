import { useState } from 'react'
import Grid from '../components/Grid'
import Keyboard from '../components/Keyboard'


function Wordle() {
  const [guesses, setGuesses] = useState(['Barca']);
  const [currentGuess, setCurrentGuess] = useState('');

  console.log(currentGuess);

  const handleKeyPress = (key: string) => {
    if (guesses.length === 6) {
      return;
    }

    if (key === 'ENTER') {
      if (currentGuess.length === 5) {
        setGuesses([...guesses, currentGuess]);
        setCurrentGuess('');
      }
    }

    // regresa la palabra sin la ultima letra
    else if (key === 'BACKSPACE') {
      setCurrentGuess((prev) => prev.slice(0, -1));
      console.log("pressed backspace");
    }

    else if (currentGuess.length < 5) {
      setCurrentGuess((prev) => prev + key.toLowerCase());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6 bg-[#002244]">
      <img className="h-12 w-19 object-contain" src="/barcaLogo.png" />
      <h1 className='text-3xl font-extrabold text-white'>Barca Wordle</h1>
      <Grid guesses={guesses} currentGuess={currentGuess} />
      <Keyboard onKeyPress={handleKeyPress}/>
    </div>
  )
}

export default Wordle
