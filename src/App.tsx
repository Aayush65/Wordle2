import { useEffect, useState } from 'react';
import correctWords from './words.json';
import './App.css';

interface WordDictionary {
  [key: string]: string[];
}

function App() {
  const [size, setSize] = useState<number>(5);
  const [level, setLevel] = useState<number>(0);
  // const [failed, setFailed] = useState<boolean>(false);
  // const [success, setSuccess] = useState<boolean>(false);
  const [words, setWords] = useState<string[][]>(Array(size).fill('').map(() => Array(size).fill('')));
  const [coloring, setColoring] = useState<string[][]>(Array(size).fill('').map(() => Array(size).fill("bg-gray-300")));
  
  const [dict, setDict] = useState<Set<string>>(new Set());
  const [target, setTarget] = useState<string>("");

  // sets a new target word, and reinitialises the correct words array every time size is changed
  useEffect(() => {
    setDict(new Set((correctWords as WordDictionary)[size.toString()]));
    const dictSize = (correctWords as WordDictionary)[size.toString()].length;
    setTarget((correctWords as WordDictionary)[size.toString()][Math.floor(Math.random() * dictSize)]);
    handleReset();
  }, [size])

  // sets a eventlistener everytime the page is to be rendered.
  useEffect(() => {
    window.addEventListener('keyup', handleLetterChange);
    return () => window.removeEventListener('keyup', handleLetterChange);
  })

  function handleLetterChange(e: KeyboardEvent) {
    const letter = e.key;
    if (/^[A-Za-z]$/.test(letter))
      addLetter(letter);
    if (letter === "Backspace")
      removeLetter();
    if (letter === "Enter")
      isWordValid();
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
    console.log("Checking for validity");
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
      if (level !== size)
        // setFailed(true);
        setLevel(level + 1);
  }  
  
  function displayDifferences(): boolean {
    const currLevel = [...words[level]];
    const newColoring = [...coloring];
    console.log("Checking for display differrnces", target, currLevel)
    
    const charMap: number[] = Array(26).fill(0);
    for (let i = 0; i < size; i ++){
      let idx = target[i].charCodeAt(0) - 'A'.charCodeAt(0);
      charMap[idx] ++;
    }
    
    let flag = false;
    for (let i = 0; i < size; i ++) {
      let idx = currLevel[i].charCodeAt(0) - 'A'.charCodeAt(0);
      if (currLevel[i] === target[i]) {
         newColoring[level][i] = 'bg-green-300';
         charMap[idx] --;
      }
      else if (charMap[idx]){
         newColoring[level][i] = 'bg-yellow-300';
         charMap[idx] --;
         flag = true
      }
      else {
         newColoring[level][i] = 'bg-red-300';
         flag = true;
      }
    }
    console.log(newColoring[level]);
    setColoring(newColoring);
    return flag;
  }

  function handleReset() {
    setLevel(0);
    // setFailed(false);
    // setSuccess(false);
    setWords(Array(size).fill('').map(() => Array(size).fill('')));
    setColoring(Array(size).fill('').map(() => Array(size).fill("bg-gray-300")));
  }

  return (
    <div className='flex flex-col items-center justify-center gap-10'>
      <div className='flex flex-col items-center justify-center'>
        {words.map((word, wordIdx) => (
          <div key={wordIdx} className='flex'>
            {word.map((letter, letterIdx) => (
              <div key={letterIdx} className={`${coloring[wordIdx][letterIdx]} flex justify-center items-center border-2 border-black w-14 h-14 md:w-16 md:h-16 font-bold text-xl `}>{letter}</div>
            ))}
          </div>
        ))}
      </div>
      <div className='flex gap-5'>
        <button type="submit" className='grid place-items-center pt-5 pb-5 pl-7 pr-7 bg-blue-400' onClick={() => setSize(4)}>4</button>
        <button type="submit" className='grid place-items-center pt-5 pb-5 pl-7 pr-7 bg-blue-400' onClick={() => setSize(5)}>5</button>
        <button type="submit" className='grid place-items-center pt-5 pb-5 pl-7 pr-7 bg-blue-400' onClick={() => setSize(6)}>6</button>
        <button type="submit" className='grid place-items-center pt-5 pb-5 pl-7 pr-7 bg-blue-400' onClick={() => setSize(7)}>7</button>
      </div>
    </div>
  )
}

export default App