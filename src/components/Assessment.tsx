import * as React from "react";
import { MenuItem, Modal, ModalBody, ButtonGroup, DropdownButton, Button, Well, ProgressBar, Panel } from "react-bootstrap";
import Certification from "../model/Certification";
import AssessmentSession from "../model/AssessmentSession";
import Answer from "../model/Answer";
import Question from "../model/Question";
import QuestionView from "./QuestionView";
import SideNav from "./SideNav";
import IBaseProps from "../domain/IBaseProps";
import * as uuid from "uuid";
import IAssociativeArray from "../domain/IAssociativeArray";
import UserPromptModal from "./UserPromptModal";
import { checkIfAnsweredCorrectly } from "../domain/AssessmentLogic";
import AssessmentResultView from "./AssessmentResultView";
import shuffle from "../domain/Shuffle";
import QuestionSelectionList from "./QuestionSelectionList";
import { withRouter } from "react-router-dom";

interface AssessmentState {
  certification: Certification;
  activeQuestion: number;
  activeQuestionAnswered: boolean;
  checkingAnswers: boolean;
  questionState: QuestionState;
  checkedAnswers: IAssociativeArray<boolean>;
  previousSessions: Array<AssessmentSession>;
  session: AssessmentSession;
  restartSessionModal: boolean;
  selectedQuestions: IAssociativeArray<boolean>;
  selectionTrigger: boolean;
}

enum QuestionState {
  Open,
  Correct,
  Incorrect
}

class Assessment extends React.Component<IBaseProps, AssessmentState> {
  getDefaultState = () => {
    return {
      certification: undefined,
      activeQuestion: -1,
      activeQuestionAnswered: false,
      checkingAnswers: false,
      questionState: QuestionState.Open,
      checkedAnswers: { },
      previousSessions: [],
      session: new AssessmentSession({ sessionId: uuid.v4(), certification: undefined, answers: { } }),
      restartSessionModal: false,
      selectedQuestions: { },
      selectionTrigger: false
    } as AssessmentState;
  }

  constructor(props: IBaseProps) {
      super(props);

      this.state = this.getDefaultState();

      this.loadCertification = this.loadCertification.bind(this);
      this.loadSession = this.loadSession.bind(this);
      this.loadSessionCollection = this.loadSessionCollection.bind(this);
      this.loadHandler = this.loadHandler.bind(this);
      this.start = this.start.bind(this);
      this.nextQuestion = this.nextQuestion.bind(this);
      this.checkAnswer = this.checkAnswer.bind(this);
      this.answerChangedHandler = this.answerChangedHandler.bind(this);
      this.reset = this.reset.bind(this);
      this.resetSession = this.resetSession.bind(this);
      this.showResetSessionPrompt = this.showResetSessionPrompt.bind(this);
      this.hideResetSessionPrompt = this.hideResetSessionPrompt.bind(this);
      this.onSelectionChange = this.onSelectionChange.bind(this);
  }

  answerChangedHandler(answer: Answer) {
    const answers = this.state.certification.questions[this.state.activeQuestion].answers;

    // If only one correct answer allowed, emulate select behavior, i.e. only one item selectable
    const sum = answers.map(a => a.isCorrect ? 1 : 0).reduce((acc: number, val: number) => acc + val, 0);

    let copy = { ...this.state.checkedAnswers };

    if (sum <= 1) {
      copy = { };
    }

    copy[answer.id] = answer.isCorrect;
    this.setState({ checkedAnswers: copy });
  }

  reset() {
    this.setState(this.getDefaultState());
  }

  shouldComponentUpdate(nextProps: IBaseProps, nextState: AssessmentState) {
    if (this.props.location.pathname != nextProps.location.pathname) {
      return true;
    }

    if (this.state.certification !== nextState.certification) {
      return true;
    }

    if (this.state.activeQuestion != nextState.activeQuestion) {
      return true;
    }

    if (this.state.checkingAnswers != nextState.checkingAnswers) {
      return true;
    }

    if (this.state.checkedAnswers != nextState.checkedAnswers) {
      return true;
    }

    if (this.state.session !== nextState.session) {
      return true;
    }

    if (this.state.restartSessionModal !== nextState.restartSessionModal) {
      return true;
    }

    if (this.state.selectionTrigger !== nextState.selectionTrigger) {
      return true;
    }

    return false;
  }

  shuffleCertification(certification: Certification) {
    shuffle<Question>(certification.questions);

    for (let i = 0; certification.questions && i < certification.questions.length; i++) {
      const question = certification.questions[i];

      shuffle<Answer>(question.answers);
    }

    return certification;
  }

  loadCertification(props: IBaseProps) {
    const courseName = (props.match.params as any).courseName;

    if (!courseName) {
      return;
    }

    fetch("/courses/" + courseName, {
      credentials: "include"
    })
      .then(results => {
        return results.json();
      })
      .then(data => {
        this.setState({ certification: data as Certification, session: this.getDefaultState().session, activeQuestion: -1, selectedQuestions: { } });
      });
  }

  loadSession(props: IBaseProps) {
    const courseName = (props.match.params as any).courseName;

    if (!courseName) {
      return Promise.resolve();
    }

    return fetch("/assessmentSession/" + courseName, {
      credentials: "include"
    })
      .then(results => {
        return results.json();
      });
  }

  loadSessionCollection (props: IBaseProps) {
    const courseName = (props.match.params as any).courseName;

    if (!courseName) {
      return Promise.resolve();
    }

    return fetch("/assessmentSessionCollection/" + courseName, {
      credentials: "include"
    })
      .then(results => {
        return results.json();
      })
      .then((sessions: Array<AssessmentSession>) => {
        this.setState({ previousSessions: sessions });
      });
  }

  loadHandler(props: IBaseProps) {
    this.loadSession(props)
      .then((session: AssessmentSession) => {
        if (session && session.sessionId) {
          this.setState({ certification: session.certification, session: session, activeQuestion: Object.keys(session.answers).length });
          return true;
        }

        return false;
      })
      .then(loadedSession => {
        if (!loadedSession) {
          this.loadSessionCollection(props);
        }
        return loadedSession;
      })
      .then(loadedSession => {
        if (!loadedSession) {
          this.loadCertification(props);
        }
      });
  }

  componentDidMount() {
    this.loadHandler(this.props);
  }

  componentWillReceiveProps(props: IBaseProps) {
    if (this.props.location.pathname != props.location.pathname) {
      this.reset();
    }

    this.loadHandler(props);
  }

  start() {
    const filteredCertification = { ...this.state.certification, questions: this.state.certification.questions.filter(q => this.state.selectedQuestions[q.id]) };

    this.setState({
      certification: this.shuffleCertification(filteredCertification),
      activeQuestion: this.state.activeQuestion + 1,
      checkingAnswers: false,
      questionState: QuestionState.Open,
      checkedAnswers: { }
    });
  }

  nextQuestion() {
    this.setState({
      activeQuestion: this.state.activeQuestion + 1,
      checkingAnswers: false,
      questionState: QuestionState.Open,
      checkedAnswers: { }
    });
  }

  checkAnswer() {
    const question = this.state.certification.questions[this.state.activeQuestion];
    const answers = question.answers;
    const checkedAnswers = Object.keys(this.state.checkedAnswers).filter(k => this.state.checkedAnswers[k]);
    const questionAnsweredCorrectly = checkIfAnsweredCorrectly(answers, this.state.checkedAnswers);

    const sessionAnswers = { ...this.state.session.answers };
    sessionAnswers[question.id] = checkedAnswers;

    const assessmentSession = { ...this.state.session, certification: this.state.certification, answers: sessionAnswers } as AssessmentSession;

    const headers = new Headers();
    headers.set("Content-Type", "application/json");

    fetch("/assessmentSession",
    {
        method: "POST",
        headers: headers,
        credentials: "include",
        body: JSON.stringify(assessmentSession)
    })
    .then(results => {
        this.setState({
            session: assessmentSession,
            checkingAnswers: true,
            questionState: questionAnsweredCorrectly ? QuestionState.Correct : QuestionState.Incorrect
        });
    });
  }

  resetSession() {
    const headers = new Headers();
    headers.set("Content-Type", "application/json");

    fetch("/assessmentSession/" + (this.props.match.params as any).courseName, {
      method: "DELETE",
      headers: headers,
      credentials: "include"
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

  onSelectionChange (questions: IAssociativeArray<boolean>) {
    const update = { ...this.state.selectedQuestions };

    for (const key in questions) {
      if (!questions.hasOwnProperty(key)) {
        continue;
      }

      update[key] = questions[key];
    }

    this.setState({
      selectedQuestions: update,
      selectionTrigger: !this.state.selectionTrigger
    });
  }

  render() {
      let content = (<div>Please select a course from the sidenav</div>);

      if (this.state.certification) {
        if (this.state.certification.questions && this.state.certification.questions.length) {
          if (this.state.activeQuestion > -1) {
            const activeQuestion = this.state.certification.questions[this.state.activeQuestion];
            const assessmentInProgress = this.state.activeQuestion < this.state.certification.questions.length;

            content = assessmentInProgress ?
            (
              <div>
                <p style={ { "textAlign": "right" } }>Version { this.state.certification.version }</p>
                <h1>{ this.state.certification.name }</h1>
                <ProgressBar striped now={ ((this.state.activeQuestion + 1) / this.state.certification.questions.length) * 100 } />
                <QuestionView checkedAnswers={ this.state.checkedAnswers } onAnswerChange={ this.answerChangedHandler } question={ activeQuestion } key={ activeQuestion.id } highlightCorrectAnswers={ this.state.checkingAnswers } highlightIncorrectAnswers={ this.state.checkingAnswers } answersDisabled={ this.state.checkingAnswers } />
                { this.state.questionState === QuestionState.Open ? (<Button onClick={ this.checkAnswer }>Check Answer</Button>) : <div/> }
                { this.state.checkingAnswers && (<Button onClick={ this.nextQuestion }>Next</Button>) }
                { this.state.questionState === QuestionState.Correct ? <p style={ { color: "green" } }>Correct Response</p> : <div/> }
                { this.state.questionState === QuestionState.Incorrect ? <p style={ { color: "red" } }>Incorrect Response</p> : <div/> }
                { assessmentInProgress && Object.keys(this.state.session.answers).length ? <Button className="pull-right" onClick={ this.showResetSessionPrompt }>Restart</Button> : "" }
              </div>
            )
            : (<AssessmentResultView session={ this.state.session } />);
          }
          else {
            content = (
              <div>
                <p style={ { "textAlign": "right" } }>Version { this.state.certification.version }</p>
                <h1>{ this.state.certification.name }</h1>
                <QuestionSelectionList {...this.props} questions={ this.state.certification.questions } onSelectionChange={ this.onSelectionChange } selectedQuestions={ this.state.selectedQuestions } previousSessions={ this.state.previousSessions } />
                <br />
                <Button disabled={ !Object.keys(this.state.selectedQuestions).some(k => this.state.selectedQuestions[k]) } onClick={ this.start }>Start</Button>
              </div>
            );
          }
        }
        else {
          content = (
            <div>
              <h1>{ this.state.certification.name }</h1>
              <span>No questions found</span>
            </div>);
        }
      }

      return (<div>
              <SideNav redirectComponent="assessment" />
              <Well className="col-xs-10 pull-right">
                { this.state.restartSessionModal && <UserPromptModal yesCallBack={ this.resetSession } finally={ this.hideResetSessionPrompt } title="Restart Session" text="All your current progress will be lost and this session will be deleted. Continue?" /> }
                { content }
              </Well>
          </div>);
  }
}

export default withRouter(Assessment);