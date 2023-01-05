import { useEffect, useState } from 'react';
import './App.css';
import { Col, Container, Form, Row } from 'react-bootstrap';
import raw from './kanji_01.json';

function App() {
  const [appState, setAppState] = useState("WAITING_RESPONSE");
  const [kanjis] = useState([]);
  const [kanjiPrompt, setKanjiPrompt] = useState();
  const [userAnswer, setUserAnswer] = useState("");
  const [answerResult, setAnswerResult] = useState("NA");

  function loadKanjiDictionary() {
    if (kanjis.length === 0) {
      raw['data'].forEach(kanji => {
        kanjis.push(kanji);
      });
      console.log('Loaded', kanjis.length, 'kanjis');
    }
  }

  function getNextKanjiPrompt() {
    return kanjis[Math.floor(Math.random() * kanjis.length)];
  };

  const updateKanjiPrompt = () => {
    console.log("kanjis length:", kanjis.length);
    setKanjiPrompt(getNextKanjiPrompt());
  };
  
  useEffect(() => {
    loadKanjiDictionary();
    updateKanjiPrompt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function Score(props) {
    return <div className='score'>2/10</div>
  }

  function handleOnInputChange(event) {
      setUserAnswer(event.target.value);
  }

  function getAcceptedMeanings(kanjiPrompt) {
    return kanjiPrompt['data']['meanings']
      .filter(meaning => meaning.accepted_answer)
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (appState === "WAITING_RESPONSE") {
      const accepted_meanings = getAcceptedMeanings(kanjiPrompt).map(meaning => meaning['meaning'].toLowerCase());
      if (accepted_meanings.includes(userAnswer.toLowerCase())) {
        setAnswerResult("CORRECT");
      } else {
        setAnswerResult("WRONG");
      }
      setAppState("ANSWERED");
    } else {
      setAppState("WAITING_RESPONSE");
      setUserAnswer("");
      updateKanjiPrompt();
    }
    
  }

  function KanjiPrompt(props) {
    return <p className="kanjiPrompt">{props.kanjiPrompt['data']['slug']}</p>;
  }

  // function AnswerInput(props) {
  //   return <input type="text" id="answer" value={userAnswer} onChange={props.onChange} />;
  // }

  function AnswerResult(props) {
    return <div>{props.currentState === "ANSWERED" ? 
      props.result === "CORRECT" 
      ? "Correct!" 
      : getAcceptedMeanings(kanjiPrompt).filter(meaning => meaning.primary)[0]['meaning']
      : ""}
      </div>
  }

  return (
    <Container fluid className='App'>
      <Row>
        <Col>
          <Score />
        </Col>
      </Row>
      <Row>
        <Col className='App-body'>
          <Row>
            <Col>
              {kanjiPrompt && <KanjiPrompt kanjiPrompt={kanjiPrompt}/>}
            </Col>
          </Row>
          <Row>
            <Col>
              <Form onSubmit={handleSubmit} autoComplete="off">
                <input type="text" id="answer" value={userAnswer} onChange={handleOnInputChange}
                  className={appState === "ANSWERED" ? answerResult === "CORRECT" ? 'correct' : 'wrong' : ''} />
                {/* <AnswerInput onChange={handleOnInputChange}/> */}
                {/* <Button onClick={handleSubmit}>&gt;</Button> */}
              </Form>
            </Col>
          </Row>
          <Row>
            <Col>
              <AnswerResult currentState={appState} result={answerResult} />
            </Col>
          </Row>
        </Col>
      </Row>
      
    
    </Container>
  );
}

export default App;
