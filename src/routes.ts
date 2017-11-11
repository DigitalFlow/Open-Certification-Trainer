import CertificationOverview from "./components/CertificationOverview";
import CertificationManagement from "./components/CertificationManagement";
import Assessment from "./components/Assessment";
import WelcomePage from "./components/WelcomePage";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { RouteConfig } from "react-router-config";

const routes = new Array<RouteConfig>(
	{
		path: "/",
		exact: true,
		component: WelcomePage,
	},
  {
		path: "/index",
		exact: true,
		component: WelcomePage,
	},
	{
		path: "/login",
		exact: true,
		component: Login,
	},
	{
		path: "/signUp",
		exact: true,
		component: SignUp,
	},
	{
		path: "/assessment/:courseName?",
		component: Assessment
	},
	{
		path: "/certificationManagement/:courseName?",
		component: CertificationManagement
	},
	{
		path: "/certificationOverview/:courseName?",
		component: CertificationOverview
	}
);

export default routes
