import * as React from "react";
import { Button, Panel, ButtonGroup } from "react-bootstrap";
import Question from "../model/Question";
import AnswerEditView from "./AnswerEditView";
import Answer from "../model/Answer";
import Text from "../model/Text";
import FieldGroup from "./FieldGroup";

export interface QuestionEditViewProps {
    question: Question;
    onQuestionChange?: (question: Question) => void;
}

interface QuestionEditViewState {
    question: Question;
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export default class QuestionEditView extends React.PureComponent<QuestionEditViewProps, QuestionEditViewState> {
    constructor(props: QuestionEditViewProps) {
        super(props);

        this.state = {
          question: props.question
        }

        this.onAnswerChange = this.onAnswerChange.bind(this);
        this.addAnswer = this.addAnswer.bind(this);
        this.onQuestionTextChange = this.onQuestionTextChange.bind(this);
        this.onQuestionKeyChange = this.onQuestionKeyChange.bind(this);
    }

    onAnswerChange(answer: Answer){

    }

    onQuestionKeyChange (e: any) {
      let value = e.target.value;
      let question = this.state.question;

      question.key = value;

      if (this.props.onQuestionChange){
        this.props.onQuestionChange(question);
      }

      this.setState({question: question});
    }

    onQuestionTextChange (e: any) {
      let value = e.target.value;
      let question = this.state.question;

      question.text = new Text(value);

      if (this.props.onQuestionChange){
        this.props.onQuestionChange(question);
      }

      this.setState({question: question});
    }

    addAnswer(){
      let question = this.state.question;

      this.setState({question: {...question, answers: (question.answers || []).concat(new Answer({}))}});
    }

    deleteAnswer = (index: number) => {
      let question = this.state.question;
      let answers = (question.answers || []).filter((value, i) => i != index);
      let update = {...question, answers: answers};

      this.setState({question: update});
    }

    render(){
        let content = null;

        content =
            <div>
                <FieldGroup
                  id={this.state.question.key + "_questionText"}
                  control={{type: "text", value:this.state.question.key, onChange: this.onQuestionKeyChange}}
                  label="Key"
                />
                <FieldGroup
                  id={this.state.question.key + "_questionText"}
                  control={{type: "text", value:this.state.question.text? this.state.question.text.value : "", onChange: this.onQuestionTextChange}}
                  label="Question"
                />
                <Button disabled={this.state.question.answers.some(a => !a.text || !a.text.value)} onClick={this.addAnswer}>Add Answer</Button>
                <ButtonGroup vertical block type="checkbox">
                  {(this.state.question.answers.map((a, index) =>
                    {
                      let key = this.state.question.key + "_Answer_";

                      if (a.text && a.text.value) {
                        key += a.text.value;
                      }
                      else {
                        key += "empty";
                      }

                      return (<AnswerEditView key={key} onAnswerChange={this.onAnswerChange} answer={a} requestDeletion={() => this.deleteAnswer(index)} />)
                    }))}
                </ButtonGroup>
            </div>;

        return (
        <div key={this.state.question.key}>
            <Panel>
                {content}
            </Panel>
        </div>);
    }
}
