import * as React from "react";
import { Button, Panel, ButtonGroup } from "react-bootstrap";
import Question from "../model/Question";
import AnswerEditView from "./AnswerEditView";
import Answer from "../model/Answer";
import Text from "../model/Text";
import FieldGroup from "./FieldGroup";
import * as uuid from "uuid/v4";

export interface QuestionEditViewProps {
    question: Question;
    onQuestionChange: (question: Question) => void;
    requestDeletion: () => void;
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export default class QuestionEditView extends React.PureComponent<QuestionEditViewProps, undefined> {
    constructor(props: QuestionEditViewProps) {
        super(props);

        this.onAnswerChange = this.onAnswerChange.bind(this);
        this.addAnswer = this.addAnswer.bind(this);
        this.deleteAnswer = this.deleteAnswer.bind(this);
        this.onQuestionTextChange = this.onQuestionTextChange.bind(this);
        this.onQuestionKeyChange = this.onQuestionKeyChange.bind(this);
    }

    shouldComponentUpdate(nextProps: QuestionEditViewProps) {
      const q = this.props.question;
      const nq = nextProps.question;

      if (q.key !== nq.key) {
        return true;
      }

      if (q.text !== nq.text) {
        return true;
      }

      if (!q.answers && nq.answers) {
        return true;
      }

      if (q.answers && !nq.answers) {
        return true;
      }

      if (q.answers && nq.answers && q.answers.length !== nq.answers.length) {
        return true;
      }

      if (q.answers && nq.answers && q.answers.some((a, index) => a !== nq.answers[index])) {
        return true;
      }

      return false;
    }


    onAnswerChange(index: number, answer: Answer) {
      const question = this.props.question;
      const answers = (question.answers || []).map((value, i) => i != index ? value : answer);
      const update = { ...question, answers: answers };

      this.props.onQuestionChange(update);
    }

    onQuestionKeyChange (e: any) {
      const value = e.target.value;
      const question = this.props.question;

      const update = { ...question, key: value };

      this.props.onQuestionChange(update);
    }

    onQuestionTextChange (e: any) {
      const value = e.target.value;
      const question = this.props.question;
      const update = { ...question, text: new Text({ value: value }) };

      this.props.onQuestionChange(update);
    }

    addAnswer() {
      const question = this.props.question;
      const update = { ...question, answers: (question.answers || []).concat(new Answer({ id: uuid(), isCorrect: false })) };

      this.props.onQuestionChange(update);
    }

    deleteAnswer (index: number) {
      const question = this.props.question;
      const answers = (question.answers || []).filter((value, i) => i != index);
      const update = { ...question, answers: answers };

      this.props.onQuestionChange(update);
    }

    render() {
        const content =
          <div key={ this.props.question.id + "header" }>
            <FieldGroup
              id={ this.props.question.id + "_qKey" }
              control={ { type: "text", value: this.props.question.key, onChange: this.onQuestionKeyChange } }
              label="Key"
            />
            <FieldGroup
              id={ this.props.question.id + "_qText" }
              control={ { componentClass: "textarea", rows: 3, value: this.props.question.text ? this.props.question.text.value : "", onChange: this.onQuestionTextChange } }
              label="Question"
            />
            <Button bsStyle="success" onClick={ this.addAnswer }>Add Answer</Button>
            <ButtonGroup vertical block type="checkbox">
              { this.props.question.answers && (this.props.question.answers.map((a, index) => {
                  return (<AnswerEditView key={ a.id } onAnswerChange={ (a: Answer) => this.onAnswerChange(index, a) } answer={ a } requestDeletion={ () => this.deleteAnswer(index) } />);
                })) }
            </ButtonGroup>
            <br />
            <br />
            <Button className="pull-right" bsStyle="danger" onClick={ this.props.requestDeletion }>Delete Question</Button>
          </div>;

        return (
            <Panel>
                { content }
            </Panel>);
    }
}
