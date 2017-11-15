import * as React from "react";
import Header from "./Header";
import Main from "./Main";
import ValidationResult from "../model/ValidationResult";
import UserInfo from "../model/UserInfo";

export interface AppState {
  user: UserInfo;
}

export default class App extends React.PureComponent<any, AppState> {
  constructor(props: any){
    super(props);

    this.state = {
      user: null
    }
  }

  componentDidMount(){
    fetch("/login",
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
          this.setState({user: result.userInfo});
      }
    });
  }

  shouldComponentUpdate(nextProps: any){
    return true;
  }

  render(){
    return (
      <div>
        <Header user={this.state.user} />
        <Main user={this.state.user}/>
      </div>
    );
  }
}
