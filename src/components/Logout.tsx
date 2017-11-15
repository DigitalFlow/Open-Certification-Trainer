import * as React from "react";
import { Well, Jumbotron } from "react-bootstrap";
import ValidationResult from "../model/ValidationResult";
import MessageBar from "./MessageBar";

export interface LogoutProps {

}

export interface LogoutState {
  errors: Array<string>;
}

export default class Logout extends React.PureComponent<LogoutProps, LogoutState> {
  constructor(props: LogoutProps){
      super(props);

      this.state = {
        errors: []
      }
  }

  componentDidMount(){
    fetch("/logout",
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
        window.location.href = "/index";
      }
      else {
        this.setState({errors: result.errors});
      }
    })
    .catch(err => {
      this.setState({errors: [err.message]});
    });
  }

  render() {
      return (
        <Well>
        <MessageBar errors={this.state.errors} />
        </Well>
      );
  }
}
