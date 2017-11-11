import * as React from "react";
import { StaticRouter } from "react-router-dom";
import { renderToString } from 'react-dom/server'
import { Request, Response, NextFunction } from "express";
import App from "../components/App";

export let getAll = (req: Request, res: Response) => {
		let props = {location: req.url, context: {}};
		let router = React.createElement(StaticRouter, props, React.createElement(App));
		let html = renderToString(router);

		return res.render('index', {html})
};
