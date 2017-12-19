import * as React from "react";
import { ButtonGroup, DropdownButton, MenuItem, Well } from "react-bootstrap";
import Certification from "../model/Certification";
import QuestionView from "./QuestionView";
import SideNav from "./SideNav";
import IBaseProps from "../domain/IBaseProps";

interface CertificationOverviewState {
  certification: Certification;
}

export default class CertificationOverview extends React.Component<IBaseProps, CertificationOverviewState> {
  getDefaultState = () => {
    return {
      certification: undefined
    } as CertificationOverviewState;
  }

  constructor(props: IBaseProps) {
      super(props);

      this.state = this.getDefaultState();

      this.loadCourses = this.loadCourses.bind(this);
      this.reset = this.reset.bind(this);
  }

  shouldComponentUpdate(nextProps: IBaseProps, nextState: CertificationOverviewState) {
    if (this.props.location.pathname != nextProps.location.pathname) {
      return true;
    }

    if (this.state.certification != nextState.certification) {
      return true;
    }

    return false;
  }

  loadCourses(props: IBaseProps) {
    const courseName = props.match.params.courseName;

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
        this.setState({ certification: data as Certification });
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

  render() {
      let content = (<div>Please select a course from the sidenav</div>);

      if (this.state.certification) {
        content = (
          <div>
          <p style={{"text-align": "right"}}>Version { this.state.certification.version }</p>
            <h1>{ this.state.certification.name }</h1>
            { this.state.certification.questions ? (this.state.certification.questions.map(q =>
              (<QuestionView question={ q } key={ q.id } highlightCorrectAnswers={ true } highlightIncorrectAnswers={ false } answersDisabled={ true } />)
            )) : <span>No questions found</span>}
          </div>);
      }

      return (<div>
              <SideNav redirectComponent="certificationOverview" />
              <Well className="col-xs-10 pull-right">
                { content }
              </Well>
          </div>);
  }
}
