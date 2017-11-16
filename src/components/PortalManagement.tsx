import * as React from "react";
import { Tab, Row, Col, NavItem, Nav, Jumbotron } from "react-bootstrap";
import IBaseProps from "../domain/IBaseProps";

export default class CertificationManagement extends React.Component<IBaseProps, undefined> {
    constructor(props: IBaseProps){
      super(props);
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
              <Tab.Content animation>
                <Tab.Pane eventKey="users">
                  <Jumbotron><h2>Users - In construction</h2></Jumbotron>
                </Tab.Pane>
                <Tab.Pane eventKey="groups">
                  <Jumbotron><h2>Groups - In construction</h2></Jumbotron>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
      </Tab.Container>);
  }
}
