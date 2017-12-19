import * as React from "react";
import { Button, Panel, ButtonToolbar, Checkbox } from "react-bootstrap";
import Answer from "../model/Answer";

export interface AnswerViewProps {
    answer: Answer;
    onAnswerChange?: (answer: Answer) => void;
    checked: boolean;
    highlightIfCorrect: boolean;
    highlightIfIncorrect: boolean;
    disabled?: boolean;
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export default class AnswerView extends React.PureComponent<AnswerViewProps, undefined> {
    button: Button;

    constructor(props: AnswerViewProps) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    onChange (e: any) {
      const checked = e.target.checked;

      if (this.props.onAnswerChange) {
        this.props.onAnswerChange({ ...this.props.answer, isCorrect: checked });
      }

      this.setState({ checked: checked });
    }

    render() {
        let color = "";

        if (this.props.highlightIfCorrect && this.props.answer.isCorrect) {
          color = "green";
        }
        else if (this.props.highlightIfIncorrect && !this.props.answer.isCorrect && this.props.checked) {
          color = "red";
        }

        const style = {
          "color": color,
          "fontWeight": (this.props.answer.isCorrect && this.props.highlightIfCorrect ? "bold" : "normal") as React.CSSWideKeyword
        };

        return (
            <Checkbox disabled={ this.props.disabled } key={ this.props.answer.id + "_cb" } checked={ this.props.checked } onChange={ this.onChange }><span style={ style }>{ this.props.answer.text.value }</span></Checkbox>
        );
    }
}
