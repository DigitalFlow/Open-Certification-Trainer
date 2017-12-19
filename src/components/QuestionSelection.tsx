import * as React from "react";
import { InputGroup, FormControl, MenuItem, Well } from "react-bootstrap";
import Question from "../model/Question";
import FieldGroup from "./FieldGroup";
import IBaseProps from "../domain/IBaseProps";
import IAssociativeArray from "../domain/IAssociativeArray";

export interface QuestionSelectionProps extends IBaseProps {
  question: Question;
  isSelected: boolean;
  onSelectionChange: (questions: IAssociativeArray<boolean>) => void;
}

export default class QuestionSelection extends React.PureComponent<QuestionSelectionProps, undefined> {
  constructor(props: QuestionSelectionProps) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(e: any) {
    const checked = e.target.checked;
    const update = { } as IAssociativeArray<boolean>;

    update[this.props.question.id] = checked;

    this.props.onSelectionChange(update);
  }

  render() {
      return (
        <InputGroup>
          <InputGroup.Addon>
            <input type="checkbox" key={ this.props.question.id + "_aC" } checked={ this.props.isSelected } onChange={ this.onChange } />
          </InputGroup.Addon>
          <FormControl key={ this.props.question.id + "_aT" } disabled type="text" value={ this.props.question.text ? `${ this.props.question.key }: ${ this.props.question.text.value }` : "" } />
        </InputGroup>
      );
  }
}
