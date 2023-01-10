import './App.css';
import { Col, Container, Row, Form, Button, Popover, OverlayTrigger } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import kanjiRaw from './kanji_full.json';
import vocabularyRaw from './vocabulary_full.json';
import { loadDictionary } from './DictionaryLoader';
import { SelectModeComponent } from './components/SelectModeComponent';
import { SelectionOption } from './components/SelectionOptionComponent';
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
  const [selectedLevel, setSelectedLevel] = useState(1);

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
          .filter(kanji => kanji['data']['level'] === selectedLevel);
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

  const popover = (
    <Popover id="popover-basic">
      <Popover.Body>
        <Row>
          {Array.from({ length: 60 }, (_, i) => i + 1).map(index => {
            return (
              <Col className='col-2 level-number'>
                <Button onClick={() => setSelectedLevel(index)}>{index}</Button>
              </Col>
            );
          })}
        </Row>
      </Popover.Body>
    </Popover>
  );

  function SelectMode() {
    return (
      <Row>
        <Col className='App-body'>
          <SelectModeComponent guessMode={guessMode} handleGuessModeSelection={handleGuessModeSelection} />
          <Row className='select-title'>
            <Col>
              Select Kanji set:
            </Col>
          </Row>
          <Row className='justify-content-center'>
            <Col className='col-2'>
              <Form onSubmit={handleSetSelection} data-option={'level'}>
                <Row className='align-items-center'>
                  <Col className='justify-content-right'>
                    <OverlayTrigger variant="dark" trigger="click" placement="right" overlay={popover}>
                      <Button className='selectedLevel'>{selectedLevel}</Button>
                    </OverlayTrigger>
                  </Col>
                  <Col className='justify-content-left'>
                    <Button type='submit'>Select Level</Button>
                  </Col>
                </Row>
              </Form>
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
