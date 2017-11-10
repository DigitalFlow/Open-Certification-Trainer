import * as React from "react";
import { Button, Panel, ButtonGroup } from "react-bootstrap";
import Question from "../model/Question";
import AnswerView from "./AnswerView";

export interface QuestionViewProps {
    question: Question;
    highlightCorrectAnswers: boolean;
    highlightIncorrectAnswers: boolean;
    answersDisabled: boolean;
    onAnswerChange?: (key: string, checked: boolean) => void;
}

interface QuestionViewState {
    isCorrect: boolean;
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export default class QuestionView extends React.PureComponent<QuestionViewProps, QuestionViewState> {
    constructor(props: QuestionViewProps) {
        super(props);

        this.state = {
          isCorrect: false
        }
    }

    render(){
        let content = null;

        content =
            <div>
                <h3>{this.props.question.key}</h3>
                <p>{this.props.question.text.value}</p>
                <ButtonGroup vertical block type="checkbox">
                  {(this.props.question.answers.map(a => (
                    <AnswerView onAnswerChange={this.props.onAnswerChange} disabled={this.props.answersDisabled} checked={false} answer={a} key={a.key} highlightIfCorrect={this.props.highlightCorrectAnswers} highlightIfIncorrect={this.props.highlightIncorrectAnswers} />
                  )))}
                </ButtonGroup>
            </div>;

        return (
        <div key={this.props.question.key}>
            <Panel>
                {content}
            </Panel>
        </div>);
    }
}
