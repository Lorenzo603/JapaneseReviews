import { Col, Row, Button } from 'react-bootstrap';

export const SelectionOption = (props) => {
    return (
        <Row>
            <Col>
                <Button onClick={props.handleSetSelectionCallback} data-option={props.dataOption}>
                    {props.children}
                </Button>
            </Col>
        </Row>
    );

}

export default SelectionOption;