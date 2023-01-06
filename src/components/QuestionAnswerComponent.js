import { useEffect, useState } from 'react';
import { Col, Form, Row, Button } from 'react-bootstrap';


export const QuestionAnswerComponent = (props) => {
    const Result = {
        CORRECT: 0,
        WRONG: 1,
        NA: 2,
      };
    
      const AnswerState = {
        WAITING_RESPONSE: 0,
        ANSWERED: 1,
        FINISHED: 2,
      };
    
      const [answerState, setAnswerState] = useState(AnswerState.WAITING_RESPONSE);
      const [kanjiPrompt, setKanjiPrompt] = useState();
      const [userAnswer, setUserAnswer] = useState("");
      const [answerResult, setAnswerResult] = useState(Result.NA);
      const [totalAnswers, setTotalAnswers] = useState(0);
      const [totalCorrect, setTotalCorrect] = useState(0);
      const [remainingPrompts] = useState([]);
      const [wrongAnswers] = useState([]);
    
    
      function getNextKanjiPrompt() {
        return remainingPrompts.pop();
      };
    
      const updateKanjiPrompt = () => {
        console.log("kanjis pool length:", remainingPrompts.length);
        if (remainingPrompts.length === 0) {
            setAnswerState(AnswerState.FINISHED);
        } else {
            setKanjiPrompt(getNextKanjiPrompt());
        }
      };
      
      function shuffle(unshuffled) {
        return unshuffled
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
      }

      useEffect(() => {
        if (remainingPrompts.length === 0) {
          remainingPrompts.push(...shuffle(props.kanjis));
          updateKanjiPrompt();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
    
      function Score() {
        const percentage = totalAnswers === 0 ? 0 : Math.round(totalCorrect/totalAnswers * 100, 2);
        return <div className='score'><span>{totalCorrect}/{totalAnswers}</span> <span>({percentage} %)</span> <span>Total: {props.kanjis.length}</span></div>
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
            wrongAnswers.push(kanjiPrompt);
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

      function WrongAnswersRecap() {
          return (
            <ul>
                {wrongAnswers.map(wrongAnswer =>
                    <li key={wrongAnswer['id']}>{wrongAnswer['data']['slug']}: 
                    {getAcceptedMeanings(wrongAnswer).map(meaning => meaning['meaning']).join(', ')}</li>
                )}
            </ul>
          );
      }

      function FinalResult() {
          return (
            <Row>
                <Col>
                    <Row>
                        <Col>
                            <WrongAnswersRecap/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button>
                                Go back
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
          );
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
                        {answerState === AnswerState.FINISHED && <FinalResult />}
                    </Col>
                </Row>
            </Col>
        </Row>
      );
};

export default QuestionAnswerComponent;