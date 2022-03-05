import * as React from "react";
import { Button, Panel, ButtonToolbar, Checkbox } from "react-bootstrap";
import Answer from "../model/Answer";
import Question from "../model/Question";
import Certification from "../model/Certification";
import IAssociativeArray from "../domain/IAssociativeArray";
import { checkIfAnsweredCorrectly, retrieveCorrectAnswers } from "../domain/AssessmentLogic";
import AssessmentSession from "../model/AssessmentSession";
import QuestionView from "./QuestionView";
import { Doughnut } from "react-chartjs-2";

export interface SessionRecapProps {
    session: AssessmentSession;
}

interface SessionRecapState {
  showCorrectQuestions: boolean;
  showIncorrectQuestions: boolean;
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export default class SessionRecap extends React.PureComponent<SessionRecapProps, SessionRecapState> {
  constructor(props: SessionRecapProps) {
      super(props);

      this.state = {
        showCorrectQuestions: false,
        showIncorrectQuestions: false
      };

      this.toggleShowCorrectQuestions = this.toggleShowCorrectQuestions.bind(this);
      this.toggleShowIncorrectQuestions = this.toggleShowIncorrectQuestions.bind(this);
  }

  toggleShowCorrectQuestions() {
    this.setState({ showCorrectQuestions: !this.state.showCorrectQuestions });
  }

  toggleShowIncorrectQuestions() {
    this.setState({ showIncorrectQuestions: !this.state.showIncorrectQuestions });
  }

  render() {
    const questions = this.props.session.certification.questions;
    const questionCount = questions.length;

    const correctAnswers = retrieveCorrectAnswers(questions, this.props.session.answers);
    const correctAnswerCount = correctAnswers.length;
    const incorrectAnswerCount = this.props.session.certification.questions.length - correctAnswerCount;

    const resultPercentage = (correctAnswerCount / questionCount) * 100;

    return (
      <div>
        <div className="col-xs-12">
          <h2>{ this.props.session.created_on }</h2>
        </div>
        <div className="col-xs-3">
          <p>Certification version: { this.props.session.certification.version }</p>
          <p>Questions: { this.props.session.certification.questions.length }</p>
          <p>Correct Questions: { correctAnswerCount }</p>
          <p>Incorrect Questions: { incorrectAnswerCount }</p>
          <p>Score: { resultPercentage }%</p>
          <p>Passed: { resultPercentage >= 70 ? "Yes" : "No" }</p>
        </div>
        <div className="col-xs-9">
          <Doughnut height={ 75 }
            data={ {
              labels: ["Correct", "Incorrect"],
              datasets: [{
                label: `Session Score`,
                borderWidth: 1,
                backgroundColor: ["#008000", "#FF0000"],
                hoverBackgroundColor: ["#008000", "#FF0000"],
                data: [correctAnswerCount, incorrectAnswerCount]
              }]
            } }
            options={ {
              responsive: true
            } }/>
        </div>
        <div className="col-xs-12">
          <Button onClick={ this.toggleShowCorrectQuestions }>
            Correctly answered questions
          </Button>
          <Panel expanded={ this.state.showCorrectQuestions }>
            {
              this.props.session.certification.questions.filter(q => correctAnswers.indexOf(q.id) !== -1).map(activeQuestion => {
                return <QuestionView checkedAnswers={ this.props.session.answers[activeQuestion.id].reduce((acc, val) => { acc[val] = true; return acc; }, { } as IAssociativeArray<boolean>) } question={ activeQuestion } key={ activeQuestion.id } highlightCorrectAnswers={ true } highlightIncorrectAnswers={ true } answersDisabled={ true } />;
              })
            }
          </Panel>

          <Button onClick={ this.toggleShowIncorrectQuestions }>
            Incorrectly answered questions
          </Button>
          <Panel expanded={ this.state.showIncorrectQuestions }>
          {
            this.props.session.certification.questions.filter(q => correctAnswers.indexOf(q.id) === -1).map(activeQuestion => {
              return <QuestionView checkedAnswers={ this.props.session.answers[activeQuestion.id].reduce((acc, val) => { acc[val] = true; return acc; }, { } as IAssociativeArray<boolean>) } question={ activeQuestion } key={ activeQuestion.id } highlightCorrectAnswers={ true } highlightIncorrectAnswers={ true } answersDisabled={ true } />;
            })
          }
          </Panel>
        </div>
      </div>
    );
  }
}
