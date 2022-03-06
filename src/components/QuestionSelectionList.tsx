import * as React from "react";
import { InputGroup, FormControl, ButtonToolbar, ToggleButtonGroup, ToggleButton, Button, DropdownButton, MenuItem } from "react-bootstrap";
import Question from "../model/Question";
import AssessmentSession from "../model/AssessmentSession";
import QuestionSelection from "./QuestionSelection";
import FieldGroup from "./FieldGroup";
import IBaseProps from "../domain/IBaseProps";
import IAssociativeArray from "../domain/IAssociativeArray";
import { checkIfAnsweredCorrectly, calculateScorePerQuestion } from "../domain/AssessmentLogic";

export interface QuestionSelectionListProps extends IBaseProps {
  questions: Array<Question>;
  previousSessions: Array<AssessmentSession>;
  onSelectionChange: (questions: IAssociativeArray<boolean>) => void;
  selectedQuestions: IAssociativeArray<boolean>;
}

enum FilterType {
  GreaterEqual,
  LessEqual
}

interface QuestionSelectionListState {
  selectionByQuestionScoreEnabled: boolean;
  filterType: FilterType;
  filterValue: number;
}

export default class QuestionSelectionList extends React.PureComponent<QuestionSelectionListProps, QuestionSelectionListState> {
  constructor(props: QuestionSelectionListProps) {
    super(props);

    this.state = {
      selectionByQuestionScoreEnabled: false,
      filterType: FilterType.LessEqual,
      filterValue: 99
    };

    this.selectNone = this.selectNone.bind(this);
    this.selectAll = this.selectAll.bind(this);
    this.selectAnsweredIncorrectlyLastTime = this.selectAnsweredIncorrectlyLastTime.bind(this);
    this.selectByQuestionScore = this.selectByQuestionScore.bind(this);
    this.showByQuestionScoreFilter = this.showByQuestionScoreFilter.bind(this);
    this.hideByQuestionScoreFilter = this.hideByQuestionScoreFilter.bind(this);
    this.setFilterToLessEqual = this.setFilterToLessEqual.bind(this);
    this.setFilterToGreaterEqual = this.setFilterToGreaterEqual.bind(this);
    this.setFilterValue = this.setFilterValue.bind(this);
  }

  selectNone(e: any) {
    this.props.onSelectionChange(this.props.questions.reduce((acc, val) => { acc[val.id] = false; return acc; }, { } as IAssociativeArray<boolean>));
    this.hideByQuestionScoreFilter();
  }

  selectAll(e: any) {
    this.props.onSelectionChange(this.props.questions.reduce((acc, val) => { acc[val.id] = true; return acc; }, { } as IAssociativeArray<boolean>));
    this.hideByQuestionScoreFilter();
  }

  selectAnsweredIncorrectlyLastTime(e: any) {
    if (!e.target.checked) {
      return;
    }

    // Sorted by created on descending in SQL query
    const lastSession = this.props.previousSessions[0];
    const incorrectLastTime = lastSession.certification.questions.filter(q => !checkIfAnsweredCorrectly(q.answers, lastSession.answers[q.id].reduce((acc, val) => { acc[val] = true; return acc; }, { } as IAssociativeArray<boolean>)));

    this.props.onSelectionChange(this.props.questions.reduce((acc, val) => { acc[val.id] = incorrectLastTime.some(q => q.id === val.id); return acc; }, { } as IAssociativeArray<boolean>));
    this.hideByQuestionScoreFilter();
  }

  selectByQuestionScore(e: any) {
    const ratios = calculateScorePerQuestion(this.props.previousSessions);

    // Sorted by created on descending in SQL query
    const filteredRatios = Object.keys(ratios).filter(key => this.state.filterType === FilterType.LessEqual ? ratios[key] <= this.state.filterValue : ratios[key] >= this.state.filterValue );
    this.props.onSelectionChange(this.props.questions.reduce((acc, val) => { acc[val.id] = filteredRatios.some(q => q === val.id); return acc; }, { } as IAssociativeArray<boolean>));
  }

  hideByQuestionScoreFilter() {
    this.setState({
      selectionByQuestionScoreEnabled: false
    });
  }

  showByQuestionScoreFilter(e: any) {
    if (!e.target.checked) {
      return;
    }

    this.setState({
      selectionByQuestionScoreEnabled: true
    });
  }

  setFilterToGreaterEqual () {
    this.setState({
      filterType: FilterType.GreaterEqual
    });
  }

  setFilterToLessEqual () {
    this.setState({
      filterType: FilterType.LessEqual
    });
  }

  setFilterValue (e: any) {
    this.setState({
      filterValue: parseInt(e.target.value)
    });
  }

  render() {
    return (
      <div>
        <p>Please select the questions you want to train during this assessment</p>

        <ButtonToolbar style={ { "paddingBottom": "20px" } }>
          <ToggleButtonGroup type="radio" name="options" defaultValue={ 1 }>
            <ToggleButton onClick={ this.selectNone } value={ 1 }>None</ToggleButton>
            <ToggleButton onClick={ this.selectAll } value={ 2 }>All</ToggleButton>
            <ToggleButton disabled={ !this.props.previousSessions || !this.props.previousSessions.length } onClick={ this.selectAnsweredIncorrectlyLastTime } value={ 3 }>Answered Incorrectly Last Time</ToggleButton>
            <ToggleButton disabled={ !this.props.previousSessions || !this.props.previousSessions.length } onClick={ this.showByQuestionScoreFilter } value={ 4 }>Filter by Question Score</ToggleButton>
          </ToggleButtonGroup>
        </ButtonToolbar>

        { this.state.selectionByQuestionScoreEnabled &&
          <div style={ { "paddingBottom": "20px" } }>
            <InputGroup style={ { "paddingBottom": "10px" } }>
              <DropdownButton defaultValue="1" componentClass={ InputGroup.Button } id="input-dropdown" title={ this.state.filterType === FilterType.LessEqual ? "Less Equal" : "Greater Equal" }>
                <MenuItem onClick={ this.setFilterToLessEqual } key="1">Less Equal</MenuItem>
                <MenuItem onClick={ this.setFilterToGreaterEqual } key="2">Greater Equal</MenuItem>
              </DropdownButton>
              <FormControl type="number" value={ this.state.filterValue } onChange={ this.setFilterValue } />
            </InputGroup>
            <Button onClick={ this.selectByQuestionScore }>Apply</Button>
          </div>
        }

        {
          this.props.questions.map(q => <QuestionSelection {...this.props} key={ q.id } question={ q } isSelected={ this.props.selectedQuestions[q.id] } onSelectionChange={ this.props.onSelectionChange } />)
        }
      </div>
    );
  }
}
