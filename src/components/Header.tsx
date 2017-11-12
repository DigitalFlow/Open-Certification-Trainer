import * as React from "react";
import { Well, Navbar, Nav, NavItem, MenuItem, NavDropdown, Jumbotron } from "react-bootstrap";
import { LinkContainer, IndexLinkContainer } from "react-router-bootstrap";
import CertificationOverview from "./CertificationOverview";
import Assessment from "./Assessment";
import Certification from "../model/Certification";

export interface HeaderProps { }

export default class Header extends React.PureComponent<HeaderProps, undefined> {
  constructor(props: HeaderProps){
      super(props);
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
            <IndexLinkContainer to="/login">
              <NavItem>Login</NavItem>
            </IndexLinkContainer>
            <IndexLinkContainer to="/signUp">
              <NavItem>Sign Up</NavItem>
            </IndexLinkContainer>
          </Nav>
          </Navbar.Collapse>
        </Navbar>
      );
  }
}
