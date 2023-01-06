import './App.css';
import { Col, Container, Row, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import raw from './kanji_01.json';
import { QuestionAnswerComponent } from './components/QuestionAnswerComponent';

function App() {

  const AppState = {
    SELECT_MODE: 0,
    QUESTION_ANSWER: 1,
  };

  const [appState, setAppState] = useState(AppState.SELECT_MODE);
  const [fullDictionary] = useState([]);
  const [kanjiSet, setKanjiSet] = useState([]);

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

  function handleKanjiSetSelection(event) {
    const dataOption = event.target.getAttribute('data-option');
    let selectedSet = [];
    switch (dataOption) {
      case "full":
        selectedSet = fullDictionary;
        break;
      default:
        selectedSet = fullDictionary
        .filter(kanji => kanji['data'].hasOwnProperty('categories'))
        .filter(kanji => kanji['data']['categories'].includes(dataOption));
        break;
    }
    
    setKanjiSet(selectedSet);
    setAppState(AppState.QUESTION_ANSWER);
  }

  function SelectMode() {
    return (
      <Row>
        <Col>
          Select Kanji set:
        </Col>
        <Col>
          <Button onClick={handleKanjiSetSelection} data-option='jlpt5'>
            Use JLPT N5
          </Button>
        </Col>
        <Col>
          <Button onClick={handleKanjiSetSelection} data-option='full'>
            Full Set
          </Button>
        </Col>
        <Col>
          <Button onClick={handleKanjiSetSelection} data-option='test'>
            Test
          </Button>
        </Col>
      </Row>
    );
  };

  return (
    <Container fluid className='App'>
      <Row>
        <Col className='App-body'>
          {appState === AppState.SELECT_MODE ? <SelectMode/> : <QuestionAnswerComponent kanjis={kanjiSet}/>}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
