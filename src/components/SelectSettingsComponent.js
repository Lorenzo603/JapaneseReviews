import { Col, Row, Form, Button, Popover, OverlayTrigger } from 'react-bootstrap';
import { RadioSelectModeComponent } from './RadioSelectModeComponent';
import { SelectionOption } from './SelectionOptionComponent';
import { GuessMode } from '../GuessMode'
import { QuizSet } from '../QuizSet'

export const SelectSettings = (props) => {

    function handleLevelNumberClick(index) {
        props.setSelectedLevel(index);
        document.body.click();
    }

    const popover = (
        <Popover id="popover-basic">
            <Popover.Body>
                <Row>
                    {Array.from({ length: 60 }, (_, i) => i + 1).map(index => {
                        return (
                            <Col key={'level-number-' + index} className='col-2 level-number'>
                                <Button onClick={() => { handleLevelNumberClick(index); }}>{index}</Button>
                            </Col>
                        );
                    })}
                </Row>
            </Popover.Body>
        </Popover>
    );

    const selectModeOptions = {
        "title": "Select Mode:",
        "onClickHandler": props.handleGuessModeSelection,
        "options": [
            {
                "id": "guess-meaning",
                "label": "Guess Meaning",
                "isChecked": () => { return props.guessMode === GuessMode.GUESS_MEANING },
            },
            {
                "id": "guess-reading",
                "label": "Guess Reading",
                "isChecked": () => { return props.guessMode === GuessMode.GUESS_READING },
            },
        ],
    };

    const selectQuizSetOptions = {
        "title": "Select Set:",
        "onClickHandler": props.handleQuizSetSelection,
        "options": [
            {
                "id": "kanji-set",
                "label": "Kanjis",
                "isChecked": () => { return props.quizSet === QuizSet.KANJI },
            },
            {
                "id": "vocabulary-set",
                "label": "Vocab",
                "isChecked": () => { return props.quizSet === QuizSet.VOCABULARY },
            },
        ],
    };

    return (
        <Row>
            <Col className='App-body'>
                <RadioSelectModeComponent config={selectModeOptions} />
                <Row className='select-title'>
                    <Col>
                        Select Level:
                    </Col>
                </Row>
                <RadioSelectModeComponent config={selectQuizSetOptions} />
                <Row className='mt-4 justify-content-center'>
                    <Col className='col-2'>
                        <Form onSubmit={props.handleSetSelection} data-option={'level'}>
                            <Row className='align-items-center'>
                                <Col className='justify-content-right'>
                                    <OverlayTrigger variant="dark" trigger="click" placement="right" rootClose="true" overlay={popover}>
                                        <Button className='selectedLevel'>{props.selectedLevel}</Button>
                                    </OverlayTrigger>
                                </Col>
                                <Col className='justify-content-left'>
                                    <Button type='submit'>Start Quiz</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>

                <Row className='select-title'>
                    <Col>
                        Preconfigured sets:
                    </Col>
                </Row>
                <SelectionOption handleSetSelectionCallback={props.handleSetSelection} dataOption={'jlpt5'}>JLPT N5</SelectionOption>
                <SelectionOption handleSetSelectionCallback={props.handleSetSelection} dataOption={'jlpt4'}>JLPT N4</SelectionOption>
                <SelectionOption handleSetSelectionCallback={props.handleSetSelection} dataOption={'jlpt3'}>JLPT N3</SelectionOption>
                <SelectionOption handleSetSelectionCallback={props.handleSetSelection} dataOption={'jlpt2'}>JLPT N2</SelectionOption>
                <SelectionOption handleSetSelectionCallback={props.handleSetSelection} dataOption={'full'}>Full Kanji Set</SelectionOption>
                <SelectionOption handleSetSelectionCallback={props.handleSetSelection} dataOption={'full-vocab'}>Full Vocabulary Set</SelectionOption>
                <SelectionOption handleSetSelectionCallback={props.handleSetSelection} dataOption={'test'}>Test</SelectionOption>
            </Col>
        </Row>
    );
}


export default SelectSettings;