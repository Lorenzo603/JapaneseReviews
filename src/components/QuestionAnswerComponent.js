import { useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';


export const QuestionAnswerComponent = (props) => {
    const Result = {
        CORRECT: 0,
        WRONG: 1,
        NA: 2,
      };
    
      const AnswerState = {
        WAITING_RESPONSE: 0,
        ANSWERED: 1,
      };
    
      const [answerState, setAnswerState] = useState(AnswerState.WAITING_RESPONSE);
      const [kanjiPrompt, setKanjiPrompt] = useState();
      const [userAnswer, setUserAnswer] = useState("");
      const [answerResult, setAnswerResult] = useState(Result.NA);
      const [totalAnswers, setTotalAnswers] = useState(0);
      const [totalCorrect, setTotalCorrect] = useState(0);
    
    
      function getNextKanjiPrompt() {
        return props.kanjis[Math.floor(Math.random() * props.kanjis.length)];
      };
    
      const updateKanjiPrompt = () => {
        console.log("kanjis pool length:", props.kanjis.length);
        setKanjiPrompt(getNextKanjiPrompt());
      };
      
      useEffect(() => {
        updateKanjiPrompt();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
    
      function Score() {
        const percentage = totalAnswers === 0 ? 0 : Math.round(totalCorrect/totalAnswers * 100, 2);
        return <div className='score'><span>{totalCorrect}/{totalAnswers}</span> <span>({percentage} %)</span></div>
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
        if (answerState === AnswerState.WAITING_RESPONSE) {
          const accepted_meanings = getAcceptedMeanings(kanjiPrompt).map(meaning => meaning['meaning'].toLowerCase());
          if (accepted_meanings.includes(userAnswer.toLowerCase())) {
            setAnswerResult(Result.CORRECT);
            setTotalCorrect(totalCorrect + 1);
          } else {
            setAnswerResult(Result.WRONG);
          }
          setAnswerState(AnswerState.ANSWERED);
          setTotalAnswers(totalAnswers + 1);
        } else {
          setAnswerState(AnswerState.WAITING_RESPONSE);
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
        return <div className='answer-result'>{props.currentState === AnswerState.ANSWERED ? 
          props.result === Result.CORRECT
          ? "Correct!" 
          : getAcceptedMeanings(kanjiPrompt).filter(meaning => meaning.primary)[0]['meaning']
          : ""}
          </div>
      }
    
      return (
        <Row>
            <Col>
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
                            className={answerState === AnswerState.ANSWERED ? answerResult === Result.CORRECT ? 'correct' : 'wrong' : ''} />
                            {/* <AnswerInput onChange={handleOnInputChange}/> */}
                            {/* <Button onClick={handleSubmit}>&gt;</Button> */}
                        </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                        <AnswerResult currentState={answerState} result={answerResult} />
                        </Col>
                    </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
      );
};

export default QuestionAnswerComponent;