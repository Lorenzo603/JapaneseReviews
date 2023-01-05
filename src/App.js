import { useEffect, useState } from 'react';
import './App.css';


function App() {
  const kanjis = [
    {
      "slug": "一",
      "meaning": "One",
    },
    {
      "slug": "二",
      "meaning": "Two",
    },
    {
      "slug": "三",
      "meaning": "Three",
    },
    {
      "slug": "四",
      "meaning": "Four",
    }
  ];

  const [kanjiPrompt, setKanjiPrompt] = useState("EMPTY");
  const [userAnswer, setUserAnswer] = useState("");
  const [answerResult, setAnswerResult] = useState("NA");

  function getNextKanjiPrompt() {
    return kanjis[Math.floor(Math.random() * kanjis.length)];
  };

  const updateKanjiPrompt = () => {
    setKanjiPrompt(getNextKanjiPrompt());
  };
  
  useEffect(() => {
    updateKanjiPrompt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleOnInputChange(event) {
      setUserAnswer(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (userAnswer.toLowerCase() === kanjiPrompt.meaning.toLowerCase()) {
      setAnswerResult("CORRECT")
    } else {
      setAnswerResult("WRONG")
    }
    setUserAnswer("");
    updateKanjiPrompt();
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>{kanjiPrompt.slug}</p>

        <form onSubmit={handleSubmit}>
          <input type="text" id="answer" value={userAnswer} onChange={handleOnInputChange}/>
          <input type="submit" value="Submit"/>
        </form>

        {answerResult !== "NA" ? answerResult === "CORRECT" ? <p>Correct!</p> : <p>Wrong!</p> : <p></p>}

      </header>
    </div>
  );
}

export default App;
