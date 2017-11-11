import * as React from "react";
import { ButtonGroup, ButtonToolbar, Button, MenuItem, Well } from "react-bootstrap";
import Certification from "../model/Certification";
import QuestionEditView from "./QuestionEditView";
import SideNav from "./SideNav";
import FieldGroup from "./FieldGroup";
import MessageBar from "./MessageBar";
import ValidationResult from "../model/ValidationResult";

export interface CertificationManagementProps {
  match: any;
  location: Location;
 }

interface CertificationManagementState {
  certification: Certification;
  activeQuestion: number;
  errors: Array<string>;
  message: string;
}

export default class CertificationManagement extends React.Component<CertificationManagementProps, CertificationManagementState> {
  constructor(props: CertificationManagementProps){
      super(props);

      this.state = {
        certification: null,
        activeQuestion: 0,
        errors: [],
        message: ""
      };

      this.loadCourses = this.loadCourses.bind(this);
      this.createNewCertification = this.createNewCertification.bind(this);
      this.reset = this.reset.bind(this);
      this.save = this.save.bind(this);
      this.onNameChange = this.onNameChange.bind(this);
  }

  shouldComponentUpdate(nextProps: CertificationManagementProps, nextState: CertificationManagementState){
    if (this.props.location.pathname != nextProps.location.pathname){
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

    if (JSON.stringify(this.state.errors) !== JSON.stringify(nextState.errors)) {
      return true;
    }

    return false;
  }

  loadCourses(props: CertificationManagementProps){
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

  createNewCertification(){
    let headers = new Headers();
    headers.set("Content-Type", "application/json");

    fetch("/certificationUpload",
    {
      method: "POST",
      headers: headers,
      body: JSON.stringify({name: "MB2-XXX.json"})
    });
  }

  componentDidMount(){
    this.loadCourses(this.props);
  }

  componentWillReceiveProps(props: CertificationManagementProps){
    if (this.props.location.pathname != props.location.pathname){
      this.reset();
    }

    this.loadCourses(props);
  }

  reset(){
    this.setState({
      activeQuestion: 0,
      certification: null,
      errors: [],
      message: ""
    });
  }

  save(){
    let headers = new Headers();
    headers.set("Content-Type", "application/json");

    fetch("/certificationUpload",
    {
      method: "POST",
      headers: headers,
      body: JSON.stringify(this.state.certification),
    })
    .then(results => {
      return results.json();
    })
    .then((data: ValidationResult) => {
      this.setState({message: "Saved successfully", errors: []});
    })
    .catch(err => {
      this.setState({errors: ["Error during save"]})
    });
  }

  onNameChange(e: any){
    let cert = this.state.certification;
    let newName = e.target.value;

    cert.name = newName;

    this.setState({
      certification: cert
    });
  }

  render(){
      let content = (<div>Please select a course from the sidenav, or click the new button for creating a new course</div>);

      if (this.state.certification){
        content = (
          <div>
            <FieldGroup
              id="certificationNameText"
              control={{type: "text", value: this.state.certification.name, onChange: this.onNameChange}}
              label="Certification Name"
            />
            {this.state.certification.questions ? (this.state.certification.questions.map(q =>
              (<QuestionEditView question={q} key={q.key} />)
            )) : <span>No questions found</span>}
            </div>);
      }

      return (<div>
              <SideNav redirectComponent="certificationManagement" />
              <div className="col-xs-10 pull-right">
                <ButtonToolbar>
                  <ButtonGroup>
                    <Button onClick={this.createNewCertification}>Create New Certification</Button>
                    <Button onClick={this.save} type="submit">Save</Button>
                  </ButtonGroup>
                </ButtonToolbar>
                <MessageBar message={this.state.message} errors={this.state.errors} />
                <Well>
                  {content}
                </Well>
              </div>
          </div>);
  }
}
