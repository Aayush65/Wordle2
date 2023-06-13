import { useEffect, useState } from 'react';
import correctWords from './words.json';
import './App.css';

interface WordDictionary {
  [key: string]: string[];
}

function App() {
  const [size, setSize] = useState<number>(5);
  const [level, setLevel] = useState<number>(0);
  const [words, setWords] = useState<string[][]>(Array(size + 1).fill('').map(() => Array(size).fill('')));
  const [coloring, setColoring] = useState<string[][]>(Array(size + 1).fill('').map(() => Array(size).fill("bg-gray-300")));
  
  const [dict, setDict] = useState<Set<string>>(new Set());
  const [target, setTarget] = useState<string>("");
  const [keyStatus, setKeyStatus] = useState<boolean[]>(Array(26).fill(false));

  const keyboard: string[][] = [['Q','W','E','R','T','Y','U','I','O','P'],['A','S','D','F','G','H','J','K','L'],['⏎','Z','X','C','V','B','N','M','⌫']]

  // sets a new target word, and reinitialises the correct words array every time size is changed
  useEffect(() => {
    setDict(new Set((correctWords as WordDictionary)[size.toString()]));
    const dictSize = (correctWords as WordDictionary)[size.toString()].length;
    setTarget((correctWords as WordDictionary)[size.toString()][Math.floor(Math.random() * dictSize)]);
    handleReset();
  }, [size])

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
    const currLevel = [...words[level]];
    
    for (let i = 0; i < size; i++) {
      if (currLevel[i] === '') {
        currLevel[i] = letter;
        break;
      }
    }
    const newWords = [...words];
    newWords[level] = currLevel;
    setWords(newWords);
  }
  
  function removeLetter() {
    const currLevel = [...words[level]];
    for (let i = size - 1; i >= 0; i--) {
      if (currLevel[i] !== '') {
        currLevel[i] = '';
        break;
      }
    }
    const newWords = [...words];
    newWords[level] = currLevel;
    setWords(newWords);    
  }
  
  function isWordValid() {
    const currLevel = [...words[level]];

    // Checking and exiting if the size of the word is less than size
    for (let i = 0; i < size; i++)
      if (currLevel[i] === '')
        return;

    // Checking if the word is a valid english word
    if (!dict.has(currLevel.join(""))){
      for (let i = 0; i < size; i++)
        currLevel[i] = "";
      const newWords = [...words];
      newWords[level] = currLevel;
      setWords(newWords);
      return;
    }

    // If it is valid, then checking if it is the right word
    if (displayDifferences())
        setLevel(level + 1);
  }  
  
  function displayDifferences(): boolean {
    const currLevel = [...words[level]];
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
    return flag;
  }

  function handleReset() {
    setLevel(0);
    setWords(Array(size + 1).fill('').map(() => Array(size).fill('')));
    setColoring(Array(size + 1).fill('').map(() => Array(size).fill("bg-gray-300")));
    setKeyStatus(Array(26).fill(false));
  }

  return (
    <div className='flex flex-col items-center justify-center gap-7'>
      {level === size + 1 ? <div className='flex flex-col items-center justify-center absolute top-0 text-white bg-gray-700 rounded-xl font-semibold p-3'>{target}</div> : null}
      <div className='flex flex-col items-center justify-center bg-black rounded-md'>
        {words.map((word, wordIdx) => (
          <div key={wordIdx} className='flex'>
            {word.map((letter, letterIdx) => (
              <div key={letterIdx} className={`${coloring[wordIdx][letterIdx]} flex justify-center rounded-md items-center border-2 border-black w-14 h-14 md:w-16 md:h-16 font-bold text-xl `}>{letter}</div>
            ))}
          </div>
        ))}
      </div>
      <div className='flex gap-5'>
        <button type="submit" className='grid place-items-center px-5 py-3 md:px-7 md:py-4 bg-blue-400' onClick={() => setSize(4)}>4</button>
        <button type="submit" className='grid place-items-center px-5 py-3 md:px-7 md:py-4 bg-blue-400' onClick={() => setSize(5)}>5</button>
        <button type="submit" className='grid place-items-center px-5 py-3 md:px-7 md:py-4 bg-blue-400' onClick={() => setSize(6)}>6</button>
      </div>
      <div className='flex flex-col justify-center items-center'>
        {keyboard.map((row, rowIdx) => (
          <div key={rowIdx} className='flex justify-center items-center'>
            {row.map((letter, letterIdx) => (
              <button key={letterIdx} value={letter} className={`flex justify-center items-center border-2 border-black w-9 h-9 md:w-12 md:h-12 font-bold text-xl ${keyStatus[letter.charCodeAt(0) - 'A'.charCodeAt(0)] ? 'bg-gray-300' : ''}`} onClick={(e) => handleLetterChange((e.target as HTMLInputElement).value)}>{letter}</button>
            ))}
          </div>
        ))}
        </div>
    </div>
  )
}

export default App;