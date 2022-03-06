import * as React from "react";
import { Well, Jumbotron } from "react-bootstrap";
import ValidationResult from "../model/ValidationResult";
import MessageBar from "./MessageBar";
import IBaseProps from "../domain/IBaseProps";
import { withRouter } from "react-router-dom";

export interface LogoutState {
  errors: Array<string>;
}

class Logout extends React.PureComponent<IBaseProps, LogoutState> {
    constructor(props: IBaseProps) {
        super(props);

        this.state = {
            errors: []
        };
    }

    componentDidMount() {
        fetch("/logout",
        {
            method: "POST",
            headers: [
                ["Content-Type", "application/json"]
            ],
            credentials: "include",
            body: JSON.stringify({ })
        })
        .then(results => {
          return results.json();
        })
        .then((result: ValidationResult) => {
          if (result.success) {
            this.props.triggerUserReload();
            this.props.history.push("/index");
          }
          else {
            this.setState({ errors: result.errors });
          }
        })
        .catch(err => {
          this.setState({ errors: [err.message] });
        });
    }

    render() {
        return (
            <Well>
            <MessageBar errors={ this.state.errors } />
            </Well>
        );
    }
}

export default withRouter(Logout);