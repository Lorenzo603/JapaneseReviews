import { Row, Col } from "react-bootstrap";

export const ScoreComponent = (props) => {

    const percentage = props.totalAnswers === 0 ? 0 : Math.round(props.totalCorrect / props.totalAnswers * 100, 2);

    function Tally() {
        return <span>{props.totalCorrect}/{props.totalAnswers}</span>
    }
    
    function Percentage() {
        return <span>{percentage}%</span>;
    }

    function TotalReviews() {
        return <span>{props.totalReviews}</span>;
    }

    return (
        <Row className='score'>
            <Col className="col-10"><Tally /></Col>
            <Col className="col-1 text-center"><Percentage /></Col>
            <Col className="col-1 text-center total-reviews"><TotalReviews /></Col>
        </Row >
    );
}

export default ScoreComponent;