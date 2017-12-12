import * as React from "react";
import { InputGroup, FormControl, MenuItem, Well } from "react-bootstrap";
import Question from "../model/Question";
import QuestionSelection from "./QuestionSelection";
import FieldGroup from "./FieldGroup";
import IBaseProps from "../domain/IBaseProps";
import IAssociativeArray from "../domain/IAssociativeArray";

export interface QuestionSelectionListProps extends IBaseProps {
  questions: Array<Question>;
  onSelectionChange: (questionId: string, selected: boolean) => void;
  selectedQuestions: IAssociativeArray<boolean>;
}

export default class QuestionSelectionList extends React.Component<QuestionSelectionListProps, undefined> {
  constructor(props: QuestionSelectionListProps) {
    super(props);
  }

  render(){
    return (
      <div>
        <p>Please select the questions you want to train during this assessment</p>
        {
          this.props.questions.map(q => <QuestionSelection key={q.id} question={q} isSelected={this.props.selectedQuestions[q.id]} onSelectionChange={this.props.onSelectionChange} />)
        }
      </div>
    );
  }
}
