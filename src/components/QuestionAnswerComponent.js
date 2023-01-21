import { useEffect, useState } from 'react';
import { Col, Form, Row, Button } from 'react-bootstrap';
import { HeaderMenu } from './HeaderMenuComponent';
import { GuessMode } from '../GuessMode';
import Confetti from 'react-dom-confetti';
var wanakana = require('wanakana');
var stringSimilarity = require("string-similarity");

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
    const [isExploding, setIsExploding] = useState(false);

    const ANSWER_INPUT_ID = 'answer-input';

    function getNextKanjiPrompt() {
        return remainingPrompts.pop();
    };

    const updateKanjiPrompt = () => {
        console.log("kanjis pool length:", remainingPrompts.length);
        if (remainingPrompts.length === 0) {
            setAnswerState(AnswerState.FINISHED);
            if (totalCorrect === totalAnswers) {
                setIsExploding(true);
            }
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
        return document.getElementById(ANSWER_INPUT_ID);
    }

    useEffect(() => {
        if (remainingPrompts.length === 0) {
            remainingPrompts.push(...shuffle(props.kanjis));
            updateKanjiPrompt();
            const answerInputElement = getAnswerInputElement();
            answerInputElement.focus();
            if (props.guessMode === GuessMode.GUESS_READING) {
                wanakana.bind(answerInputElement);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function endSession() {
        setAnswerState(AnswerState.FINISHED);
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
            let userAnswer = getAnswerInputElement().value.toLowerCase();

            if (props.guessMode === GuessMode.GUESS_READING
                && userAnswer.length > 0
                && userAnswer.slice(-1) === 'n') {
                userAnswer = userAnswer.substring(0, userAnswer.length - 1) + 'ん';
                getAnswerInputElement().value = userAnswer;
            }

            if (acceptedAnswers.includes(userAnswer)) {
                setAnswerResult(Result.CORRECT);
                setTotalCorrect(totalCorrect + 1);
                updateAnswerCount();
            } else {
                const answerContainsRomaji = props.guessMode === GuessMode.GUESS_READING
                    && userAnswer.length > 0
                    && !wanakana.isKana(userAnswer);
                const similarAnswerExists = acceptedAnswers.some((element) => {
                    return stringSimilarity.compareTwoStrings(userAnswer, element) >= 0.75;
                });
                if (answerContainsRomaji || similarAnswerExists) {
                    shakeInputField();
                } else {
                    setAnswerResult(Result.WRONG);
                    wrongAnswers.push(kanjiPrompt);
                    updateAnswerCount();
                }
            }
        } else {
            setAnswerState(AnswerState.WAITING_RESPONSE);
            getAnswerInputElement().value = "";
            updateKanjiPrompt();
        }
    }

    function updateAnswerCount() {
        setAnswerState(AnswerState.ANSWERED);
        setTotalAnswers(totalAnswers + 1);
    }

    function shakeInputField() {
        const element = getAnswerInputElement();
        element.classList.remove('shake-animation'); // reset animation
        void element.offsetWidth; // trigger reflow
        element.classList.add('shake-animation'); // start animation
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

    const confettiConfig = {
        angle: '280',
        spread: '360',
        startVelocity: 30,
        elementCount: 70,
        dragFriction: 0.12,
        duration: 4000,
        stagger: 3,
        width: '12px',
        height: '12px',
        perspective: '500px',
        colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
    };

    function FinalResult() {
        return (
            <Row>
                <Col>
                    <Row>
                        <Col>
                            {wrongAnswers.length === 0 ? "Congratulations!" : <WrongAnswersRecap />}
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
                <HeaderMenu endSessionHandler={endSession}
                    totalAnswers={totalAnswers} totalCorrect={totalCorrect}
                    totalReviews={props.kanjis.length} />
                <Row>
                    <Col className='App-body'>
                        <Row>
                            <Col>
                                {kanjiPrompt && <KanjiPrompt kanjiPrompt={kanjiPrompt} />}
                            </Col>
                        </Row>
                        {answerState !== AnswerState.FINISHED && (
                            <>
                                <Row>
                                    <Col>
                                        <Form onSubmit={handleSubmit} autoComplete="off">
                                            <input type="text" id={ANSWER_INPUT_ID}
                                                className={answerState === AnswerState.ANSWERED ? answerResult === Result.CORRECT ? 'correct' : 'wrong' : ''} />
                                        </Form>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <AnswerResult currentState={answerState} result={answerResult} />
                                    </Col>
                                </Row>
                            </>
                        )}
                        {answerState === AnswerState.FINISHED && <FinalResult />}
                        <Row className="justify-content-center">
                            <Col className="col-1">
                                <Confetti active={isExploding} config={confettiConfig} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default QuestionAnswerComponent;