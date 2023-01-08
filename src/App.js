import './App.css';
import { Col, Container, Row, Button, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import kanjiRaw from './kanji_full.json';
import vocabularyRaw from './vocabulary_full.json';
import { QuestionAnswerComponent } from './components/QuestionAnswerComponent';
import { GuessMode } from './GuessMode'
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

  function loadKanjiDictionary() {
    if (fullKanjiDictionary.length === 0) {
      kanjiRaw['data'].forEach(kanji => {
        fullKanjiDictionary.push(kanji);
      });
      console.log('Loaded', fullKanjiDictionary.length, 'kanjis in the dictionary');
    }
  }

  function loadVocabularyDictionary() {
    if (fullVocabularyDictionary.length === 0) {
      vocabularyRaw['data'].forEach(vocab => {
        fullVocabularyDictionary.push(vocab);
      });
      console.log('Loaded', fullVocabularyDictionary.length, 'vocabs in the dictionary');
    }
  }

  useEffect(() => {
    loadKanjiDictionary();
    loadVocabularyDictionary();
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

  function SelectionOption(props) {
    return (
      <Row>
        <Col>
          <Button onClick={props.handleSetSelectionCallback} data-option={props.dataOption}>
            {props.children}
          </Button>
        </Col>
      </Row>
    );
  }

  const handleGuessModeSelection = (event) => {
    const selectedId = event.target.getAttribute('id');
    setGuessMode(selectedId === 'guess-meaning' ? GuessMode.GUESS_MEANING : GuessMode.GUESS_READING);
  }

  function SelectMode() {
    return (
      <Row>
        <Col className='App-body'>
          <Row className='select-title'>
            <Col>
              Select Mode:
            </Col>
          </Row>
          <Row className='justify-content-center'>
            <Col className='col-2'>
              <Form>
                <Form.Check type="radio" name="guess-mode-radio-group" id="guess-meaning" label="Guess Meaning"
                  onChange={handleGuessModeSelection} checked={guessMode === GuessMode.GUESS_MEANING} />
                <Form.Check type="radio" name="guess-mode-radio-group" id="guess-reading" label="Guess Reading"
                  onChange={handleGuessModeSelection} checked={guessMode === GuessMode.GUESS_READING} />
              </Form>
            </Col>
          </Row>
          <Row className='select-title'>
            <Col>
              Select Kanji set:
            </Col>
          </Row>
          <SelectionOption handleSetSelectionCallback={handleSetSelection} dataOption={'jlpt5'}>JLPT N5</SelectionOption>
          <SelectionOption handleSetSelectionCallback={handleSetSelection} dataOption={'jlpt4'}>JLPT N4</SelectionOption>
          <SelectionOption handleSetSelectionCallback={handleSetSelection} dataOption={'jlpt3'}>JLPT N3</SelectionOption>
          <SelectionOption handleSetSelectionCallback={handleSetSelection} dataOption={'jlpt2'}>JLPT N2</SelectionOption>
          <SelectionOption handleSetSelectionCallback={handleSetSelection} dataOption={'full'}>Full Kanji Set</SelectionOption>
          <SelectionOption handleSetSelectionCallback={handleSetSelection} dataOption={'full-vocab'}>Full Vocabulary Set</SelectionOption>
          <SelectionOption handleSetSelectionCallback={handleSetSelection} dataOption={'test'}>Test</SelectionOption>
        </Col>
      </Row>
    );
  };

  return (
    <Container fluid className='App'>
      <Row>
        <Col className='App-body'>
          {
            appState === AppState.SELECT_MODE
              ? <SelectMode />
              : <QuestionAnswerComponent kanjis={kanjiSet} resetHandler={handleResetEvent} guessMode={guessMode} />
          }
        </Col>
      </Row>
    </Container>
  );
}

export default App;
