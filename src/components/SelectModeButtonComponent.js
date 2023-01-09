import { Button } from 'react-bootstrap';
export const SelectModeButton = (props) => {

    return (
        <Button id={props.id} className={props.checked ? 'select-mode-button-checked' : 'select-mode-button'} onClick={props.onClickHander}>{props.children}</Button>
    );
};

export default SelectModeButton;