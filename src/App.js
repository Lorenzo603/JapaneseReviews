import { useEffect, useState } from 'react';
import './App.css';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

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

  function KanjiPrompt(props) {
    return <p className="kanjiPrompt">{props.kanjiPrompt.slug}</p>;
  }

  function AnswerResult(props) {
    return <div>{props.result !== "NA" ? 
      props.result === "CORRECT" 
      ? "Correct!" 
      : "Wrong!" 
      : ""}
      </div>
  }

  return (
    <Container fluid className='App'>
      <Row>
        <Col></Col>
      </Row>
      <Row>
        <Col className='App-body'>
          <Row>
            <Col><KanjiPrompt kanjiPrompt={kanjiPrompt}/></Col>
          </Row>
          <Row>
            <Col>
              <Form onSubmit={handleSubmit}>
                <Form.Control as="input" type="text" id="answer" value={userAnswer} onChange={handleOnInputChange}/>
                <Button onClick={handleSubmit}>&gt;</Button>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col>
              <AnswerResult result={answerResult} />
            </Col>
          </Row>
        </Col>
      </Row>
      
    
    </Container>
  );
}

export default App;