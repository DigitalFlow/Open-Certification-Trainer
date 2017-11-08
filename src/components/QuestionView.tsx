import * as React from "react";
import { Button, Panel, ButtonGroup } from "react-bootstrap";
import Question from "../model/Question";
import AnswerView from "./AnswerView";

export interface QuestionViewProps {
    question: Question
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export default class QuestionView extends React.PureComponent<QuestionViewProps, any> {
    constructor(props: QuestionViewProps) {
        super(props);
    }

    render(){
        let content = null;

        content =
            <div>
                <h3>{this.props.question.key}</h3>
                <p>{this.props.question.text.value}</p>
                <ButtonGroup vertical block type="checkbox">
                  {Array.from(this.props.question.answers.map(a => (<AnswerView answer={a} key={a.key} />)))}
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
