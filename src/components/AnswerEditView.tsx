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

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export default class AnswerEditView extends React.PureComponent<AnswerEditViewProps, undefined> {
    button: Button;

    constructor(props: AnswerEditViewProps) {
        super(props);

        this.onCheckChange = this.onCheckChange.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
    }

    onCheckChange (e: any) {
      let checked = e.target.checked;
      let answer = this.props.answer;
      let update = {...answer, isCorrect: checked};

      this.props.onAnswerChange(update);
    }

    onTextChange (e: any) {
      let value = e.target.value;
      let answer = this.props.answer;
      let update = {...answer, text: new Text({value: value})};

      this.props.onAnswerChange(update);
    }

    render(){
        return (
          <Form inline>
            <Checkbox checked={this.props.answer.isCorrect} onChange={this.onCheckChange} />
            <FieldGroup
              id={this.props.answer.id + "_aC"}
              control={{type: "text", value:this.props.answer.text ? this.props.answer.text.value : "", onChange: this.onTextChange}}
              label=""
            />
            <Button onClick={this.props.requestDeletion}>Delete</Button>
          </Form>
        );
    }
}
