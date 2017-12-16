import * as React from "react";
import { Well, Panel } from "react-bootstrap";
import AssessmentSession from "../model/AssessmentSession";
import { calculateScore, calculateScorePerQuestion } from "../domain/AssessmentLogic";
import SideNav from "./SideNav";
import IBaseProps from "../domain/IBaseProps";
import SessionRecap from "./SessionRecap";
import { Line, Bar } from "react-chartjs-2";

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
    let questionRatio = calculateScorePerQuestion(this.state.previousSessions);

    if (this.props.match.params.courseName) {
      content = (
        <div>
          <h1>{this.props.match.params.courseName}: History</h1>

          <Panel>
            <h2>Score Progress</h2>
            <Line height={75}
              data={{
                labels: this.state.previousSessions.map(s => s.created_on).reverse(),
                datasets: [{
                  label: `Score Progress ${this.props.match.params.courseName}`,
                  backgroundColor: 'rgba(255,99,132,0.2)',
                  borderColor: 'rgba(255,99,132,1)',
                  borderWidth: 1,
                  hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                  hoverBorderColor: 'rgba(255,99,132,1)',
                  data: this.state.previousSessions.map(s => calculateScore(s.certification.questions, s.answers)).reverse(),
                }]
              }}
              options={{
                responsive: true,
                scales: {
                  yAxes: [{
                    display: true,
                    ticks: {
                      min: 0,
                      max: 100
                    }
                  }]
                }
              }}/>
          </Panel>

          <Panel>
            <h2>Question Scores</h2>
            <Bar height={75}
              data={{
                labels: Object.keys(questionRatio),
                datasets: [{
                  label: 'Score per question',
                  backgroundColor: 'rgba(255,99,132,0.2)',
                  borderColor: 'rgba(255,99,132,1)',
                  borderWidth: 1,
                  hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                  hoverBorderColor: 'rgba(255,99,132,1)',
                  data: Object.keys(questionRatio).map(k => questionRatio[k])
                }]
              }}
              options={{
                responsive: true,
                scales: {
                  yAxes: [{
                    display: true,
                    ticks: {
                      min: 0,
                      max: 100
                    }
                  }]
                }
              }}/>
          </Panel>

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
