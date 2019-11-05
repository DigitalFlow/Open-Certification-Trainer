import * as React from "react";
import { Button, Panel, ButtonGroup } from "react-bootstrap";
import Question from "../model/Question";
import Answer from "../model/Answer";
import AnswerView from "./AnswerView";
import IAssociativeArray from "../domain/IAssociativeArray";
import * as ReactMarkdown from "react-markdown";

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
            <div style={ { whiteSpace: "pre-wrap" } }>
                <h3>{ this.props.question.key }</h3>
                <ReactMarkdown
                          key={ this.props.question.id + "_question" }
                          className="result"
                          source={ this.props.question.text ? this.props.question.text.value : "" }
                          skipHtml={ true }
                          escapeHtml={ true }
                />
                <ButtonGroup vertical block>
                  { this.props.question.answers ? (this.props.question.answers.map(a => (
                    <AnswerView onAnswerChange={ this.props.onAnswerChange } disabled={ this.props.answersDisabled } checked={ this.props.checkedAnswers ? (this.props.checkedAnswers[a.id] || false) : false } answer={ a } key={ a.id } highlightIfCorrect={ this.props.highlightCorrectAnswers } highlightIfIncorrect={ this.props.highlightIncorrectAnswers } />
                  ))) : <span>No answers found</span> }
                </ButtonGroup>
                { this.props.answersDisabled && this.props.question.explanation && this.props.question.explanation.value &&
                    (<div>
                        <h4>Explanation</h4>
                        <ReactMarkdown
                          key={ this.props.question.id + "_explanation" }
                          className="result"
                          source={ this.props.question.explanation ? this.props.question.explanation.value : "" }
                          skipHtml={ true }
                          escapeHtml={ true }
                        />
                    </div>)
                }
            </div>;

        return (
        <div key={ this.props.question.key }>
            <Panel>
                { content }
            </Panel>
        </div>);
    }
}
