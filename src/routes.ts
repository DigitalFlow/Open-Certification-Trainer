import CertificationOverview from "./components/CertificationOverview";
import Assessment from "./components/Assessment";
import WelcomePage from "./components/WelcomePage";
import { RouteConfig } from "react-router-config";

const routes = new Array<RouteConfig>(
	{ path: '/',
		exact: true,
		component: WelcomePage,
	},
  { path: '/index',
		exact: true,
		component: WelcomePage,
	},
	{ path: '/assessment/:courseName?',
		component: Assessment
	},
	{ path: '/certificationOverview/:courseName?',
		component: CertificationOverview
	}
);

export default routes
