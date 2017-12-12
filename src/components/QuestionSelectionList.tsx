import * as React from "react";
import { InputGroup, FormControl, ButtonToolbar, ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import Question from "../model/Question";
import AssessmentSession from "../model/AssessmentSession";
import QuestionSelection from "./QuestionSelection";
import FieldGroup from "./FieldGroup";
import IBaseProps from "../domain/IBaseProps";
import IAssociativeArray from "../domain/IAssociativeArray";
import { checkIfAnsweredCorrectly } from "../domain/AssessmentLogic";

export interface QuestionSelectionListProps extends IBaseProps {
  questions: Array<Question>;
  previousSessions: Array<AssessmentSession>;
  onSelectionChange: (questions: IAssociativeArray<boolean>) => void;
  selectedQuestions: IAssociativeArray<boolean>;
}

export default class QuestionSelectionList extends React.Component<QuestionSelectionListProps, undefined> {
  constructor(props: QuestionSelectionListProps) {
    super(props);

    this.selectNone = this.selectNone.bind(this);
    this.selectAll = this.selectAll.bind(this);
    this.selectAnsweredIncorrectlyLastTime = this.selectAnsweredIncorrectlyLastTime.bind(this);
  }

  selectNone(e: any){
    this.props.onSelectionChange(this.props.questions.reduce((acc, val) => { acc[val.id] = false; return acc; }, {} as IAssociativeArray<boolean>))
  }

  selectAll(e: any){
    this.props.onSelectionChange(this.props.questions.reduce((acc, val) => { acc[val.id] = true; return acc; }, {} as IAssociativeArray<boolean>))
  }

  selectAnsweredIncorrectlyLastTime(e: any){
    if (!e.target.checked) {
      return;
    }

    // Sorted by created on descending in SQL query
    let lastSession = this.props.previousSessions[0];
    let incorrectLastTime = lastSession.certification.questions.filter(q => !checkIfAnsweredCorrectly(q.answers, lastSession.answers[q.id].reduce((acc, val) => { acc[val] = true; return acc; }, { } as IAssociativeArray<boolean>)));

    this.props.onSelectionChange(this.props.questions.reduce((acc, val) => { acc[val.id] = incorrectLastTime.some(q => q.id === val.id); return acc; }, {} as IAssociativeArray<boolean>))
  }

  render(){
    return (
      <div>
        <p>Please select the questions you want to train during this assessment</p>
        <ButtonToolbar>
          <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
            <ToggleButton onClick={this.selectNone} value={1}>None</ToggleButton>
            <ToggleButton onClick={this.selectAll} value={2}>All</ToggleButton>
            <ToggleButton disabled={!this.props.previousSessions || !this.props.previousSessions.length} onClick={this.selectAnsweredIncorrectlyLastTime} value={3}>Answered Incorrectly Last Time</ToggleButton>
          </ToggleButtonGroup>
        </ButtonToolbar>
        <br />
        {
          this.props.questions.map(q => <QuestionSelection key={q.id} question={q} isSelected={this.props.selectedQuestions[q.id]} onSelectionChange={this.props.onSelectionChange} />)
        }
      </div>
    );
  }
}
