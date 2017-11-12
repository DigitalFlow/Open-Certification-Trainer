import * as express from "express";
import * as bodyParser from "body-parser";
import * as logger from "morgan";
import * as dotenv from "dotenv";
import * as path from "path";
import * as mongoose from "mongoose";
import * as passport from "passport";
import * as morgan from "morgan";
// No d.ts yet
const vhost = require("vhost");

// Controllers
import * as userController from "./controllers/UserController";
import * as homeController from "./controllers/HomeController";
import * as courseController from "./controllers/CourseController";

// models
import UserModel from "./model/User";

// Load environment variables
dotenv.config({ path: ".env.config" });

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
// mongoose.Promise = global.Promise;
/*mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);

mongoose.connection.on("error", () => {
  console.log("MongoDB connection error. Please make sure MongoDB is running.");
  process.exit();
});
*/
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

/**
 * Express configuration.
 */
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use(express.static(path.resolve(__dirname, "..", "dist")));

/**
* Primary app routes.
*/
app.post("/login", userController.postLogin);
app.post("/signup", userController.postSignup);
app.get("/courses", courseController.getCourseOverview);
app.get("/courses/:courseName", courseController.getCourse);
app.post("/certificationUpload", courseController.postUpload);

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
