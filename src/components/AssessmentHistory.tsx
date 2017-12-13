import * as React from "react";
import { Well, Panel } from "react-bootstrap";
import AssessmentSession from "../model/AssessmentSession";
import SideNav from "./SideNav";
import IBaseProps from "../domain/IBaseProps";
import SessionRecap from "./SessionRecap";

interface AssessmentHistoryState {
  previousSessions: Array<AssessmentSession>;
}

export default class AssessmentHistory extends React.Component<IBaseProps, AssessmentHistoryState> {
  getDefaultState = () => {
    return {
      previousSessions: [],
    } as AssessmentHistoryState;
  }

  constructor(props: IBaseProps){
      super(props);

      this.state = this.getDefaultState();

      this.loadSessionCollection = this.loadSessionCollection.bind(this);
      this.reset = this.reset.bind(this);
  }

  loadSessionCollection (props: IBaseProps){
    let courseName = props.match.params.courseName;

    if (!courseName) {
      return Promise.resolve();
    }

    return fetch("/assessmentSessionCollection/" + courseName, {
      credentials: 'include'
    })
      .then(results => {
        return results.json();
      })
      .then((sessions: Array<AssessmentSession>) => {
        this.setState({previousSessions: sessions});
      });
  }

  componentDidMount(){
    this.loadSessionCollection(this.props);
  }

  reset () {
    this.setState(this.getDefaultState());
  }

  componentWillReceiveProps(props: IBaseProps){
    if (this.props.location.pathname != props.location.pathname){
      this.reset();
    }

    this.loadSessionCollection(props);
  }

  render(){
    let content = (<div>Please select a course from the sidenav</div>);

    if (this.props.match.params.courseName) {
      content = (
        <div>
          <h1>{this.props.match.params.courseName}: History</h1>
          {this.state.previousSessions.map(s => {
            return (
              <Panel>
                <SessionRecap session={s} />
              </Panel>
            );
          })}
        </div>
      );
    }

    return (
      <div>
        <SideNav redirectComponent="assessmentHistory" />
        <Well className="col-xs-10 pull-right">
          {content}
        </Well>
      </div>
    );
  }
}
