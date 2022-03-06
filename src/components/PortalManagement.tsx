import * as React from "react";
import { Tab, Row, Col, NavItem, Nav, Table, Jumbotron, Well } from "react-bootstrap";
import IBaseProps from "../domain/IBaseProps";
import DbUser from "../model/DbUser";
import DbPost from "../model/DbPost";
import UserListView from "./UserListView";
import PostListView from "./PostListView";
import { withRouter } from "react-router-dom";

export class PortalManagementState {
  users: Array<DbUser>;
  posts: Array<DbPost>;
  postInput: string;
}

class PortalManagement extends React.Component<IBaseProps, PortalManagementState> {
    constructor(props: IBaseProps) {
      super(props);

      this.state = {
        users: [],
        posts: [],
        postInput: "Demo"
      };
    }

    render() {
      return (
        <Tab.Container id="left-tabs-example" defaultActiveKey="users">
          <Row className="clearfix">
            <Col sm={ 1 }>
              <Nav bsStyle="pills" stacked>
                <NavItem eventKey="users">
                  Users
                </NavItem>
                <NavItem eventKey="groups">
                  Groups
                </NavItem>
                <NavItem eventKey="posts">
                  Posts
                </NavItem>
              </Nav>
            </Col>
            <Col sm={ 11 }>
              <Well>
                <Tab.Content animation>
                  <Tab.Pane eventKey="users">
                    <UserListView {...this.props} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="groups">
                    <Jumbotron><h2>Groups - In construction</h2></Jumbotron>
                  </Tab.Pane>
                  <Tab.Pane eventKey="posts">
                    <PostListView {...this.props} />
                  </Tab.Pane>
                </Tab.Content>
              </Well>
            </Col>
          </Row>
      </Tab.Container>);
  }
}

export default withRouter(PortalManagement);