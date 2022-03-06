import * as React from "react";
import { StaticRouter } from "react-router-dom";
import { renderToString } from "react-dom/server";
import { Request, Response, NextFunction } from "express";
import App from "../components/App.js";

export const getAll = (req: Request, res: Response) => {
    const props = { location: req.url, context: { } };
    const router = React.createElement(StaticRouter, props, React.createElement(App));
    const html = renderToString(router);

    return res.render("index", { html });
};
