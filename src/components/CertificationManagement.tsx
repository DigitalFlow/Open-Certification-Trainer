import * as React from "react";
import { ButtonGroup, ButtonToolbar, Button, MenuItem, Well } from "react-bootstrap";
import Certification from "../model/Certification";
import QuestionView from "./QuestionView";
import SideNav from "./SideNav";

export interface CertificationManagementProps {
  match: any;
  location: Location;
 }

interface CertificationManagementState {
  certification: Certification;
  activeQuestion: number;
}

export default class CertificationManagement extends React.Component<CertificationManagementProps, CertificationManagementState> {
  constructor(props: CertificationManagementProps){
      super(props);

      this.state = {
        certification: null,
        activeQuestion: 0
      };

      this.loadCourses = this.loadCourses.bind(this);
      this.createNewCertification = this.createNewCertification.bind(this);
      this.reset = this.reset.bind(this);
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
      certification: null
    });
  }

  render(){
      let content = (<div>Please select a course from the sidenav, or click the new button for creating a new course</div>);

      if (this.state.certification){
        content = (
          <div>
            <h1>{this.state.certification.name}</h1>
            {this.state.certification.questions ? (this.state.certification.questions.map(q =>
              (<QuestionView question={q} key={q.key} highlightCorrectAnswers={true} highlightIncorrectAnswers={false} answersDisabled={true} />)
            )) : <span>No questions found</span>}
          </div>);
      }

      return (<div>
              <SideNav redirectComponent="certificationEditor" />
              <Well className="col-xs-11 pull-right">
                <ButtonToolbar>
                  <ButtonGroup>
                    <Button onClick={this.createNewCertification}>Create New Certification</Button>
                  </ButtonGroup>
                </ButtonToolbar>
                {content}
              </Well>
          </div>);
  }
}
