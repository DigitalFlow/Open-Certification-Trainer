import * as React from "react";
import Header from "./Header";
import Main from "./Main";
import ValidationResult from "../model/ValidationResult";
import UserInfo from "../model/UserInfo";

export interface AppState {
  user: UserInfo;
}

export default class App extends React.PureComponent<any, AppState> {
  constructor(props: any) {
    super(props);

    this.state = {
      user: undefined
    };

    this.setUser = this.setUser.bind(this);
    this.triggerUserReload = this.triggerUserReload.bind(this);
  }

  componentDidMount() {
    this.setUser();
  }

  setUser() {
    fetch("/login",
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
          this.setState({ user: result.userInfo });
      }
      else {
          this.setState({ user: undefined });
      }
    });
  }

  shouldComponentUpdate(nextProps: any) {
    return true;
  }

  triggerUserReload() {
    this.setUser();
  }

  render() {
    return (
      <div>
        <Header {...this.props} user={ this.state.user } triggerUserReload={ this.triggerUserReload } />
        <Main {...this.props} user={ this.state.user } triggerUserReload={ this.triggerUserReload }/>
      </div>
    );
  }
}
