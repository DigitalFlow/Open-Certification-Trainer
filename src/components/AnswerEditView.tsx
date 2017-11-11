import * as React from "react";
import { Button, Form, Checkbox } from "react-bootstrap";
import Answer from "../model/Answer";
import Text from "../model/Text";
import FieldGroup from "./FieldGroup";

export interface AnswerEditViewProps {
    answer: Answer;
    onAnswerChange: (answer: Answer) => void;
    requestDeletion: () => void;
}

interface AnswerEditViewState {
    answer: Answer;
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export default class AnswerEditView extends React.PureComponent<AnswerEditViewProps, AnswerEditViewState> {
    button: Button;

    constructor(props: AnswerEditViewProps) {
        super(props);

        this.state = {
          answer: props.answer
        }

        this.onCheckChange = this.onCheckChange.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
    }

    onCheckChange (e: any) {
      let checked = e.target.checked;
      let answer = this.state.answer;

      answer.isCorrect = checked;

      if (this.props.onAnswerChange){
        this.props.onAnswerChange(answer);
      }

      this.setState({answer: answer});
    }

    onTextChange (e: any) {
      let value = e.target.value;
      let answer = this.state.answer;

      answer.text = new Text(value);

      if (this.props.onAnswerChange){
        this.props.onAnswerChange(answer);
      }

      this.setState({answer: answer});
    }

    render(){
        return (
          <Form inline>
            <Checkbox checked={this.state.answer.isCorrect} onChange={this.onCheckChange} />
            <FieldGroup
              id={this.state.answer.key + "cB"}
              control={{type: "text", value:this.state.answer.text ? this.state.answer.text.value : "", onChange: this.onTextChange}}
              label=""
            />
            <Button onClick={this.props.requestDeletion}>Delete</Button>
          </Form>
        );
    }
}
