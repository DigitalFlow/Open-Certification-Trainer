import * as express from "express";
import * as morgan from "morgan";
import * as path from "path";
import * as fs from "fs";
import CourseList from "./model/CourseList";
import * as React from "react";
import { StaticRouter } from "react-router-dom";
import { renderToString } from 'react-dom/server'
import { matchRoutes } from "react-router-config";
import routes from "./routes";
import App from "./components/App";

const server = express();

server.set('views', path.join(__dirname, "views"))
server.set('view engine', 'ejs')
// Setup logger
server.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
server.use(express.static(path.resolve(__dirname, '..', 'dist')));

server.get('/courses/:courseName', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'dist', 'courses', req.params.courseName + ".json"));
});

server.get('/courses', (req, res) => {
  let courseDir = path.resolve(__dirname, '..', 'dist', 'courses');

  fs.readdir(courseDir, (err, files) => {
    res.json(new CourseList({courses: files}));
  });
});

// Always return the main index.html, so react-router render the route in the client
server.get('*', (req, res) => {
		let props = {location: req.url, context: {}};
		let router = React.createElement(StaticRouter, props, React.createElement(App));
		let html = renderToString(router);

		return res.render('index', {html})
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

module.exports = server;
