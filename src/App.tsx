import { useEffect, useState } from 'react';
import words from './constants/words.json';
import dictionary from './constants/dictionary.json';
import './App.css';

interface WordList {
  [key: string]: string[];
}

interface WordDict {
  [key: string]: string;
}

function App() {
  const [size, setSize] = useState<number>(5);
  const [level, setLevel] = useState<number>(0);
  const [inputs, setInputs] = useState<string[][]>(Array(size + 1).fill('').map(() => Array(size).fill('')));
  const [coloring, setColoring] = useState<string[][]>(Array(size + 1).fill('').map(() => Array(size).fill("bg-gray-300")));
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const [isDescToggle, setIsDescToggle] = useState<boolean>(false);
  const [buttonTrigger, setButtonTrigger] = useState<boolean>(true);
  
  const [dict, setDict] = useState<Set<string>>(new Set());
  const [target, setTarget] = useState<string>("");
  const [keyStatus, setKeyStatus] = useState<boolean[]>(Array(26).fill(false));
  
  const keyboard: string[][] = [['Q','W','E','R','T','Y','U','I','O','P'],['A','S','D','F','G','H','J','K','L'],['⏎','Z','X','C','V','B','N','M','⌫']]

  // sets a new target word, and reinitialises the correct inputs array every time size is changed
  useEffect(() => {
    if (!buttonTrigger)
      return;
    setDict(new Set((words as WordList)[size.toString()]));
    const dictSize = (words as WordList)[size.toString()].length;
    setTarget((words as WordList)[size.toString()][Math.floor(Math.random() * dictSize)]);
    handleReset();
  }, [buttonTrigger])

  // sets a eventlistener everytime the page is to be rendered.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => handleLetterChange(event.key);

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  })

  function handleLetterChange(letter: string) {
    if (/^[A-Za-z]$/.test(letter))
      addLetter(letter);
    if (letter === "Enter" || letter === "⏎")
      isWordValid();
    if (letter === "Backspace" || letter === "⌫")
      removeLetter();
  }
  
  function addLetter(letter: string) {
    letter = letter.toUpperCase();
    const currLevel = [...inputs[level]];
    
    for (let i = 0; i < size; i++) {
      if (currLevel[i] === '') {
        currLevel[i] = letter;
        break;
      }
    }
    const newinputs = [...inputs];
    newinputs[level] = currLevel;
    setInputs(newinputs);
  }
  
  function removeLetter() {
    const currLevel = [...inputs[level]];
    for (let i = size - 1; i >= 0; i--) {
      if (currLevel[i] !== '') {
        currLevel[i] = '';
        break;
      }
    }
    const newinputs = [...inputs];
    newinputs[level] = currLevel;
    setInputs(newinputs);    
  }
  
  function isWordValid() {
    const currLevel = [...inputs[level]];

    // Checking and exiting if the size of the word is less than size
    for (let i = 0; i < size; i++)
      if (currLevel[i] === '')
        return;

    // Checking if the word is a valid english word
    if (!dict.has(currLevel.join(""))){
      for (let i = 0; i < size; i++)
        currLevel[i] = "";
      const newinputs = [...inputs];
      newinputs[level] = currLevel;
      setInputs(newinputs);
      return;
    }

    // If it is valid, then checking if it is the right word
    if (displayDifferences())
        if (level === size)
          setIsComplete(true);
        setLevel(level + 1);
  }  
  
  function displayDifferences(): boolean {
    const currLevel = [...inputs[level]];
    const newColoring = [...coloring];
    
    const charMap: number[] = Array(26).fill(0);
    const currCharMap: number[] = Array(26).fill(0);
    for (let i = 0; i < size; i ++){
      let idx1 = target[i].charCodeAt(0) - 'A'.charCodeAt(0);
      let idx2 = currLevel[i].charCodeAt(0) - 'A'.charCodeAt(0);
      charMap[idx1] ++;
      currCharMap[idx2] ++;
    }
    
    let newKeyStatus = [...keyStatus];
    let flag = false;
    for (let i = 0; i < size; i ++) {
      let idx = currLevel[i].charCodeAt(0) - 'A'.charCodeAt(0);
      if (currLevel[i] === target[i]) {
          newColoring[level][i] = 'bg-green-300';
          charMap[idx] --;
      }
      else if (charMap[idx] >= currCharMap[idx]){
          newColoring[level][i] = 'bg-yellow-300';
          charMap[idx] --;
          flag = true;
      }
      else {
          newColoring[level][i] = 'bg-red-300';
          if (!target.includes(currLevel[i]))
              newKeyStatus[idx] = true;
          flag = true;
      }
      currCharMap[idx] --;
    }
    setKeyStatus(newKeyStatus);
    setColoring(newColoring);
    if (!flag)
      setIsComplete(true);
    return flag;
  }

  function handleReset() {
    setButtonTrigger(false);
    setLevel(0);
    setInputs(Array(size + 1).fill('').map(() => Array(size).fill('')));
    setColoring(Array(size + 1).fill('').map(() => Array(size).fill("bg-gray-300")));
    setKeyStatus(Array(26).fill(false));
    setIsComplete(false);
  }

  return (
    <div className='flex flex-col items-center justify-center gap-7'>
      {isComplete ? 
        <button onClick={() => setIsDescToggle(!isDescToggle)} className='flex items-center justify-center absolute top-0 text-white bg-gray-700 rounded-xl font-semibold p-3 z-10'>{target}</button>
      : null}
      {isComplete && isDescToggle ? 
        <div className='flex items-center justify-center max-w-xs md:max-w-sm absolute top-10 md:right-10 p-3 bg-gray-600 rounded-xl text-white z-9 opacity-80'>
          {(dictionary as WordDict)[target.toLowerCase()]}
        </div>
      : null}
      <div className='flex flex-col items-center justify-center bg-black rounded-md select-none'>
        {inputs.map((word, wordIdx) => (
          <div key={wordIdx} className='flex'>
            {word.map((letter, letterIdx) => (
              <div key={letterIdx} className={`${coloring[wordIdx][letterIdx]} flex justify-center rounded-md items-center border-2 border-black w-14 h-14 md:w-16 md:h-16 font-bold text-xl`}>{letter}</div>
            ))}
          </div>
        ))}
      </div>
      <div className='flex flex-col justify-center items-center select-none'>
        {keyboard.map((row, rowIdx) => (
          <div key={rowIdx} className='flex justify-center items-center'>
            {row.map((letter, letterIdx) => (
              <button key={letterIdx} value={letter} className={`flex justify-center items-center border-2 border-black w-9 h-9 md:w-12 md:h-12 font-bold text-xl ${keyStatus[letter.charCodeAt(0) - 'A'.charCodeAt(0)] ? 'bg-gray-300' : ''}`} onClick={(e) => handleLetterChange((e.target as HTMLInputElement).value)}>{letter}</button>
            ))}
          </div>
        ))}
      </div>
      <div className='flex gap-3 md:gap-5 items-center font-semibold select-none'>
        No of Words: 
        {[4,5,6].map((val, index) => (
          <button key={index} className='grid place-items-center rounded-xl px-5 py-2 md:px-6 md:py-3 text-white bg-blue-500' 
                  onClick={(e) => {
                    setSize(val);
                    setButtonTrigger(true);
                    e.currentTarget.blur();
                  }}>{size === val && level ? "Restart" : val}</button>
        ))}
      </div>
    </div>
  )
}

export default App;