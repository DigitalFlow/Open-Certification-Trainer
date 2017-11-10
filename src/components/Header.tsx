import * as React from "react";
import { Well, Navbar, Nav, NavItem, MenuItem, NavDropdown, Jumbotron } from "react-bootstrap";
import { LinkContainer, IndexLinkContainer } from "react-router-bootstrap";
import CertificationOverview from "./CertificationOverview";
import Assessment from "./Assessment";
import Certification from "../model/Certification";

export interface HeaderProps { }

class HeaderState {
  certification: Certification;
}

export default class Header extends React.PureComponent<HeaderProps, HeaderState> {
  fileInput: HTMLInputElement;

  constructor(props: HeaderProps){
      super(props);
      this.loadFile = this.loadFile.bind(this);
      this.receivedText = this.receivedText.bind(this);

      this.state = {
        certification: null
      };
  }

  loadFile() : void {
      if (!this.fileInput.files) {
          alert("This browser doesn't seem to support the `files` property of file inputs.");
          return;
      }

      let file = this.fileInput.files[0];

      if (!file) {
          alert("Please select a file before clicking 'Load'");
          return;
      }

      let fileReader = new FileReader();
      fileReader.onload = this.receivedText;
      fileReader.readAsText(file);
  }

  receivedText(e: Event) {
      let target: any = e.target;
      var certification = JSON.parse(target.result) as Certification;
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
          </Navbar.Collapse>
        </Navbar>
      );
  }
}
