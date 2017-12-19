import * as React from "react";
import { Button, Panel, ButtonGroup } from "react-bootstrap";
import Question from "../model/Question";
import Answer from "../model/Answer";
import AnswerView from "./AnswerView";
import IAssociativeArray from "../domain/IAssociativeArray";

export interface QuestionViewProps {
    question: Question;
    checkedAnswers?: IAssociativeArray<boolean>;
    highlightCorrectAnswers: boolean;
    highlightIncorrectAnswers: boolean;
    answersDisabled: boolean;
    onAnswerChange?: (answer: Answer) => void;
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
        };
    }

    render() {
        const content =
            <div style={{ whiteSpace: "pre-wrap"}}>
                <h3>{ this.props.question.key }</h3>
                <p>{ this.props.question.text.value }</p>
                <ButtonGroup vertical block>
                  { this.props.question.answers ? (this.props.question.answers.map(a => (
                    <AnswerView onAnswerChange={ this.props.onAnswerChange } disabled={ this.props.answersDisabled } checked={ this.props.checkedAnswers ? (this.props.checkedAnswers[a.id] || false) : false } answer={ a } key={ a.id } highlightIfCorrect={ this.props.highlightCorrectAnswers } highlightIfIncorrect={ this.props.highlightIncorrectAnswers } />
                  ))) : <span>No answers found</span>}
                </ButtonGroup>
            </div>;

        return (
        <div key={ this.props.question.key }>
            <Panel>
                { content }
            </Panel>
        </div>);
    }
}
