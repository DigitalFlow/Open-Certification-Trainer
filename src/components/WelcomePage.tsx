import * as React from "react";
import { Well, Jumbotron } from "react-bootstrap";
import IBaseProps from "../domain/IBaseProps";

export default class WelcomePage extends React.PureComponent<IBaseProps, undefined> {
  constructor(props: IBaseProps){
      super(props);
  }

  render(){
    return (
      <Well>
        <Jumbotron>
          <h1>Welcome {this.props.user && this.props.user.first_name}</h1>
          <p>Study certifications, test yourself and take assessments!{this.props.user ? "" : " Sign up or log in to get started"}</p>
        </Jumbotron>
      </Well>
    );
  }
}
