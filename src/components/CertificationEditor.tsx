import * as React from "react";
import { ButtonGroup, ButtonToolbar, Button, MenuItem, Well } from "react-bootstrap";
import Certification from "../model/Certification";
import SideNav from "./SideNav";

export interface CertificationEditorProps {
  match: any;
  location: Location;
 }

interface CertificationEditorState {
  certification: Certification;
  activeQuestion: number;
}

export default class CertificationEditor extends React.Component<CertificationEditorProps, CertificationEditorState> {
  constructor(props: CertificationEditorProps){
      super(props);

      this.state = {
        certification: null,
        activeQuestion: 0
      };

      this.loadCourses = this.loadCourses.bind(this);
      this.createNewCertification = this.createNewCertification.bind(this);
      this.reset = this.reset.bind(this);
  }

  shouldComponentUpdate(nextProps: CertificationEditorProps, nextState: CertificationEditorState){
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

  loadCourses(props: CertificationEditorProps){
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

  componentWillReceiveProps(props: CertificationEditorProps){
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
      let content = (<div>Please select a course from the sidenav</div>);

      if (this.state.certification){
        content = (
          <div>
            <h1>{this.state.certification.name}</h1>
          </div>);
      }

      return (<div>
              <SideNav redirectComponent="certificationEditor" />
              <Well className="col-xs-11 pull-right">
                {content}
              </Well>
          </div>);
  }
}
