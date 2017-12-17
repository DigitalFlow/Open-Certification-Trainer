import * as React from "react";
import { Well, Panel } from "react-bootstrap";
import AssessmentSession from "../model/AssessmentSession";
import Certification from "../model/Certification";
import { calculateScore, calculateScorePerQuestion } from "../domain/AssessmentLogic";
import SideNav from "./SideNav";
import IBaseProps from "../domain/IBaseProps";
import SessionRecap from "./SessionRecap";
import { Line, Bar } from "react-chartjs-2";

interface AssessmentHistoryState {
  certification: Certification;
  previousSessions: Array<AssessmentSession>;
}

export default class AssessmentHistory extends React.PureComponent<IBaseProps, AssessmentHistoryState> {
  getDefaultState = () => {
    return {
      certification: null,
      previousSessions: [],
    } as AssessmentHistoryState;
  }

  constructor(props: IBaseProps){
      super(props);

      this.state = this.getDefaultState();

      this.loadSessionCollection = this.loadSessionCollection.bind(this);
      this.loadCertification = this.loadCertification.bind(this);
      this.reset = this.reset.bind(this);
  }

  loadCertification(props: IBaseProps){
    let courseName = props.match.params.courseName;

    if (!courseName) {
      return Promise.resolve({} as Certification);
    }

    return fetch("/courses/" + courseName, {
      credentials: 'include'
    })
      .then(results => {
        return results.json();
      })
      .then(data => {
        return data as Certification;
      });
  }

  loadSessionCollection (props: IBaseProps, certification: Certification){
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
        this.setState({
          certification: certification,
          previousSessions: sessions
        });
      });
  }

  loadHandler(props: IBaseProps) {
    this.loadCertification(props)
    .then(certification => {
      this.loadSessionCollection(props, certification);
    });
  }

  componentDidMount(){
    this.loadHandler(this.props);
  }

  reset () {
    this.setState(this.getDefaultState());
  }

  componentWillReceiveProps(props: IBaseProps){
    if (this.props.location.pathname != props.location.pathname){
      this.reset();
    }

    this.loadHandler(props);
  }

  render(){
    let content = (<div>Please select a course from the sidenav</div>);
    let questionRatio = calculateScorePerQuestion(this.state.previousSessions);

    let sortable = new Array<Array<string | number>>();

    for (let questionId in questionRatio) {
      let item = [questionId, questionRatio[questionId]];
      sortable.push(item);
    }

    sortable = sortable.filter(arr => this.state.certification.questions && this.state.certification.questions.some(q => q.id === arr[0]));
    sortable = sortable.map(arr => {
      let question = this.state.certification.questions.find(q => q.id === arr[0]);

      return [question.key, arr[1], question.position]
    });

    sortable = sortable.sort((a, b) => (a[2] as number) - (b[2] as number));

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
                labels: sortable.map(s => s[0] as string),
                datasets: [{
                  label: 'Score per question',
                  backgroundColor: 'rgba(255,99,132,0.2)',
                  borderColor: 'rgba(255,99,132,1)',
                  borderWidth: 1,
                  hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                  hoverBorderColor: 'rgba(255,99,132,1)',
                  data: sortable.map(s => s[1] as number)
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
