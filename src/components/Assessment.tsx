import * as React from "react";
import { MenuItem, Modal, ModalBody, ButtonGroup, DropdownButton, Button, Well, ProgressBar, Panel } from "react-bootstrap";
import Certification from "../model/Certification";
import AssessmentSession from "../model/AssessmentSession";
import Answer from "../model/Answer";
import Question from "../model/Question";
import QuestionView from "./QuestionView";
import SideNav from "./SideNav";
import IBaseProps from "../domain/IBaseProps";
import * as uuid from "uuid/v4";
import IAssociativeArray from "../domain/IAssociativeArray";
import UserPromptModal from "./UserPromptModal";

interface AssessmentState {
  certification: Certification;
  activeQuestion: number;
  activeQuestionAnswered: boolean;
  checkingAnswers: boolean;
  questionState: QuestionState;
  checkedAnswers: IAssociativeArray<boolean>;
  session: AssessmentSession;
  showCorrectQuestions: boolean;
  showIncorrectQuestions: boolean;
  restartSessionModal: boolean;
}

enum QuestionState {
  Open,
  Correct,
  Incorrect
}

export default class Assessment extends React.Component<IBaseProps, AssessmentState> {
  getDefaultState = () => {
    return {
      certification: null,
      activeQuestion: 0,
      activeQuestionAnswered: false,
      checkingAnswers: false,
      questionState: QuestionState.Open,
      checkedAnswers: {},
      session: new AssessmentSession({ sessionId: uuid(), certification: null, answers: {}}),
      showCorrectQuestions: false,
      showIncorrectQuestions: false,
      restartSessionModal: false,
    } as AssessmentState;
  }

  constructor(props: IBaseProps){
      super(props);

      this.state = this.getDefaultState();

      this.loadCertification = this.loadCertification.bind(this);
      this.loadSession = this.loadSession.bind(this);
      this.loadHandler = this.loadHandler.bind(this);
      this.nextQuestion = this.nextQuestion.bind(this);
      this.checkAnswer = this.checkAnswer.bind(this);
      this.answerChangedHandler = this.answerChangedHandler.bind(this);
      this.reset = this.reset.bind(this);
      this.resetSession = this.resetSession.bind(this);
      this.toggleShowCorrectQuestions = this.toggleShowCorrectQuestions.bind(this);
      this.toggleShowIncorrectQuestions = this.toggleShowIncorrectQuestions.bind(this);
      this.showResetSessionPrompt = this.showResetSessionPrompt.bind(this);
      this.hideResetSessionPrompt = this.hideResetSessionPrompt.bind(this);
  }

  answerChangedHandler(answer: Answer){
    let answers = this.state.certification.questions[this.state.activeQuestion].answers;

    // If only one correct answer allowed, emulate select behavior, i.e. only one item selectable
    let sum = answers.map(a => a.isCorrect ? 1 : 0).reduce((acc: number, val: number) => acc + val, 0)

    let copy = {...this.state.checkedAnswers};

    if (sum <= 1) {
      copy = {};
    }

    copy[answer.id] = answer.isCorrect;
    this.setState({checkedAnswers: copy});
  }

  reset(){
    this.setState(this.getDefaultState());
  }

  shouldComponentUpdate(nextProps: IBaseProps, nextState: AssessmentState){
    if (this.props.location.pathname != nextProps.location.pathname){
      return true;
    }

    if (this.state.certification && !nextState.certification) {
      return true;
    }

    if (!this.state.certification && nextState.certification) {
      return true;
    }

    if (this.state.certification && nextState.certification && this.state.certification.id !== nextState.certification.id) {
      return true;
    }

    if (this.state.activeQuestion != nextState.activeQuestion) {
      return true;
    }

    if (this.state.checkingAnswers != nextState.checkingAnswers){
      return true;
    }

    if (this.state.checkedAnswers != nextState.checkedAnswers) {
      return true;
    }

    if (this.state.session && !nextState.session){
      return true;
    }

    if (!this.state.session && nextState.session){
      return true;
    }

    if (this.state.session && nextState.session && this.state.session.sessionId !== nextState.session.sessionId){
      return true;
    }

    if (this.state.showCorrectQuestions !== nextState.showCorrectQuestions) {
      return true;
    }

    if (this.state.showIncorrectQuestions !== nextState.showIncorrectQuestions) {
      return true;
    }

    if (this.state.restartSessionModal !== nextState.restartSessionModal) {
      return true;
    }

    return false;
  }

  // Shuffles array in-place
  shuffle<T>(array: Array<T>): void {
    let j, x, i;

    for (i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = array[i];
        array[i] = array[j];
        array[j] = x;
    }
  }

  shuffleAnswers(certification: Certification) {
    for (let i = 0; certification.questions && i < certification.questions.length; i++) {
      let question = certification.questions[i];

      this.shuffle<Answer>(question.answers);
    }
  }

  loadCertification(props: IBaseProps){
    let courseName = props.match.params.courseName;

    if (!courseName) {
      return;
    }

    fetch("/courses/" + courseName, {
      credentials: 'include'
    })
      .then(results => {
        return results.json();
      })
      .then(data => {
        this.shuffleAnswers(data);

        this.setState({certification: data as Certification, session: this.getDefaultState().session, activeQuestion: 0});
      });
  }

  loadSession(props: IBaseProps){
    let courseName = props.match.params.courseName;

    if (!courseName) {
      return Promise.resolve();
    }

    return fetch("/assessmentSession/" + courseName, {
      credentials: 'include'
    })
      .then(results => {
        return results.json();
      });
  }

  loadHandler(props: IBaseProps) {
    this.loadSession(props)
      .then((session: AssessmentSession) => {
        if (session && session.sessionId) {
          this.setState({certification: session.certification, session: session, activeQuestion: Object.keys(session.answers).length});
        }
        else {
          this.loadCertification(props);
        }
      })

  }

  componentDidMount(){
    this.loadHandler(this.props);
  }

  componentWillReceiveProps(props: IBaseProps){
    if (this.props.location.pathname != props.location.pathname){
      this.reset();
    }

    this.loadHandler(props);
  }

  nextQuestion(){
    this.setState({
      activeQuestion: this.state.activeQuestion + 1,
      checkingAnswers: false,
      questionState: QuestionState.Open,
      checkedAnswers: {}
    });
  }

  checkIfAnsweredCorrectly(answers: Array<Answer>, checkedAnswers: IAssociativeArray<boolean>){
    let questionAnsweredCorrectly = true;

    for (let i = 0; answers && i < answers.length; i++){
      let answer = answers[i];

      if (answer.isCorrect && !checkedAnswers[answer.id]) {
        questionAnsweredCorrectly = false;
        break;
      }

      if(!answer.isCorrect && checkedAnswers[answer.id]) {
        questionAnsweredCorrectly = false;
        break;
      }
    }

    return questionAnsweredCorrectly;
  }

  checkAnswer(){
    let question = this.state.certification.questions[this.state.activeQuestion]
    let answers = question.answers;
    let checkedAnswers = Object.keys(this.state.checkedAnswers).filter(k => this.state.checkedAnswers[k]);
    let questionAnsweredCorrectly = this.checkIfAnsweredCorrectly(answers, this.state.checkedAnswers);

    let sessionAnswers = { ...this.state.session.answers };
    sessionAnswers[question.id] = checkedAnswers;

    let assessmentSession = { ...this.state.session, certification: this.state.certification, answers: sessionAnswers } as AssessmentSession;

    let headers = new Headers();
    headers.set("Content-Type", "application/json");

    fetch("/assessmentSession",
    {
      method: "POST",
      headers: headers,
      credentials: 'include',
      body: JSON.stringify(assessmentSession)
    })
    .then(results => {
      this.setState({
        session: assessmentSession,
        checkingAnswers: true,
        questionState: questionAnsweredCorrectly ? QuestionState.Correct : QuestionState.Incorrect
      });
    })
  }

  resetSession() {
    let headers = new Headers();
    headers.set("Content-Type", "application/json");

    fetch("/assessmentSession/" + this.props.match.params.courseName, {
      method: "DELETE",
      headers: headers,
      credentials: 'include'
    })
      .then(results => {
        this.loadHandler(this.props);
      })
      .catch(err => {
        console.log(err);
      });
  }

  showResetSessionPrompt() {
    this.setState({
      restartSessionModal: true
    });
  }

  hideResetSessionPrompt() {
    this.setState({
      restartSessionModal: false
    });
  }

  toggleShowCorrectQuestions() {
    this.setState({showCorrectQuestions: !this.state.showCorrectQuestions});
  }

  toggleShowIncorrectQuestions() {
    this.setState({showIncorrectQuestions: !this.state.showIncorrectQuestions});
  }

  render(){
      let content = (<div>Please select a course from the sidenav</div>);

      if (this.state.certification)
      {
        if (this.state.certification.questions && this.state.certification.questions.length)
        {
          let activeQuestion = this.state.certification.questions[this.state.activeQuestion];
          let assessmentInProgress = this.state.activeQuestion < this.state.certification.questions.length;

          if (assessmentInProgress)
          {
            let progress = ((this.state.activeQuestion + 1) / this.state.certification.questions.length) * 100;

            content = (
              <div>
                <h1>{this.state.certification.name}</h1>
                <ProgressBar striped now={progress} />
                <QuestionView checkedAnswers={this.state.checkedAnswers} onAnswerChange={this.answerChangedHandler} question={activeQuestion} key={activeQuestion.id} highlightCorrectAnswers={this.state.checkingAnswers} highlightIncorrectAnswers={this.state.checkingAnswers} answersDisabled={this.state.checkingAnswers} />
                {this.state.questionState === QuestionState.Open ? (<Button onClick={this.checkAnswer}>Check Answer</Button>) : <div/>}
                {this.state.questionState === QuestionState.Correct ? <span style={{color:"green"}}>Correct Response</span> : <div/>}
                {this.state.questionState === QuestionState.Incorrect ? <span style={{color:"red"}}>Incorrect Response</span> : <div/>}
                {this.state.checkingAnswers && (<Button onClick={this.nextQuestion}>Next</Button>)}
                {assessmentInProgress && Object.keys(this.state.session.answers).length ? <Button className="pull-right" onClick={this.showResetSessionPrompt}>Restart</Button> : ""}
              </div>
            );
          }
          else
          {
            let questions = this.state.certification.questions;
            let questionCount = questions.length;
            let correctAnswers = new Array<string>();

            let correctAnswerCount = questions.reduce((acc: number, val: Question) => {
              let answeredCorrectly = this.checkIfAnsweredCorrectly(val.answers, this.state.session.answers[val.id].reduce((acc: IAssociativeArray<boolean>, val: string) => {
                acc[val] = true;
                return acc;
              }, { }));

              if (answeredCorrectly){
                correctAnswers.push(val.id);
                return ++acc;
              }
              return acc;
            }, 0);

            let resultPercentage = (correctAnswerCount / questionCount) * 100;
            let text = null;

            if (resultPercentage >= 70)
            {
              text = (
                <div>
                  <h2>Congratulations!</h2>
                  <p>You passed the exam with {correctAnswerCount} correct answers out of {questionCount} questions.
                  <br/>
                  In respect to the 70% correct answer passing ratio, you passed having {resultPercentage}% of the questions answered correctly.
                  </p>
                </div>
              );
            }
            else
            {
              text = (
                <div>
                  <h2>Sorry!</h2>
                  <p>You did not pass the exam with {correctAnswerCount} correct answers out of {questionCount} questions.
                  <br/>
                  In respect to the 70% correct answer passing ratio, you failed having {resultPercentage}% of the questions answered correctly.
                  Try again and don't give up!
                  </p>
                </div>
              );
            }

            content = (
              <div>
                {text}
                <Button onClick={this.toggleShowCorrectQuestions}>
                  Correctly answered questions
                </Button>
                <Panel collapsible expanded={this.state.showCorrectQuestions}>
                  {
                    this.state.certification.questions.filter(q => correctAnswers.indexOf(q.id) !== -1).map(activeQuestion => {
                      return <QuestionView checkedAnswers={this.state.session.answers[activeQuestion.id].reduce((acc, val) => {acc[val] = true; return acc;}, {} as IAssociativeArray<boolean>)} question={activeQuestion} key={activeQuestion.id} highlightCorrectAnswers={true} highlightIncorrectAnswers={true} answersDisabled={true} />;
                    })
                  }
                </Panel>

                <Button onClick={this.toggleShowIncorrectQuestions}>
                  Incorrectly answered questions
                </Button>
                <Panel collapsible expanded={this.state.showIncorrectQuestions}>
                {
                  this.state.certification.questions.filter(q => correctAnswers.indexOf(q.id) === -1).map(activeQuestion => {
                    return <QuestionView checkedAnswers={this.state.session.answers[activeQuestion.id].reduce((acc, val) => {acc[val] = true; return acc;}, {} as IAssociativeArray<boolean>)} question={activeQuestion} key={activeQuestion.id} highlightCorrectAnswers={true} highlightIncorrectAnswers={true} answersDisabled={true} />;
                  })
                }
                </Panel>
              </div>
            )
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
              <Well className="col-xs-10 pull-right">
                {this.state.restartSessionModal && <UserPromptModal yesCallBack={this.resetSession} finally={this.hideResetSessionPrompt} title="Restart Session" text="All your current progress will be lost and this session will be deleted. Continue?" />}
                {content}
              </Well>
          </div>);
  }
}
