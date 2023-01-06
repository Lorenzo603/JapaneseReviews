import './App.css';
import { useEffect, useState } from 'react';
import raw from './kanji_01.json';
import { QuestionAnswerComponent } from './components/QuestionAnswerComponent';

function App() {

  const [fullDictionary] = useState([]);

  function loadKanjiDictionary() {
    if (fullDictionary.length === 0) {
      raw['data'].forEach(kanji => {
        fullDictionary.push(kanji);
      });
      console.log('Loaded', fullDictionary.length, 'kanjis in the dictionary');
    }
  }

  useEffect(() => {
    loadKanjiDictionary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <QuestionAnswerComponent kanjis={fullDictionary}/>
  );
}

export default App;
