import * as React from "react";
import { Well, Button, Jumbotron, FormGroup, ControlLabel, FormControl, HelpBlock } from "react-bootstrap";
import FieldGroup from "./FieldGroup";
import Authentication from "../model/Authentication"
import ValidationResult from "../model/ValidationResult";
import MessageBar from "./MessageBar";

export interface LoginProps {
    redirectComponent: string;
    history: any;
}

interface LoginState {
    userName: string,
    password: string,
    email: string,
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
          email: "",
          errors: []
        }

        this.setUsername = this.setUsername.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.login = this.login.bind(this);
    }

    setUsername(e: any){
        this.setState({userName: e.target.value})
    }

    setPassword(e: any){
      this.setState({password: e.target.value})
    }

    setEmail(e: any){
      this.setState({email: e.target.value})
    }

    login(){
      let headers = new Headers();
      headers.set("Content-Type", "application/json");

      fetch("/login",
      {
        method: "POST",
        headers: headers,
        credentials: 'include',
        body: JSON.stringify(new Authentication({userName: this.state.userName, password: this.state.password, email: this.state.email}))
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
          this.setState({
            errors: []
          });
          window.location.href = "/index";
        }
      });
    }

    render(){
        return (
          <Well>
            <MessageBar errors={this.state.errors} />
            <Jumbotron>
              <h1>Login</h1>
                <form action="javascript:void(0);">
                  <FieldGroup
                    id="userNameText"
                    control={{type: "text", placeholder:"Enter username", onChange: this.setUsername}}
                    label="Username"
                  />
                  <FieldGroup
                    id="foEditorrmControlsPassword"
                    control={{type: "password", placeholder:"Enter password", onChange: this.setPassword}}
                    label="Password"
                  />
                  <Button onClick={this.login} type="submit">
                    Submit
                  </Button>
                </form>
            </Jumbotron>
          </Well>
        );
    }
}
