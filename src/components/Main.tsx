import * as React from "react";
import { Switch, Route } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { renderRoutes } from "react-router-config";
import routes from "../routes"

const Main = () => (
    <main>
      <Switch>
        {renderRoutes(routes)}
      </Switch>
    </main>
)

export default Main
