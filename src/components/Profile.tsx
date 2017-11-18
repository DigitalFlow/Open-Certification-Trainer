import * as React from "react";
import { Well, Button, Jumbotron, FormGroup, ControlLabel, FormControl, HelpBlock } from "react-bootstrap";
import FieldGroup from "./FieldGroup";
import DbUser from "../model/DbUser";
import UserDetail from "../model/UserDetail";
import ValidationResult from "../model/ValidationResult";
import MessageBar from "./MessageBar";
import IBaseProps from "../domain/IBaseProps";

export interface ProfileProps extends IBaseProps {
    redirectComponent: string;
}

interface ProfileState {
    userName: string,
    firstName: string,
    lastName: string,
    password: string,
    repeatPassword: string,
    email: string,
    errors: Array<string>;
    message: string;
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export default class Profile extends React.PureComponent<ProfileProps, ProfileState> {
    constructor(props: ProfileProps) {
        super(props);

        this.state = {
          userName: "",
          firstName: "",
          lastName: "",
          password: "",
          repeatPassword: "",
          email: "",
          errors: [],
          message: ""
        }

        this.setUsername = this.setUsername.bind(this);
        this.setFirstName = this.setFirstName.bind(this);
        this.setLastName = this.setLastName.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.repeatPassword = this.repeatPassword.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.update = this.update.bind(this);
        this.retrieveUser = this.retrieveUser.bind(this);
    }

    componentDidMount(){
      this.retrieveUser();
    }

    retrieveUser(){
      fetch("/retrieveProfile",
      {
        credentials: 'include'
      })
      .then(results => {
        return results.json();
      })
      .then((user: DbUser) => {
          this.setState({
              userName: user.user_name,
              firstName: user.first_name,
              lastName: user.last_name,
              password: "",
              repeatPassword: "",
              email: user.email,
              errors: [],
              message: ""
          });
      });
    }

    setUsername(e: any){
        this.setState({userName: e.target.value})
    }

    setFirstName(e: any){
        this.setState({firstName: e.target.value})
    }

    setLastName(e: any){
        this.setState({lastName: e.target.value})
    }

    setPassword(e: any){
      this.setState({password: e.target.value})
    }

    repeatPassword(e: any){
      this.setState({repeatPassword: e.target.value})
    }

    setEmail(e: any){
      this.setState({email: e.target.value})
    }

    update(){
      if (this.state.password !== this.state.repeatPassword){
        return this.setState({errors: ["Password and repeat passwords don't match, please enter them again."]})
      }

      let headers = new Headers();
      headers.set("Content-Type", "application/json");

      fetch("/profile",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(new UserDetail({
          userName: this.state.userName,
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          password: this.state.password,
          email: this.state.email
        })),
        credentials: 'include'
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
            message: "Success! Profile updated.",
            errors: []
          });
        }
      });
    }

    render(){
        return (
          <Well>
            <MessageBar message= {this.state.message} errors={this.state.errors} />
            <Jumbotron>
              <h1>Profile</h1>
                <form action="javascript:void(0);">
                  <FieldGroup
                    id="firstNameText"
                    control={{type: "text", value:this.state.firstName, placeholder:"Enter first name", onChange: this.setFirstName}}
                    label="First Name"
                  />
                  <FieldGroup
                    id="lastNameText"
                    control={{type: "text", value:this.state.lastName, placeholder:"Enter last name", onChange: this.setLastName}}
                    label="Last Name"
                  />
                  <FieldGroup
                    id="userNameText"
                    control={{type: "text", value:this.state.userName, placeholder:"Enter username", onChange: this.setUsername}}
                    label="Username"
                  />
                  <FieldGroup
                    id="formControlsEmail"
                    control={{type: "text", value:this.state.email, placeholder:"Enter email", onChange: this.setEmail}}
                    label="E-Mail"
                  />
                  <FieldGroup
                    id="formControlsPassword"
                    control={{type: "password", value:this.state.password, placeholder:"Enter password", onChange: this.setPassword}}
                    label="Password"
                  />
                  <FieldGroup
                    id="formControlsRepeatPassword"
                    control={{type: "password", value:this.state.repeatPassword, placeholder:"Repeat password", onChange: this.repeatPassword}}
                    label="Repeat Password"
                  />
                  <Button onClick={this.update} type="submit">
                    Submit
                  </Button>
                </form>
            </Jumbotron>
          </Well>
        );
    }
}
