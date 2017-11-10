import * as React from "react";
import { Switch, Route } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { renderRoutes } from "react-router-config";
import routes from "../routes"

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
const Main = () => (
    <main>
      <Switch>
        {renderRoutes(routes)}
      </Switch>
    </main>
)

export default Main
