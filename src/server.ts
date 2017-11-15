import * as express from "express";
import * as bodyParser from "body-parser";
import * as logger from "morgan";
import * as dotenv from "dotenv";
import * as path from "path";
import * as morgan from "morgan";
import * as cookieParser from "cookie-parser";

// Load environment variables
dotenv.config({ path: ".env.config" });

// No d.ts yet
const vhost = require("vhost");

// Controllers
import * as userController from "./controllers/UserController";
import * as homeController from "./controllers/HomeController";
import * as courseController from "./controllers/CourseController";

// Load authenticator
import { Authentication } from "./domain/Authentication";
import { AuthFilter } from "./domain/AuthRedirect";
// models
import UserModel from "./model/User";

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
app.post("/signup", userController.postSignup);
app.get("/courses", courseController.getCourseOverview);
app.get("/courses/:courseName", courseController.getCourse);
app.post("/certificationApi", AuthFilter, courseController.postUpload);
app.get("/certificationApi/:courseName", AuthFilter, courseController.downloadCert);
app.delete("/certificationApi/:courseName", AuthFilter, courseController.deleteCert);

// Always return the main index.html, so react-router renders the route in the client
app.get("*", homeController.getAll);

const PORT = process.env.PORT || 8080;

let appHost = app;
let host = process.env.CERT_TRAINER_VHOST || "localhost";

if(process.env.CERT_TRAINER_VHOST){
  appHost = express();
  appHost.use(vhost(process.env.CERT_TRAINER_VHOST, app)); // Serves top level domain via Main server app
}

appHost.listen(PORT, () => {
  console.log(`App listening on host ${host} and port ${PORT}!`);
});

module.exports = appHost;
