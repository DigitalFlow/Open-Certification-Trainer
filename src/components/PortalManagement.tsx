import * as React from "react";
import { Tab, Row, Col, NavItem, Nav, Table, Jumbotron, Well } from "react-bootstrap";
import IBaseProps from "../domain/IBaseProps";
import DbUser from "../model/DbUser";
import DbPost from "../model/DbPost";
import UserListView from "./UserListView";
import PostListView from "./PostListView";

export class PortalManagementState {
  users: Array<DbUser>;
  posts: Array<DbPost>;
  postInput: string;
}

export default class PortalManagement extends React.Component<IBaseProps, PortalManagementState> {
    constructor(props: IBaseProps){
      super(props);

      this.state = {
        users: [],
        posts: [],
        postInput: "Demo"
      };

      this.setInput = this.setInput.bind(this);
      this.fetchUsers = this.fetchUsers.bind(this);
      this.fetchPosts = this.fetchPosts.bind(this);
    }

    fetchUsers(){
      return fetch("/userList",
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

    fetchPosts(){
      return fetch("/posts",
      {
        credentials: 'include'
      })
      .then(results => {
        return results.json();
      })
      .then((posts: Array<DbPost>) => {
          this.setState({
              posts: posts
          });
      });
    }

    componentDidMount(){
      this.fetchUsers();
      this.fetchPosts();
    }

    setInput(e: any) {
      this.setState({postInput: e.target.value});
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
                <NavItem eventKey="posts">
                  Posts
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
                        {this.state.users.map(u => { return (<UserListView key={u.id} user={u} />)})}
                      </tbody>
                      </Table>
                  </Tab.Pane>
                  <Tab.Pane eventKey="groups">
                    <Jumbotron><h2>Groups - In construction</h2></Jumbotron>
                  </Tab.Pane>
                  <Tab.Pane eventKey="posts">
                  <Table striped bordered condensed hover>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Created On</th>
                        </tr>
                    </thead>
                    <tbody>
                      {this.state.posts.map(p => { return (<PostListView key={p.id} post={p} />)})}
                    </tbody>
                    </Table>
                  </Tab.Pane>
                </Tab.Content>
              </Well>
            </Col>
          </Row>
      </Tab.Container>);
  }
}
