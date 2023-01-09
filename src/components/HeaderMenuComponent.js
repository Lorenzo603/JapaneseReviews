import { useState } from 'react';
import { Col, Row , Dropdown } from 'react-bootstrap';
import { ScoreComponent } from './ScoreComponent';

export const HeaderMenu = (props) => {

    const [focusModeEnabled, setFocusModeEnabled] = useState(false);

    function toggleFocusMode() {
        setFocusModeEnabled(!focusModeEnabled);
    }

    const SessionMenu = (props) => {
        return (
            <Dropdown>
                <Dropdown.Toggle>
                    {focusModeEnabled ? "" : "Settings"}
                </Dropdown.Toggle>
                <Dropdown.Menu variant="dark">
                    <Dropdown.Item onClick={toggleFocusMode}>{focusModeEnabled ? "Disable Focus Mode" : "Enable Focus Mode"}</Dropdown.Item>
                    <Dropdown.Item onClick={props.endSessionHandler}>End Session</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    return (
        <Row>
            <Col className='hamburger-menu'>
                <SessionMenu endSessionHandler={props.endSessionHandler} />
            </Col>
            <Col>
                {!focusModeEnabled && <ScoreComponent totalAnswers={props.totalAnswers} totalCorrect={props.totalCorrect} totalReviews={props.totalReviews} />}
            </Col>
        </Row>
    );
}

export default HeaderMenu;