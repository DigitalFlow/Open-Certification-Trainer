import * as React from "react";
import { Button, Panel, ButtonToolbar, Checkbox } from "react-bootstrap";
import Answer from "../model/Answer";

export interface AnswerViewProps {
    answer: Answer;
    onAnswerChange: (key: string, checked: boolean) => void;
    checked: boolean;
    highlightIfCorrect: boolean;
    highlightIfIncorrect: boolean;
    disabled?: boolean;
}

interface AnswerViewState {
    checked: boolean;
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export default class AnswerView extends React.PureComponent<AnswerViewProps, AnswerViewState> {
    button: Button;

    constructor(props: AnswerViewProps) {
        super(props);

        this.state = {
          checked: false
        }

        this.onChange = this.onChange.bind(this);
    }

    onChange (e: any) {
      let checked = e.target.checked;

      if (this.props.onAnswerChange){
        this.props.onAnswerChange(this.props.answer.key, checked);
      }

      this.setState({checked: checked});
    }

    render(){
        let color = "";

        if (this.props.highlightIfCorrect && this.props.answer.isCorrect) {
          color = "green";
        }
        else if (this.props.highlightIfIncorrect && !this.props.answer.isCorrect && this.state.checked) {
          color = "red";
        }

        let style = {
          "color": color,
          "font-weight": this.props.answer.isCorrect && this.props.highlightIfCorrect ? "bold" : ""
        };

        return (
          <div>
            <Checkbox disabled={this.props.disabled} checked={this.state.checked} onChange={this.onChange}><span style={style}>{this.props.answer.text.value}</span></Checkbox>
          </div>
        );
    }
}