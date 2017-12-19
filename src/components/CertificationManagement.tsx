import * as React from "react";
import { ButtonGroup, ButtonToolbar, Button, MenuItem, Well, Checkbox } from "react-bootstrap";
import Certification from "../model/Certification";
import QuestionEditView from "./QuestionEditView";
import FileUploadModal from "./FileUploadModal";
import UserPromptModal from "./UserPromptModal";
import TextInputModal from "./TextInputModal";
import SideNav from "./SideNav";
import FieldGroup from "./FieldGroup";
import MessageBar from "./MessageBar";
import ValidationResult from "../model/ValidationResult";
import * as uuid from "uuid/v4";
import Question from "../model/Question";
import Answer from "../model/Answer";
import { LinkContainer } from "react-router-bootstrap";
import IBaseProps from "../domain/IBaseProps";

interface CertificationManagementState {
  certification: Certification;
  activeQuestion: number;
  errors: Array<string>;
  message: string;
  uploadingFile: boolean;
  deletionRequested: boolean;
  addingMultipleQuestions: boolean;
  regeneratingKeys: boolean;
}

export default class CertificationManagement extends React.Component<IBaseProps, CertificationManagementState> {
  getDefaultState = () => {
    return {
      certification: undefined,
      activeQuestion: 0,
      errors: [],
      message: "",
      uploadingFile: false,
      deletionRequested: false,
      addingMultipleQuestions: false,
      regeneratingKeys: false
    } as CertificationManagementState;
  }

  constructor(props: IBaseProps) {
      super(props);

      this.state = this.getDefaultState();

      this.loadCourses = this.loadCourses.bind(this);
      this.reset = this.reset.bind(this);
      this.save = this.save.bind(this);
      this.onNameChange = this.onNameChange.bind(this);
      this.onVersionChange = this.onVersionChange.bind(this);
      this.onQuestionChange = this.onQuestionChange.bind(this);
      this.addQuestion = this.addQuestion.bind(this);
      this.addMultipleQuestions = this.addMultipleQuestions.bind(this);
      this.openMultipleQuestionsModal = this.openMultipleQuestionsModal.bind(this);
      this.openKeyRegenerationModal = this.openKeyRegenerationModal.bind(this);
      this.hideMultipleQuestionsModal = this.hideMultipleQuestionsModal.bind(this);
      this.hideKeyRegenerationModal = this.hideKeyRegenerationModal.bind(this);
      this.deleteQuestion = this.deleteQuestion.bind(this);
      this.setIds = this.setIds.bind(this);
      this.import = this.import.bind(this);
      this.loadImportedFile = this.loadImportedFile.bind(this);
      this.delete = this.delete.bind(this);
      this.export = this.export.bind(this);
      this.verifyAndDelete = this.verifyAndDelete.bind(this);
      this.hideDeletionPrompt = this.hideDeletionPrompt.bind(this);
      this.onUniqueNameChange = this.onUniqueNameChange.bind(this);
      this.onPublishedChange = this.onPublishedChange.bind(this);
      this.regenerateKeys = this.regenerateKeys.bind(this);
  }

  export () {
    window.open("/certificationApi/" + this.state.certification.uniqueName, "about: blank");
  }

  delete () {
    const headers = new Headers();
    headers.set("Content-Type", "application/json");

    fetch("/certificationApi/" + this.state.certification.uniqueName,
    {
      method: "DELETE",
      headers: headers,
      credentials: "include"
    })
    .then(results => {
      return results.json();
    })
    .then((data: ValidationResult) => {
      if (data.success) {
        this.setState({ message: data.message, errors: [] });
      }
      else {
        this.setState({ errors: data.errors });
      }
    })
    .catch(err => {
        this.setState({ errors: [err.message] });
    });
  }

  loadImportedFile(data: any) {
    let cert = data as Certification;

    if (!cert) {
      this.setState({ uploadingFile: false });
    }
    else {
      cert = this.setIds(cert);
      this.setState({ uploadingFile: false, certification: cert });
    }
  }

  shouldComponentUpdate(nextProps: IBaseProps, nextState: CertificationManagementState) {
    if (this.props.location.pathname != nextProps.location.pathname) {
      return true;
    }

    if (this.state.certification != nextState.certification) {
      return true;
    }

    if (this.state.activeQuestion != nextState.activeQuestion) {
      return true;
    }

    if (this.state.message != nextState.message) {
      return true;
    }

    if (this.state.deletionRequested != nextState.deletionRequested) {
      return true;
    }

    if (this.state.uploadingFile != nextState.uploadingFile) {
      return true;
    }

    if (this.state.addingMultipleQuestions != nextState.addingMultipleQuestions) {
      return true;
    }

    if (this.state.regeneratingKeys != nextState.regeneratingKeys) {
      return true;
    }

    if (JSON.stringify(this.state.errors) !== JSON.stringify(nextState.errors)) {
      return true;
    }

    return false;
  }

  setIds(cert: Certification) {
    if (!cert.id) {
      cert.id = uuid();
    }

    for (let i = 0; cert.questions && i < cert.questions.length; i++) {
      const question = cert.questions[i];

      if (!question.id) {
        question.id = uuid();
      }

      for (let j = 0; question.answers && j < question.answers.length; j++) {
        const answer = question.answers[j];

        if (!answer.id) {
          answer.id = uuid();
        }
      }
    }

    return cert;
  }

  loadCourses(props: IBaseProps) {
    const courseName = props.match.params.courseName;

    if (!courseName) {
      return;
    }
    else if (courseName === "new") {
      this.setState({ certification: new Certification({ id: uuid()})});
      return;
    }

    fetch(`/courses/${ courseName }`, {
      credentials: "include"
    })
      .then(results => {
        return results.json();
      })
      .then(data => {
        const cert = this.setIds(data as Certification);

        this.setState({ certification: cert });
      });
  }

  componentDidMount() {
    this.loadCourses(this.props);
  }

  componentWillReceiveProps(props: IBaseProps) {
    if (this.props.location.pathname != props.location.pathname) {
      this.reset();
    }

    this.loadCourses(props);
  }

  reset() {
    this.setState(this.getDefaultState());
  }

  setKeys(cert: Certification) {
    for (let i = 0; cert.questions && i < cert.questions.length; i++) {
      const question = cert.questions[i];
      question.position = i + 1;

      for (let j = 0; question.answers && j < question.answers.length; j++) {
        const answer = question.answers[j];

        answer.key = `${ j + 1}`;
      }
    }

    return cert;
  }

  save() {
    const headers = new Headers();
    headers.set("Content-Type", "application/json");

    fetch("/certificationApi",
    {
      method: "POST",
      headers: headers,
      body: JSON.stringify(this.setKeys({...this.state.certification })),
      credentials: "include"
    })
    .then(results => {
      return results.json();
    })
    .then((data: ValidationResult) => {
      if (data.success) {
        this.setState({ message: "Saved successfully", errors: []});
      }
      else {
        this.setState({ errors: data.errors });
      }
    })
    .catch(err => {
        this.setState({ errors: [err.message]});
    });
  }

  onNameChange(e: any) {
    const cert = this.state.certification;
    const newName = e.target.value;
    const update = {...cert, name: newName };

    this.setState({
      certification: update
    });
  }

  onVersionChange(e: any) {
    const cert = this.state.certification;
    const newVersion = e.target.value;
    const update = {...cert, version: newVersion };

    this.setState({
      certification: update
    });
  }

  onPublishedChange(e: any) {
    const cert = this.state.certification;
    const isPublished = e.target.checked;
    const update = {...cert, isPublished: isPublished };

    this.setState({
      certification: update
    });
  }

  onUniqueNameChange(e: any) {
    const cert = this.state.certification;
    const newName = e.target.value;
    const update = {...cert, uniqueName: newName };

    this.setState({
      certification: update
    });
  }

  onQuestionChange(index: number, question: Question) {
    const certification = this.state.certification;
    const questions = (certification.questions || []).map((value, i) => i != index ? value : question);
    const update = {...certification, questions: questions };

    this.setState({ certification: update });
  }

  deleteQuestion = (index: number) => {
    const certification = this.state.certification;
    const questions = (certification.questions || []).filter((value, i) => i != index);
    const update = {...certification, questions: questions };

    this.setState({ certification: update });
  }

  appendQuestion(certification: Certification) {
    const questions = (certification.questions || []).concat(new Question({
      id: uuid(),
      answers: [0, 0, 0, 0].map(() => new Answer({ id: uuid(), isCorrect: false }))
    }));
    const update = {...certification, questions: questions };

    return update;
  }

  addQuestion() {
    const update = this.appendQuestion(this.state.certification);

    this.setState({ certification: update });
  }

  addMultipleQuestions(value: string) {
    const count = parseInt(value);

    if (isNaN(count)) {
      return;
    }

    let update = this.state.certification;

    for (let i = 0; i < count; i++) {
      update = this.appendQuestion(update);
    }

    this.setState({ certification: update });
  }

  regenerateKeys(prefix: string) {
    const questions = this.state.certification.questions.map((q, index) => { return {...q, key: `${ prefix }${ index + 1}`}; });

    this.setState({ certification: {...this.state.certification, questions: questions }});
  }

  openMultipleQuestionsModal() {
    this.setState({ addingMultipleQuestions: true });
  }

  openKeyRegenerationModal() {
    this.setState({ regeneratingKeys: true });
  }

  hideMultipleQuestionsModal() {
    this.setState({ addingMultipleQuestions: false });
  }

  hideKeyRegenerationModal() {
    this.setState({ regeneratingKeys: false });
  }

  import() {
    this.setState({ uploadingFile: true });
  }

  verifyAndDelete() {
    this.setState({ deletionRequested: true });
  }

  hideDeletionPrompt() {
    this.setState({ deletionRequested: false });
  }

  render() {
      let content = (<div>Please select a course from the sidenav, or click the new button for creating a new course</div>);

      if (this.state.certification) {
        content = (
          <div id={ this.state.certification.id + "header"}>
            <FieldGroup
              id={ this.state.certification.id + "name"}
              control={{ type: "text", value: this.state.certification.name, onChange: this.onNameChange }}
              label="Certification Name"
            />
            <FieldGroup
              id={ this.state.certification.id + "uniqueName"}
              control={{ type: "text", disabled: this.props.match.params.courseName !== "new", value: this.state.certification.uniqueName, onChange: this.onUniqueNameChange }}
              label="Certification Unique Name"
            />
            <FieldGroup
              id={ this.state.certification.id + "version"}
              control={{ type: "text", value: this.state.certification.version, onChange: this.onVersionChange }}
              label="Version"
            />
            <Checkbox key={ this.state.certification.id + "_isPublished"} checked={ this.state.certification.isPublished } onChange={ this.onPublishedChange }>Is Published</Checkbox>
            { this.state.certification.questions ? (this.state.certification.questions.map((q, index) =>
              (<QuestionEditView onQuestionChange={(q: Question) => this.onQuestionChange(index, q)} requestDeletion={() => this.deleteQuestion(index)} question={ q } key={ q.id } />)
            )) : <span>No questions found</span>}
            </div>);
      }

      return (<div>
                <SideNav redirectComponent="certificationManagement" showUnpublished={ true } />
                { this.state.deletionRequested && <UserPromptModal title="Delete Cert" text={"Are you sure you want to delete " + this.state.certification.name + "?"} key="DeletionPromptModal" yesCallBack={ this.delete } finally={ this.hideDeletionPrompt } />}
                { this.state.addingMultipleQuestions && <TextInputModal title="Add multiple Questions" text={"How many questions do you want to add?"} key="AddMultipleQuestionsModal" yesCallBack={ this.addMultipleQuestions } finally={ this.hideMultipleQuestionsModal } />}
                { this.state.regeneratingKeys && <TextInputModal title="Regenerate question keys" text={"Please select a prefix for the index, i.e. 'NO. ' will give 'NO. 1' and so on."} key="RegenerateKeysModal" yesCallBack={ this.regenerateKeys } finally={ this.hideKeyRegenerationModal } />}
                { this.state.uploadingFile && <FileUploadModal key="FileUploadModal" fileCallBack={ this.loadImportedFile } />}
                <div className="col-xs-10 pull-right">
                  <ButtonToolbar>
                    <ButtonGroup>
                      <LinkContainer key={"newLink"} to={"/certificationManagement/new"}>
                        <Button bsStyle="default">Create New Certification</Button>
                      </LinkContainer>
                      { this.state.certification && <Button bsStyle="default" onClick={ this.import }>Import</Button>}
                      { this.state.certification && <Button bsStyle="default" onClick={ this.export }>Export</Button>}
                      { this.state.certification && <Button bsStyle="default" onClick={ this.addQuestion }>Add Question</Button>}
                      { this.state.certification && <Button bsStyle="default" onClick={ this.openMultipleQuestionsModal }>Add Multiple Questions</Button>}
                      { this.state.certification && <Button bsStyle="default" onClick={ this.openKeyRegenerationModal }>Regenerate Keys</Button>}
                      { this.state.certification && <Button bsStyle="default" onClick={ this.save }>Save</Button>}
                      { this.state.certification && this.props.match.params.courseName !== "new" && <Button bsStyle="danger" onClick={ this.verifyAndDelete }>Delete</Button>}
                    </ButtonGroup>
                  </ButtonToolbar>
                  <MessageBar message={ this.state.message } errors={ this.state.errors } />
                  <Well>
                    { content }
                  </Well>
                </div>
              </div>);
  }
}
