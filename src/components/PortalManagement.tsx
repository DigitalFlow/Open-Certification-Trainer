import * as React from "react";
import { Tab, Row, Col, NavItem, Nav, Table, Jumbotron, Well } from "react-bootstrap";
import IBaseProps from "../domain/IBaseProps";
import DbUser from "../model/DbUser";
import UserListView from "./UserListView";

export class PortalManagementState {
  users: Array<DbUser>;
}

export default class PortalManagement extends React.Component<IBaseProps, PortalManagementState> {
    constructor(props: IBaseProps){
      super(props);

      this.state = {
        users: []
      };
    }

    componentDidMount(){
      fetch("/userList",
      {
        credentials: 'include'
      })
      .then(results => {
        return results.json();
      })
      .then((users: Array<DbUser>) => {
          this.setState({
              users: users
          });
      });
    }

    render(){
      return (
        <Tab.Container id="left-tabs-example" defaultActiveKey="users">
          <Row className="clearfix">
            <Col sm={1}>
              <Nav bsStyle="pills" stacked>
                <NavItem eventKey="users">
                  Users
                </NavItem>
                <NavItem eventKey="groups">
                  Groups
                </NavItem>
              </Nav>
            </Col>
            <Col sm={11}>
              <Well>
                <Tab.Content animation>
                  <Tab.Pane eventKey="users">
                    <Table striped bordered condensed hover>
                      <thead>
                          <tr>
                              <th>Username</th>
                              <th>First Name</th>
                              <th>Last Name</th>
                              <th>E-Mail</th>
                              <th>Is Admin</th>
                          </tr>
                      </thead>
                      <tbody>
                        {this.state.users.map(u => { return (<UserListView key={u.user_name} user={u} />)})}
                      </tbody>
                      </Table>
                  </Tab.Pane>
                  <Tab.Pane eventKey="groups">
                    <Jumbotron><h2>Groups - In construction</h2></Jumbotron>
                  </Tab.Pane>
                </Tab.Content>
              </Well>
            </Col>
          </Row>
      </Tab.Container>);
  }
}
