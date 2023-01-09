import { Col, Row } from 'react-bootstrap';
import { SelectModeButton } from './SelectModeButtonComponent';
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
                        <SelectModeButton id="guess-meaning" onClickHander={props.handleGuessModeSelection} checked={props.guessMode === GuessMode.GUESS_MEANING}>Guess Meaning</SelectModeButton>
                        <SelectModeButton id="guess-reading" onClickHander={props.handleGuessModeSelection} checked={props.guessMode === GuessMode.GUESS_READING}>Guess Reading</SelectModeButton>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}

export default SelectModeComponent;