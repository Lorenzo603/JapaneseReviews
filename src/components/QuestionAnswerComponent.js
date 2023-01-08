import { useEffect, useState } from 'react';
import { Col, Form, Row, Button, Dropdown } from 'react-bootstrap';
import { ScoreComponent } from './ScoreComponent';
import { GuessMode } from '../GuessMode'
var wanakana = require('wanakana');

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
    const [answerResult, setAnswerResult] = useState(Result.NA);
    const [totalAnswers, setTotalAnswers] = useState(0);
    const [totalCorrect, setTotalCorrect] = useState(0);
    const [remainingPrompts] = useState([]);
    const [wrongAnswers] = useState([]);
    const [focusModeEnabled, setFocusModeEnabled] = useState(false);

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

    function getAnswerInputElement() {
        return document.getElementById('answer');
    }

    useEffect(() => {
        if (remainingPrompts.length === 0) {
            remainingPrompts.push(...shuffle(props.kanjis));
            updateKanjiPrompt();
            if (props.guessMode === GuessMode.GUESS_READING) {
                wanakana.bind(getAnswerInputElement());
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function toggleFocusMode() {
        setFocusModeEnabled(!focusModeEnabled);
    }

    function endSession() {
        setAnswerState(AnswerState.FINISHED);
    }

    function SessionMenu() {
        return (
            <Dropdown>
                <Dropdown.Toggle>
                    {focusModeEnabled ? "" : "Settings"}
                </Dropdown.Toggle>
                <Dropdown.Menu variant="dark">
                    <Dropdown.Item onClick={toggleFocusMode}>{focusModeEnabled ? "Disable Focus Mode" : "Enable Focus Mode"}</Dropdown.Item>
                    <Dropdown.Item onClick={endSession}>End Session</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    function getCurrentMode() {
        return props.guessMode === GuessMode.GUESS_MEANING ? 'meanings' : 'readings';
    }

    function getCurrentModeSingle() {
        return props.guessMode === GuessMode.GUESS_MEANING ? 'meaning' : 'reading'
    }

    function getAcceptedAnswers(kanjiPrompt) {
        return kanjiPrompt['data'][getCurrentMode()]
            .filter(potentialAnswer => potentialAnswer.accepted_answer)
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (answerState === AnswerState.WAITING_RESPONSE) {
            const acceptedAnswers = getAcceptedAnswers(kanjiPrompt).map(answer => answer[getCurrentModeSingle()].toLowerCase());
            if (acceptedAnswers.includes(getAnswerInputElement().value.toLowerCase())) {
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
            getAnswerInputElement().value = "";
            updateKanjiPrompt();
        }

    }

    function KanjiPrompt(props) {
        return <p className="kanjiPrompt">{props.kanjiPrompt['data']['slug']}</p>;
    }

    function AnswerResult(props) {
        return <div className='answer-result'>{props.currentState === AnswerState.ANSWERED ?
            props.result === Result.CORRECT
                ? "Correct!"
                : getAcceptedAnswers(kanjiPrompt).filter(answer => answer.primary)[0][getCurrentModeSingle()]
            : ""}
        </div>
    }

    function WrongAnswersRecap() {
        return (
            <ul className='wrongAnswerRecap'>
                {wrongAnswers.map(wrongAnswer =>
                    <li key={wrongAnswer['id']}>{wrongAnswer['data']['slug']}:
                        {getAcceptedAnswers(wrongAnswer).map(answer => answer[getCurrentModeSingle()]).join(', ')}</li>
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
                            <WrongAnswersRecap />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button onClick={props.resetHandler}>
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
                    <Col className='hamburger-menu'>
                        <SessionMenu />
                    </Col>
                    <Col>
                        {!focusModeEnabled && <ScoreComponent totalAnswers={totalAnswers} totalCorrect={totalCorrect} totalReviews={props.kanjis.length} />}
                    </Col>
                </Row>
                <Row>
                    <Col className='App-body'>
                        <Row>
                            <Col>
                                {kanjiPrompt && <KanjiPrompt kanjiPrompt={kanjiPrompt} />}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form onSubmit={handleSubmit} autoComplete="off">
                                    <input type="text" id="answer"
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