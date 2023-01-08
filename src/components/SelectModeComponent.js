import { Col, Row, Form } from 'react-bootstrap';
import { GuessMode } from '../GuessMode'

export const SelectModeComponent = (props) => {

    return (
        <Row>
            <Col>
                <Row className='select-title'>
                    <Col>
                        Select Mode:
                    </Col>
                </Row>
                <Row className='justify-content-center'>
                    <Col className='col-2'>
                        <Form>
                            <Form.Check type="radio" name="guess-mode-radio-group" id="guess-meaning" label="Guess Meaning"
                                onChange={props.handleGuessModeSelection} checked={props.guessMode === GuessMode.GUESS_MEANING} />
                            <Form.Check type="radio" name="guess-mode-radio-group" id="guess-reading" label="Guess Reading"
                                onChange={props.handleGuessModeSelection} checked={props.guessMode === GuessMode.GUESS_READING} />
                        </Form>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}

export default SelectModeComponent;