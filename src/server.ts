import * as express from "express";
import * as bodyParser from "body-parser";
import * as logger from "morgan";
import * as dotenv from "dotenv";
import * as path from "path";
import * as morgan from "morgan";
import * as cookieParser from "cookie-parser";
import * as http from "http";
import * as https from "https";
import * as fs from "fs";

// Load environment variables
dotenv.config({ path: ".env.config" });

// No d.ts yet
const vhost = require("vhost");

// Controllers
import * as userController from "./controllers/UserController";
import * as homeController from "./controllers/HomeController";
import * as courseController from "./controllers/CourseController";
import * as assessmentSessionController from "./controllers/AssessmentSessionController";

// Load authenticator
import { Authentication } from "./domain/Authentication";
import { IsAuthenticated, IsAdmin } from "./domain/AuthRestrictions";

// Connect to MySQL
import pool from "./domain/DbConnection";

pool.query("set schema 'open_certification_trainer'")
  .then(() => {
    console.log("Connected to database.");
  })
  .catch(err => {
    console.log("Database connection error. Please make sure the database is running and your config in .env.config is correct. Error: " + err.message);
    process.exit();
  });

// Connect to MySql
process.on('SIGINT', function() {
  console.log("Closing database connection");

  pool.end()
  .then(() => {
    console.log("Successfully terminated pool");
    process.exit();
  })
  .catch(err => {
      console.log("Failed closing pool, doing a force exit");
      process.exit();
  });
});

/**
 * Create Express server.
 */
const app = express();

app.use(cookieParser());
app.use(Authentication);
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

/**
 * Express configuration.
 */
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.resolve(__dirname, "..", "dist")));

/**
* Primary app routes.
*/
app.post("/login", userController.postLogin);
app.post("/logout", userController.postLogout);
app.get("/retrieveProfile/:userId", IsAdmin, userController.getProfile);
app.get("/retrieveProfile", IsAuthenticated, userController.getProfile);
app.get("/userList", IsAdmin, userController.getUserList);
app.post("/profile/:userId", IsAdmin, userController.postProfile);
app.post("/profile", IsAuthenticated, userController.postProfile);
app.post("/signup", userController.postSignup);

app.get("/courses", IsAuthenticated, courseController.getCourseOverview);
app.get("/courses/:courseName", IsAuthenticated, courseController.getCourse);

app.post("/certificationApi", IsAdmin, courseController.postUpload);
app.get("/certificationApi/:courseName", IsAdmin, courseController.downloadCert);
app.delete("/certificationApi/:courseName", IsAdmin, courseController.deleteCert);

app.get("/assessmentSession/:certificationUniqueName", IsAuthenticated, assessmentSessionController.getAssessmentSession);
app.post("/assessmentSession", IsAuthenticated, assessmentSessionController.postAssessmentSession);
app.delete("/assessmentSession/:certificationUniqueName", IsAuthenticated, assessmentSessionController.deleteAssessmentSession);

// Always return the main index.html, so react-router renders the route in the client
app.get("*", homeController.getAll);

const PORT = process.env.PORT || 8080;

let appHost = app;
let host = process.env.CERT_TRAINER_VHOST || "localhost";

if(process.env.CERT_TRAINER_VHOST){
  appHost = express();
  appHost.use(vhost(process.env.CERT_TRAINER_VHOST, app)); // Serves top level domain via Main server app
}

let server;

if (process.env.CERT_TRAINER_HTTPS){
  const options = {
    cert: fs.readFileSync(process.env.CERT_TRAINER_CERT),
    key: fs.readFileSync(process.env.CERT_TRAINER_KEY)
  };

  server = https.createServer(options, appHost).listen(PORT);
}
else {
  server = http.createServer(appHost).listen(PORT);
}

console.log(`App listening on host ${host} and port ${PORT}!`);
module.exports = server;
