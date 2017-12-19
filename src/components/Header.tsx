import * as React from "react";
import { Well, Navbar, Nav, NavItem, MenuItem, NavDropdown, Jumbotron } from "react-bootstrap";
import { LinkContainer, IndexLinkContainer } from "react-router-bootstrap";
import CertificationOverview from "./CertificationOverview";
import Assessment from "./Assessment";
import Certification from "../model/Certification";
import UserInfo from "../model/UserInfo";
import ValidationResult from "../model/ValidationResult";
import IBaseProps from "../domain/IBaseProps";

export default class Header extends React.PureComponent<IBaseProps, undefined> {
  constructor(props: IBaseProps) {
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
              { this.props.user &&
                <IndexLinkContainer to="/certificationOverview">
                  <NavItem>Certification Overview</NavItem>
                </IndexLinkContainer>
              }
              { this.props.user &&
                <IndexLinkContainer to="/assessment">
                  <NavItem>Assessment</NavItem>
                </IndexLinkContainer>
              }
              { this.props.user &&
                <IndexLinkContainer to="/assessmentHistory">
                  <NavItem>Assessment History</NavItem>
                </IndexLinkContainer>
              }
              { this.props.user && this.props.user.is_admin &&
                <IndexLinkContainer to="/certificationManagement">
                  <NavItem>Certification Management</NavItem>
                </IndexLinkContainer>
              }
              { this.props.user && this.props.user.is_admin &&
                <IndexLinkContainer to="/portalManagement">
                  <NavItem>Portal Management</NavItem>
                </IndexLinkContainer>
              }
          </Nav>
          <Nav pullRight>
            { !this.props.user && <IndexLinkContainer to="/login">
              <NavItem>Login</NavItem>
            </IndexLinkContainer> }
            { !this.props.user && <IndexLinkContainer to="/signUp">
              <NavItem>Sign Up</NavItem>
            </IndexLinkContainer> }
            { this.props.user && <IndexLinkContainer to="/profile">
              <NavItem>Profile</NavItem>
            </IndexLinkContainer> }
            { this.props.user && <IndexLinkContainer to="/logout">
              <NavItem>Logout</NavItem>
            </IndexLinkContainer> }
          </Nav>
          </Navbar.Collapse>
        </Navbar>
      );
  }
}
