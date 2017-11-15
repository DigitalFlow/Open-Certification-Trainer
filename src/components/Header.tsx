import * as React from "react";
import { Well, Navbar, Nav, NavItem, MenuItem, NavDropdown, Jumbotron } from "react-bootstrap";
import { LinkContainer, IndexLinkContainer } from "react-router-bootstrap";
import CertificationOverview from "./CertificationOverview";
import Assessment from "./Assessment";
import Certification from "../model/Certification";
import UserInfo from "../model/UserInfo";
import ValidationResult from "../model/ValidationResult";

export interface HeaderProps {
  location?: Location;
}

export interface HeaderState {
  user: UserInfo;
}

export default class Header extends React.PureComponent<HeaderProps, HeaderState> {
  constructor(props: HeaderProps){
      super(props);

      this.state = {
        user: null
      }
  }

  componentDidMount(){
    fetch("/login",
    {
      method: "POST",
      headers: [
        ["Content-Type", "application/json"]
      ],
      credentials: 'include',
      body: JSON.stringify({})
    })
    .then(results => {
      return results.json();
    })
    .then((result: ValidationResult) => {
      if (result.success){
          this.setState({user: result.userInfo});
      }
    });
  }

  render() {
      return (
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
          <LinkContainer to="/index">
            <Navbar.Brand>
                Open Certification Trainer
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
          <Nav>
              <IndexLinkContainer to="/certificationManagement">
                <NavItem>Certification Management</NavItem>
              </IndexLinkContainer>
              <IndexLinkContainer to="/certificationOverview">
                <NavItem>Certification Overview</NavItem>
              </IndexLinkContainer>
              <IndexLinkContainer to="/assessment">
                <NavItem>Assessment</NavItem>
              </IndexLinkContainer>
          </Nav>
          <Nav pullRight>
            {!this.state.user && <IndexLinkContainer to="/login">
              <NavItem>Login</NavItem>
            </IndexLinkContainer>}
            {!this.state.user && <IndexLinkContainer to="/signUp">
              <NavItem>Sign Up</NavItem>
            </IndexLinkContainer>}
            {this.state.user && <IndexLinkContainer to="/profile">
              <NavItem>Profile</NavItem>
            </IndexLinkContainer>}
            {this.state.user && <IndexLinkContainer to="/logout">
              <NavItem>Logout</NavItem>
            </IndexLinkContainer>}
          </Nav>
          </Navbar.Collapse>
        </Navbar>
      );
  }
}
