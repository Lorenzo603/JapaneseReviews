import { Col, Row } from 'react-bootstrap';
import { SelectModeButton } from './SelectModeButtonComponent';

export const RadioSelectModeComponent = (props) => {

    return (
        <Row>
            <Col>
                <Row className='select-title'>
                    <Col>
                        {props.config.title}
                    </Col>
                </Row>
                <Row className='justify-content-center'>
                    <Col className='col-4'>
                        {
                            props.config.options.map(
                                option => {
                                    return (
                                        <SelectModeButton key={option.id}
                                            id={option.id}
                                            onClickHander={props.config.onClickHandler}
                                            checked={option.isChecked()}>
                                            {option.label}
                                        </SelectModeButton>);
                                }
                            )
                        }
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}

export default RadioSelectModeComponent;