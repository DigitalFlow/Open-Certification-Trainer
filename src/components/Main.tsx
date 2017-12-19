import * as React from "react";
import { Switch, Route } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { renderRoutes } from "react-router-config";
import routes from "../routes";
import IBaseProps from "../domain/IBaseProps";
import UserInfo from "../model/UserInfo";

export default class Main extends React.PureComponent<IBaseProps, undefined> {
  constructor(props: IBaseProps) {
      super(props);
  }

  shouldComponentUpdate() {
    return true;
  }

  render() {
    return (
      <main>
        <Switch>
          { renderRoutes(routes, { user: this.props.user, triggerUserReload: this.props.triggerUserReload }) }
        </Switch>
      </main>
    );
  }
}
