import * as React from "react";
import { Button, Panel, ButtonToolbar } from "react-bootstrap";
import Answer from "../model/Answer";

export interface AnswerViewProps {
    answer: Answer
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export default class AnswerView extends React.PureComponent<AnswerViewProps, any> {
    constructor(props: AnswerViewProps) {
        super(props);
    }

    render(){
        return (
            <Button bsStyle={this.props.answer.isCorrect ? "success" : "danger"}>{this.props.answer.text.value}</Button>
        );
    }
}
