import * as React from "react";
import { Button, Form, FormControl, FormGroup, InputGroup, Checkbox } from "react-bootstrap";
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
      const checked = e.target.checked;
      const answer = this.props.answer;
      const update = { ...answer, isCorrect: checked };

      this.props.onAnswerChange(update);
    }

    onTextChange (e: any) {
      const value = e.target.value;
      const answer = this.props.answer;
      const update = { ...answer, text: new Text({ value: value }) };

      this.props.onAnswerChange(update);
    }

    render() {
        return (
          <Form>
            <br />
            <div className="col-xs-11">
              <InputGroup>
                <InputGroup.Addon>
                  <input type="checkbox" key={ this.props.answer.id + "_aC" } checked={ this.props.answer.isCorrect } onChange={ this.onCheckChange } />
                </InputGroup.Addon>
                <FormControl key={ this.props.answer.id + "_aT" } type="text" value={ this.props.answer.text ? this.props.answer.text.value : "" } onChange={ this.onTextChange } />
              </InputGroup>
            </div>
            <div className="col-xs-1">
              <Button bsStyle="danger" onClick={ this.props.requestDeletion }>Delete</Button>
            </div>
            <br />
          </Form>
        );
    }
}
