import * as React from "react";
import { Well, Button, Jumbotron, FormGroup, ControlLabel, FormControl, HelpBlock } from "react-bootstrap";
import FieldGroup from "./FieldGroup";
import UserDetail from "../model/UserDetail";
import ValidationResult from "../model/ValidationResult";
import MessageBar from "./MessageBar";
import IBaseProps from "../domain/IBaseProps";

export interface LoginProps extends IBaseProps {
    redirectComponent: string;
}

interface LoginState {
    userName: string;
    password: string;
    errors: Array<string>;
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export default class Login extends React.PureComponent<LoginProps, LoginState> {
    constructor(props: LoginProps) {
        super(props);

        this.state = {
          userName: "",
          password: "",
          errors: []
        };

        this.setUsername = this.setUsername.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.login = this.login.bind(this);
    }

    setUsername(e: any) {
        this.setState({ userName: e.target.value });
    }

    setPassword(e: any) {
      this.setState({ password: e.target.value });
    }

    login() {
      const headers = new Headers();
      headers.set("Content-Type", "application/json");

      fetch("/login",
      {
        method: "POST",
        headers: headers,
        credentials: "include",
        body: JSON.stringify(new UserDetail({
          userName: this.state.userName,
          password: this.state.password
        }))
      })
      .then(results => {
        return results.json();
      })
      .then((data: ValidationResult) => {
        if (!data.success) {
          this.setState({
            errors: data.errors
          });
        }
        else {
          // Reload so that App initializes again with User in state.
          this.props.triggerUserReload();
          this.props.history.push("/index");
        }
      });
    }

    render() {
        return (
          <Well>
            <MessageBar errors={ this.state.errors } />
            <Jumbotron>
              <h1>Login</h1>
                <form action="javascript: void(0);">
                  <FieldGroup
                    id="userNameText"
                    control={ { type: "text", placeholder: "Enter username", onChange: this.setUsername } }
                    label="Username"
                  />
                  <FieldGroup
                    id="foEditorrmControlsPassword"
                    control={ { type: "password", placeholder: "Enter password", onChange: this.setPassword } }
                    label="Password"
                  />
                  <Button onClick={ this.login } type="submit">
                    Submit
                  </Button>
                </form>
            </Jumbotron>
          </Well>
        );
    }
}
