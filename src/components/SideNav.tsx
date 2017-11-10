import * as React from "react";
import { Nav, NavItem } from "react-bootstrap";
import CourseList from "../model/CourseList";
import { LinkContainer } from "react-router-bootstrap";

export interface SideNavProps {
    redirectComponent: string;
}

interface SideNavState {
    courseList: CourseList;
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export default class SideNav extends React.PureComponent<SideNavProps, SideNavState> {
    constructor(props: SideNavProps) {
        super(props);

        this.state = {
          courseList: new CourseList({courses: []})
        }
    }

    componentDidMount(){
      fetch("/courses")
        .then(results => {
          return results.json();
        })
        .then(data => {
          this.setState({courseList: data as CourseList});
        });
    }

    render(){
        return (
          <Nav bsStyle="pills" className="col-xs-1" stacked activeKey={1}>
            <NavItem>Courses</NavItem>
            {this.state.courseList.courses ? this.state.courseList.courses.map(c => (
              <LinkContainer to={ "/" + this.props.redirectComponent + "/" + c}>
                <NavItem>{c}</NavItem>
              </LinkContainer>
              )
            ) : "" }
          </Nav>
        );
    }
}
