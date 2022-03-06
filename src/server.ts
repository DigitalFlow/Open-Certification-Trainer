import express from "express";
import * as bodyParser from "body-parser";
import * as logger from "morgan";
import * as dotenv from "dotenv";
import * as path from "path";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import * as http from "http";
import * as https from "https";
import * as fs from "fs";
import helmet from "helmet";

// Load environment variables
dotenv.config({ path: ".env.config" });

// No d.ts yet
const vhost = require("vhost");

// Controllers
import * as userController from "./controllers/UserController.js";
import * as homeController from "./controllers/HomeController.js";
import * as courseController from "./controllers/CourseController.js";
import * as assessmentSessionController from "./controllers/AssessmentSessionController.js";
import * as postController from "./controllers/PostController.js";

// Load authenticator
import { Authentication } from "./domain/Authentication.js";
import { IsAuthenticated, IsAdmin } from "./domain/AuthRestrictions.js";

// Connect to MySQL
import { pool, sequelize, User } from "./domain/DbConnection.js";

console.log("Authenticating sequelize 05:50");

sequelize.authenticate({ logging: true })
  .then(() => {
    console.log("Creating scheme using sequelize");
    return sequelize.createSchema("open_certification_trainer", { logging: true });
  })
  .then(() => {
    console.log("Scheme created");
    return sequelize.sync({ logging: true });
  })
  .then(() => {
    console.log("Scheme synced");
    return pool.query("set schema 'open_certification_trainer'");
  })
  .then(() => {
    console.log("Connected to database");
    return pool.query("SELECT id from open_certification_trainer.user WHERE id = 'f39f13b4-b8c6-4013-ace6-087a45dbd23d'");
  })
  .then((result) => {
    if (result.rows.length) {
      console.log("Admin user is existing");
      return;
    }
    else {
      console.log("Admin user is missing, creating it");
      return pool.query("INSERT INTO open_certification_trainer.user (id, user_name, email, is_admin, password_hash, first_name, last_name) VALUES ('f39f13b4-b8c6-4013-ace6-087a45dbd23d', 'root', 'root@local.domain', true, '$2a$10$covQWp6GhzWOIik3T6oiveFVnIxTVG7X1c9ziHRM3jTiEFPT0cjd2', 'root', 'root')");
    }
  })
  .then((result) => {
    if (result) {
      console.log("Admin user created successfully");
    }
  })
  .catch(err => {
    console.log("Database connection error. Please make sure the database is running and your config in .env.config is correct. Error: " + err.message);
    process.exit();
  });

// Connect to MySql
process.on("SIGINT", function() {
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

app.use(helmet());
app.use(cookieParser());
app.use(Authentication);
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

/**
 * Express configuration.
 */
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.json({ limit: "10mb" }));
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
app.get("/assessmentSessionCollection/:certificationUniqueName", IsAuthenticated, assessmentSessionController.getCertificationSessions);
app.post("/assessmentSession", IsAuthenticated, assessmentSessionController.postAssessmentSession);
app.delete("/assessmentSession/:certificationUniqueName", IsAuthenticated, assessmentSessionController.deleteAssessmentSession);

app.get("/posts", IsAuthenticated, postController.getPosts);
app.get("/posts/:postId", IsAuthenticated, postController.getPost);
app.post("/posts/:postId", IsAdmin, postController.upsertPost);
app.delete("/posts/:postId", IsAdmin, postController.deletePost);

// Always return the main index.html, so react-router renders the route in the client
app.get("*", homeController.getAll);

const PORT = process.env.PORT || 8080;

let appHost = app;
const host = process.env.CERT_TRAINER_VHOST || "localhost";

if (process.env.CERT_TRAINER_VHOST) {
  appHost = express();
  appHost.use(vhost(process.env.CERT_TRAINER_VHOST, app)); // Serves top level domain via Main server app
}

let server;

if (process.env.CERT_TRAINER_HTTPS) {
  const options = {
    cert: fs.readFileSync(process.env.CERT_TRAINER_CERT),
    key: fs.readFileSync(process.env.CERT_TRAINER_KEY)
  };

  server = https.createServer(options, appHost).listen(PORT);
}
else {
  server = http.createServer(appHost).listen(PORT);
}

console.log(`App listening on host ${ host } and port ${ PORT }!`);

export default server;