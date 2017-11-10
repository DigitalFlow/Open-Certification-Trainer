import * as React from "react";
import { MenuItem, Modal, ModalBody, ButtonGroup, DropdownButton, Button, Well, ProgressBar, Panel } from "react-bootstrap";
import Certification from "../model/Certification";
import Answer from "../model/Answer";
import QuestionView from "./QuestionView";
import SideNav from "./SideNav";

export interface AssessmentProps {
  match: any;
  location: Location;
 }

interface AssessmentState {
  certification: Certification;
  activeQuestion: number;
  lastAnsweredQuestion: number;
  activeQuestionAnswered: boolean;
  checkingAnswers: boolean;
  questionState: QuestionState;
  correctAnswers: number;
}

enum QuestionState {
  Open,
  Correct,
  Incorrect
}

export default class Assessment extends React.Component<AssessmentProps, AssessmentState> {
  checkedAnswers: any;

  constructor(props: AssessmentProps){
      super(props);

      this.checkedAnswers = {};

      this.state = {
        certification: null,
        activeQuestion: 0,
        lastAnsweredQuestion: 0,
        activeQuestionAnswered: false,
        checkingAnswers: false,
        questionState: QuestionState.Open,
        correctAnswers: 0
      };

      this.loadCourses = this.loadCourses.bind(this);
      this.nextQuestion = this.nextQuestion.bind(this);
      this.previousQuestion = this.previousQuestion.bind(this);
      this.checkAnswer = this.checkAnswer.bind(this);
      this.answerChangedHandler = this.answerChangedHandler.bind(this);
      this.reset = this.reset.bind(this);
  }

  answerChangedHandler(key: string, checked: boolean){
    this.checkedAnswers[key] = checked;
  }

  reset(){
    this.setState({
      activeQuestion: 0,
      certification: null
    });
  }

  shouldComponentUpdate(nextProps: AssessmentProps, nextState: AssessmentState){
    if (this.props.location.pathname != nextProps.location.pathname){
      return true;
    }

    if (this.state.certification != nextState.certification) {
      return true;
    }

    if (this.state.activeQuestion != nextState.activeQuestion) {
      return true;
    }

    if (this.state.checkingAnswers != nextState.checkingAnswers){
      return true;
    }

    return false;
  }

  loadCourses(props: AssessmentProps){
    let courseName = props.match.params.courseName;

    if (!courseName) {
      return;
    }

    fetch("/courses/" + courseName)
      .then(results => {
        return results.json();
      })
      .then(data => {
        this.setState({certification: data as Certification});
      });
  }

  componentDidMount(){
    this.loadCourses(this.props);
  }

  componentWillReceiveProps(props: AssessmentProps){
    if (this.props.location.pathname != props.location.pathname){
      this.reset();
    }

    this.loadCourses(props);
  }

  previousQuestion(){
    if (this.state.activeQuestion > 0){
      this.setState({activeQuestion: this.state.activeQuestion - 1});
    }
  }

  nextQuestion(){
    this.checkedAnswers = {};

    this.setState({
      activeQuestion: this.state.activeQuestion + 1,
      checkingAnswers: false,
      questionState: QuestionState.Open
    });
  }

  checkAnswer(){
    let answers = this.state.certification.questions[this.state.activeQuestion].answers;
    let questionAnsweredCorrectly = true;

    for (let i = 0; i < answers.length; i++){
      let answer = answers[i];

      if (answer.isCorrect && !this.checkedAnswers[answer.key]) {
        questionAnsweredCorrectly = false;
        break;
      }

      if(!answer.isCorrect && this.checkedAnswers[answer.key]) {
        questionAnsweredCorrectly = false;
        break;
      }
    }

    this.setState({
      lastAnsweredQuestion: this.state.activeQuestion,
      checkingAnswers: true,
      questionState: questionAnsweredCorrectly ? QuestionState.Correct : QuestionState.Incorrect,
      correctAnswers: questionAnsweredCorrectly ? this.state.correctAnswers + 1 : this.state.correctAnswers,
    });
  }

  render(){
      let content = (<div>Please select a course from the sidenav</div>);

      if (this.state.certification){

        if (this.state.certification.questions && this.state.certification.questions.length){

          let activeQuestion = this.state.certification.questions[this.state.activeQuestion];
          // <Button onClick={this.previousQuestion}>Previous</Button>

          if (this.state.activeQuestion < this.state.certification.questions.length) {
            let progress = ((this.state.activeQuestion + 1) / this.state.certification.questions.length) * 100;

            content = (
              <div>
                <h1>{this.state.certification.name}</h1>
                <ProgressBar striped now={progress} />
                <QuestionView onAnswerChange={this.answerChangedHandler} question={activeQuestion} key={activeQuestion.key} highlightCorrectAnswers={this.state.checkingAnswers} highlightIncorrectAnswers={this.state.checkingAnswers} answersDisabled={this.state.checkingAnswers} />
                {this.state.questionState === QuestionState.Open ? (<Button onClick={this.checkAnswer}>Check Answer</Button>) : <div/>}
                {this.state.questionState === QuestionState.Correct ? <span style={{color:"green"}}>Correct Response</span> : <div/>}
                {this.state.questionState === QuestionState.Incorrect ? <span style={{color:"red"}}>Incorrect Response</span> : <div/>}
                {this.state.checkingAnswers ? (<Button onClick={this.nextQuestion}>Next</Button>) : <div/>}
              </div>
            );
          }
          else
          {
            let questionCount = this.state.certification.questions.length;
            let resultPercentage = (this.state.correctAnswers / questionCount) * 100;

            if (resultPercentage >= 70) {
              content = (
                <div>
                  <h2>Congratulations!</h2>
                  <p>You passed the exam with {this.state.correctAnswers} correct answers out of {questionCount} questions.
                  <br/>
                  In respect to the 70% correct answer passing ratio, you passed having {resultPercentage}% of the questions answered correctly.
                  </p>
                </div>
              );
            }
            else
            {
              content = (
                <div>
                  <h2>Sorry!</h2>
                  <p>You did not pass the exam with {this.state.correctAnswers} correct answers out of {questionCount} questions.
                  <br/>
                  In respect to the 70% correct answer passing ratio, you failed having {resultPercentage}% of the questions answered correctly.
                  Try again and don't give up!
                  </p>
                </div>
              );
            }
          }
        }
        else
        {
          content = (
            <div>
              <h1>{this.state.certification.name}</h1>
              <span>No questions found</span>
            </div>);
        }
      }

      return (<div>
              <SideNav redirectComponent="assessment" />
              <Well className="col-xs-11 pull-right">
                {content}
              </Well>
          </div>);
  }
}
