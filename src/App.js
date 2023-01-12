import './App.css';
import { Col, Container, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import kanjiRaw from './kanji_full.json';
import vocabularyRaw from './vocabulary_full.json';
import { loadDictionary } from './DictionaryLoader';
import { SelectSettings } from './components/SelectSettingsComponent';
import { QuestionAnswerComponent } from './components/QuestionAnswerComponent';
import { GuessMode } from './GuessMode'
import { useLocalStorage } from "./useLocalStorage";

function App() {

  const AppState = {
    SELECT_MODE: 0,
    QUESTION_ANSWER: 1,
  };

  const [appState, setAppState] = useState(AppState.SELECT_MODE);
  const [fullKanjiDictionary] = useState([]);
  const [fullVocabularyDictionary] = useState([]);
  const [kanjiSet, setKanjiSet] = useState([]);
  const [guessMode, setGuessMode] = useState(GuessMode.GUESS_MEANING);
  const [selectedLevel, setSelectedLevel] = useLocalStorage("selectedLevel", 1);

  useEffect(() => {
    if (fullKanjiDictionary.length === 0) {
      fullKanjiDictionary.push(...loadDictionary(kanjiRaw));
      console.log('Loaded', fullKanjiDictionary.length, 'kanjis in the dictionary');
    }
    if (fullVocabularyDictionary.length === 0) {
      fullVocabularyDictionary.push(...loadDictionary(vocabularyRaw));
      console.log('Loaded', fullVocabularyDictionary.length, 'vocabs in the dictionary');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSetSelection(event) {
    const dataOption = event.target.getAttribute('data-option');
    let selectedSet = [];
    switch (dataOption) {
      case "full-vocab":
        selectedSet = fullVocabularyDictionary;
        break;
      case "full":
        selectedSet = fullKanjiDictionary;
        break;
      case "level":
        selectedSet = fullKanjiDictionary
          .filter(kanji => kanji['data']['level'] === Number(selectedLevel));
        break;
      default:
        selectedSet = fullKanjiDictionary
          .filter(kanji => kanji['data'].hasOwnProperty('categories'))
          .filter(kanji => kanji['data']['categories'].includes(dataOption));
        break;
    }

    setKanjiSet(selectedSet);
    setAppState(AppState.QUESTION_ANSWER);
  }

  function handleResetEvent() {
    setAppState(AppState.SELECT_MODE);
  }

  const handleGuessModeSelection = (event) => {
    const selectedId = event.target.getAttribute('id');
    setGuessMode(selectedId === 'guess-meaning' ? GuessMode.GUESS_MEANING : GuessMode.GUESS_READING);
  }

  return (
    <Container fluid className='App'>
      <Row>
        <Col className='App-body'>
          {
            appState === AppState.SELECT_MODE
              ? <SelectSettings handleGuessModeSelection={handleGuessModeSelection} handleSetSelection={handleSetSelection}
                guessMode={guessMode} selectedLevel={selectedLevel} setSelectedLevel={setSelectedLevel} />
              : <QuestionAnswerComponent kanjis={kanjiSet} resetHandler={handleResetEvent} guessMode={guessMode} />
          }
        </Col>
      </Row>
    </Container>
  );
}

export default App;
